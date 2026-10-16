/* AYDA A1 • Real headless-mobile browser checks for non-destructive preview.
   This mocks access only for UI tests; genuine passwords remain AYDA-controlled. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const http=require("node:http");
const puppeteer=require("puppeteer-core");
const root=path.resolve(__dirname,"..");
const executable=[
 process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable",
 "/usr/bin/chromium","/usr/bin/chromium-browser"
].find(x=>x&&fs.existsSync(x));
if(!executable)throw Error("Headless Chrome is unavailable");
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",
 ".js":"text/javascript; charset=utf-8",".png":"image/png",".svg":"image/svg+xml"};
const server=http.createServer((request,response)=>{
 try{
  const name=new URL(request.url,"http://localhost").pathname;
  const file=path.resolve(root,"."+decodeURIComponent(name));
  if(!file.startsWith(root+path.sep))throw Error("Forbidden path");
  const target=fs.statSync(file).isDirectory()?path.join(file,"index.html"):file;
  response.writeHead(200,{"content-type":mime[path.extname(target)]||"application/octet-stream"});
  response.end(fs.readFileSync(target));
 }catch{response.writeHead(404);response.end("Not found")}
});
async function main(){
 await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
 const port=server.address().port;
 const browser=await puppeteer.launch({executablePath:executable,headless:true,
 args:["--no-sandbox","--disable-dev-shm-usage"]});
 const page=await browser.newPage();
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.setRequestInterception(true);
 page.on("request",req=>{
  const url=req.url();
  if(url.includes("ayda-pass/access-control.js")){
   req.respond({status:200,contentType:"text/javascript",
    body:"/* Access UI unlocked by authorized test script only; no real credentials used. */"});
  }else if(url.startsWith("http://127.0.0.1:"))req.continue();
  else req.abort();
 });
 try{
  await page.goto("http://127.0.0.1:"+port+"/preview/",{waitUntil:"domcontentloaded"});
  await page.waitForSelector(".hero-card .primary-button",{timeout:15000});
  assert.ok(await page.$eval("#aydaLoginBox .ayda-login-logo",
     node=>getComputedStyle(node).backgroundImage.includes("data:image/png")),
    "Real AYDA logo should appear on protected entry card.");
  assert.ok(await page.$eval(".hero-card",node=>node.getBoundingClientRect().height<470),
    "The A1 homepage hero must be compact, not a giant empty banner.");
  assert.ok(await page.$eval(".site-header",
     node=>getComputedStyle(node).backgroundColor==="rgb(11, 27, 49)"),
    "A1 header must use the same deep navy as the B1 design system.");
  assert.ok(await page.$eval("#aydaProtectedContent",node=>getComputedStyle(node).display==="none"),
   "Unauthenticated students must not see learning content");
  assert.ok(await page.$eval("#aydaA1QuickDock",node=>node.hidden),
   "Unauthenticated students must not see course shortcuts");
  await page.evaluate(()=>{
   document.getElementById("aydaLoginBox").style.display="none";
   document.getElementById("aydaProtectedContent").style.display="block";
  });
  await page.waitForSelector("#aydaA1Journey",{timeout:8000});
  assert.equal(await page.$eval("#aydaA1Journey",root=>root.querySelectorAll(".ayda-a1-journey-step").length),3,
    "A1 homepage must show the three-step learning pathway.");
  await page.waitForFunction(()=>document.querySelector(".site-header .brand")?.classList.contains("ayda-logo-applied"));
  await fs.promises.mkdir(path.join(root,"screenshots"),{recursive:true});
  await page.screenshot({path:path.join(root,"screenshots","a1-home-mobile.png"),fullPage:false});
  await page.$eval(".hero-card .primary-button",button=>button.click());
  await page.waitForSelector(".unit-intro");
  await page.waitForSelector("#aydaA1StudyNav",{timeout:7000}).catch(async error=>{
    console.error("INTRO DIAGNOSTIC",await page.evaluate(()=>({
      protectedDisplay:getComputedStyle(document.getElementById("aydaProtectedContent")).display,
      unitLabel:document.querySelector(".unit-intro__number")?.textContent,
      bodyState:{...document.body.dataset},
      quickDockPresent:!!document.getElementById("aydaA1QuickDock"),
      introPresent:!!document.querySelector(".lesson-shell .unit-intro"),
      firstIntro:document.querySelector(".unit-intro")?.innerHTML.slice(0,200)
    })),errors);
    throw error;
  });
  assert.equal(await page.$$eval("#aydaA1StudyNav [data-a1-tab]",a=>a.length),3,
    "Three in-page study tabs are required.");
  await page.waitForSelector(".ayda-a1-study-meta");
  assert.ok(await page.$eval(".ayda-a1-study-meta",node=>node.textContent.includes("24 soru")),
    "Learning route must clearly announce 24 questions and four mini sets.");
  await page.screenshot({path:path.join(root,"screenshots","a1-lesson-mobile.png"),fullPage:false});
  assert.ok(await page.$eval(".logic-explainer",node=>getComputedStyle(node).display!=="none"),
    "Full original explanation must show on Learn tab");
  assert.ok(await page.$eval("#aydaA1TeacherNote",node=>getComputedStyle(node).display!=="none"),
    "Additional Turkish grammar guidance must be visible");
  assert.ok(await page.$eval("#aydaA1QuickDock",node=>!node.hidden),
    "Optional bottom navigation must complement the in-page buttons");
  const originals=await page.$$eval(".video-resources__grid a",nodes=>nodes.map(n=>n.href));
  assert.equal(originals.length,3,"The original 3 videos per unit must be preserved");
  assert.ok(originals.every(x=>x.includes("drive.google.com/file/d/")),
    "Original video links must retain direct Drive URLs");
  // Visible in-page progression from Learn to Video, without bottom navigation.
  await page.$eval("#aydaA1Next",b=>b.click());
  await page.waitForFunction(()=>document.body.dataset.aydaA1Tab==="video");
  assert.ok(await page.$eval(".video-resources",n=>getComputedStyle(n).display!=="none"),
    "Video panel must become visible");
  const frame=await page.$eval("#aydaA1VideoFrame",n=>n.getAttribute("src"));
  assert.ok(/^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/preview$/.test(frame),
    "Original Drive videos must embed inside the lesson page");
  await page.$eval(".video-resources__grid a:nth-child(2)",b=>b.click());
  const second=await page.$eval("#aydaA1VideoFrame",n=>n.getAttribute("src"));
  assert.notEqual(second,frame,"Student should be able to choose different video");
  assert.equal(await page.$$eval(".video-resources__grid a",x=>x.length),3,
   "Selecting a video must never remove other videos");
  assert.ok(await page.$eval("#aydaA1External",n=>n.href.includes("drive.google.com")),
    "External video fallback should remain available");
  await page.$eval("#aydaA1Next",b=>b.click());
  await page.waitForFunction(()=>document.body.dataset.aydaA1Tab==="practice");
  assert.ok(await page.$eval("#aydaA1IntroHelp",n=>getComputedStyle(n).display!=="none"),
    "Practice tab should explain 4 × 6 question sets");
  assert.ok(await page.$eval(".unit-intro > button.primary-button",
   n=>getComputedStyle(n).display!=="none"),"Original start button must remain functional");
  await page.$eval("#aydaA1Next",b=>b.click());
  await page.waitForSelector(".exercise-shell .exercise-card");
  await page.waitForSelector("#aydaA1SetBar");
  assert.match(await page.$eval("#aydaA1SetTitle",n=>n.textContent),/Set 1\/4/,
    "Original first exercise belongs to first six-question set");
  await page.waitForSelector(".exercise-shell .exercise-action button",{timeout:9000});
  assert.ok(await page.$eval(".exercise-shell .exercise-action button",n=>!n.disabled),
    "Original answer checking control must still exist");
  assert.ok(await page.$eval(".exercise-topic-help",n=>!!n),
    "In-exercise original lesson explanation must remain");
  await page.$eval("#aydaA1SetBar .ayda-a1-setbar__actions button:nth-child(2)",b=>b.click());
  await page.waitForSelector(".unit-intro");
  await page.waitForFunction(()=>document.body.dataset.aydaA1Tab==="video");
  assert.ok(await page.$eval("#aydaA1VideoFrame",n=>(n.getAttribute("src")||"").includes("/preview")),
    "Video shortcut from exercise must restore embedded player");

  // Verify that all 24 original lessons still have original grammar, 3 video links
  // and the supplemental guidance. This is intentionally an actual browser test.
  await page.$eval(".lesson-shell > .back-button",b=>b.click());
  await page.waitForSelector(".module-list");
  for(let unit=1;unit<=24;unit++){
   const module=Math.ceil(unit/3),index=(unit-1)%3;
   await page.waitForFunction(()=>document.querySelectorAll(".module__header").length===8);
   const header=".module:nth-child("+module+") .module__header";
   const expanded=await page.$eval(header,b=>b.getAttribute("aria-expanded")==="true");
   if(!expanded)await page.$eval(header,b=>b.click());
   const selector=".module:nth-child("+module+") .unit-card:nth-child("+(index+1)+") .secondary-button";
   await page.waitForSelector(selector);
   await page.waitForSelector(".module:nth-child("+module+") .unit-card .ayda-a1-card-flow",{timeout:8000});
   assert.equal(await page.$eval(".module:nth-child("+module+") .unit-card:nth-child("+(index+1)+") .ayda-a1-card-flow",n=>n.querySelectorAll("span").length),3,
     "A1 unit catalog must show Learn / Video / Practice stages.");
   await page.$eval(selector,b=>b.click());
   await page.waitForFunction(id=>{
    const t=document.querySelector(".unit-intro__number")?.textContent||"";
    return Number(t.match(/ÜNİTE\s*(\d+)/i)?.[1])===id;
   },{timeout:10000},unit);
   await page.waitForSelector("#aydaA1StudyNav");
   await page.waitForSelector("#aydaA1TeacherNote");
   assert.equal(await page.$$eval(".video-resources__grid a",els=>els.length),3,
    "Unit "+unit+" lost a video link");
   assert.ok(await page.$(".logic-explainer"),"Unit "+unit+" lost its explanation");
   assert.ok(await page.$(".logic-grid"),"Unit "+unit+" lost its grammar cards");
   assert.ok(await page.$(".workbook-note"),"Unit "+unit+" lost its listening note");
   assert.equal(await page.$$eval("#aydaA1StudyNav",els=>els.length),1,
    "Duplicate in-page navigation in unit "+unit);
   await page.$eval(".lesson-shell > .back-button",b=>b.click());
   await page.waitForSelector(".module-list");
  }
  // Seed the legacy localStorage progress to simulate a student returning on question 8.
  await page.evaluate(()=>{
   localStorage.setItem("ayda-a1-progress-v3",
    JSON.stringify({lastUnit:1,units:{1:{lastIndex:7,attempted:["u1a1"],correct:[],
      wrong:[],completed:false,best:0}}}));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForSelector(".hero-card .primary-button");
  await page.evaluate(()=>{
    document.getElementById("aydaLoginBox").style.display="none";
    document.getElementById("aydaProtectedContent").style.display="block";
  });
  await page.$eval(".hero-card .primary-button",b=>b.click());
  await page.waitForSelector(".unit-intro");
  await page.waitForSelector('#aydaA1StudyNav [data-a1-tab="practice"]',{timeout:10000});
  await page.$eval('[data-a1-tab="practice"]',b=>b.click());
  await page.$eval(".unit-intro > .primary-button",b=>b.click());
  await page.waitForSelector(".exercise-shell #aydaA1SetBar");
  await page.waitForFunction(()=>document.querySelector("#aydaA1SetTitle")?.textContent?.includes("Set 2/4"),
   {timeout:10000});
  assert.ok(await page.$eval(".exercise-topbar > span",n=>n.textContent.includes("8/24")),
    "Existing A1 progress should resume on question 8");
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+3),false,
    "The mobile page must not overflow horizontally");
  await page.screenshot({path:path.join(root,"screenshots","a1-mobile-preview.png"),fullPage:false});
  // The compact navigation must never cover answer checking on a narrow phone.
  await page.setViewport({width:320,height:680,deviceScaleFactor:1});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+3),false,
    "320px-wide screens must not scroll horizontally.");
  assert.ok(await page.$eval(".exercise-shell .exercise-action",
    node=>getComputedStyle(node).position==="static"),
    "The answer-checking action must not be obscured by fixed bottom navigation.");
  await page.setViewport({width:1280,height:800,deviceScaleFactor:1});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+3),false,
    "Desktop A1 view must not overflow horizontally.");
  assert.ok(await page.$eval(".site-header",node=>getComputedStyle(node).position==="sticky"),
    "Unified desktop header should be sticky.");
  assert.deepEqual(errors,[],"Unexpected JavaScript exceptions");
  console.log("PASS: 24 units × 3 original video links, original teaching and 24 supplemental notes.");
  console.log("PASS: learn/video/practice tabs, inline Drive embed, next-step buttons, four six-question phases.");
  console.log("PASS: preserved old progress, mobile and desktop viewports, original answer checking, protected login.");
  console.log("PASS: B1-aligned institute brand, compact home/catalog layout and accessible three-step journey.");
 }finally{await browser.close();server.close()}
}
main().catch(error=>{console.error(error);server.close();process.exitCode=1;});
