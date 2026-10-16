import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";

function read(path){return fs.readFileSync(path);}
function sha(buffer){return createHash("sha1").update("blob "+buffer.byteLength+"\0").update(buffer).digest("hex");}
function identical(original,preview,expected,label){
 const a=read(original),b=read(preview);
 assert.equal(sha(a),expected,label+" original checksum changed");
 assert.equal(sha(b),expected,label+" preview checksum changed");
 assert.deepEqual(b,a,label+" differs between original and preview");
}
const backup=read("backups/a1-index-before-unified-20261016.html");
assert.equal(sha(backup),"46ac0428d84a74b972777b3bd499589ba2e9460a",
 "Original A1 homepage backup must be preserved byte-for-byte.");
const root=read("index.html").toString("utf8");
const previewHtml=read("preview/index.html").toString("utf8");
const expectedLive=previewHtml.replace('    <meta name="robots" content="noindex,nofollow" />\n',"");
const approvedBeforeParity=expectedLive
  .replace('    <link rel="stylesheet" href="./ayda-a1-b1-parity.css">\n',"")
  .replace('    <script defer src="./ayda-a1-b1-parity.js"></script>\n',"");
assert.ok(root===expectedLive||root===approvedBeforeParity,
 "Production A1 is neither the approved current interface nor the last approved safe release.");
assert.ok(!root.includes("noindex,nofollow"),"Production A1 must not have preview noindex.");
for(const name of ["ayda-brand.js","ayda-a1-hybrid.js","ayda-a1-hybrid.css","ayda-a1-unified.js","ayda-a1-unified.css"]){
 assert.deepEqual(read(name),read("preview/"+name),"Live UI asset differs from approved preview: "+name);
}
identical("assets/index-DRCE9iGL.js","preview/assets/index-DRCE9iGL.js",
 "63f90f55f7de004da8fe78e30ea4fa0230064d0f","A1 course React bundle (24 units, 576 questions, videos and progress)");
identical("assets/index-OVjCbFV6.css","preview/assets/index-OVjCbFV6.css",
 "12809de74d7059008caa13a5c770ddad6859cb78","A1 original stylesheet");
identical("og.png","preview/og.png",
 "bc5c41f82a7d2cb8d43178a1778375e86c890c18","A1 original social artwork");
const html=read("preview/index.html").toString("utf8");
for(const source of ["./assets/index-DRCE9iGL.js","./assets/index-OVjCbFV6.css",
 "./ayda-a1-hybrid.css","./ayda-a1-hybrid.js",
 "./ayda-a1-unified.css","./ayda-a1-unified.js","./ayda-brand.js","./og.png",
 "https://onurqlp.github.io/ayda-pass/access-control.js"]){
 assert.ok(html.includes(source),"Preview is missing "+source);
}
assert.ok(html.includes("noindex,nofollow"),"Preview should not be indexed");
const brand=read("preview/ayda-brand.js");
assert.equal(sha(brand),"2909497e6cd9d7265cbaac56dabba3eff80e7218",
 "Owner-approved AYDA logo must match unchanged B1 asset");
const unifiedCss=read("preview/ayda-a1-unified.css").toString("utf8");
for(const color of ["#0b1b31","#102541","#e8c37b","#fbf9f5"]){
 assert.ok(unifiedCss.toLowerCase().includes(color),"Missing shared AYDA design token "+color);
}
const unifiedJs=read("preview/ayda-a1-unified.js").toString("utf8");
assert.ok(unifiedJs.includes("ayda-a1-card-flow")&&unifiedJs.includes("ayda-a1-journey"),
 "Shared learning journey UI missing");
assert.ok(unifiedJs.includes("aydaA1SetBreak"),
 "Six-question mini-set completion guidance missing");
const bundle=read("preview/assets/index-DRCE9iGL.js").toString("utf8");
for(let i=1;i<=24;i++)assert.match(bundle,new RegExp("number:"+i+"(?:,|})"),"Unit "+i+" missing");
assert.ok(bundle.includes("ayda-a1-progress-v3"),"Original progress key was removed");
assert.ok(bundle.includes("Kısa konu tekrarı")&&bundle.includes("Konuşma kalıpları"),"Video mapping missing");
const parityHtml=previewHtml.includes("ayda-a1-b1-parity.js");
if(parityHtml){
 assert.ok(previewHtml.includes("ayda-a1-b1-parity.css"),"Preview parity stylesheet is missing");
 const overlay=read("preview/ayda-a1-b1-parity.js").toString("utf8");
 const style=read("preview/ayda-a1-b1-parity.css").toString("utf8");
 const match=overlay.match(/const UNITS=(\[[^\n]+\]);/);
 assert.ok(match,"Extracted course catalog not found in B1-style A1 overlay");
 const catalog=JSON.parse(match[1]);
 assert.equal(catalog.length,24,"Missing A1 catalog units");
 for(let i=1;i<=24;i++){
  assert.equal(catalog[i-1].id,i,"A1 card ordering error");
  assert.ok(bundle.includes("number:"+i+",title:`"+catalog[i-1].title+"`"),
   "New A1 catalog does not reflect existing curriculum: "+i);
 }
 assert.ok(style.includes(".ayda-b1-main-nav")&&style.includes(".unitGrid"),
  "B1-compatible navigation or card grid stylesheet missing");
 if(root===expectedLive){
  for(const name of ["ayda-a1-b1-parity.css","ayda-a1-b1-parity.js"])
   assert.deepEqual(read(name),read("preview/"+name),"Published B1 parity resource differs from preview: "+name);
 }
}
const enhanced=read("preview/ayda-a1-hybrid.js").toString("utf8");
assert.ok(enhanced.includes("24 kısa soru"),"Four six-question practice flow missing");
assert.ok(enhanced.includes("file/d/")&&enhanced.includes("/preview"),"In-page video support missing");
console.log("PASS: All original A1 materials unchanged: 24 units, 576 exercises, three video links per unit.");
console.log("PASS: Live A1 matches tested preview; old root backed up; video sources, password and progress retained.");
