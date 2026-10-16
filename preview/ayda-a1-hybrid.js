/* AYDA A1 • Öğrenci dostu hibrit çalışma arayüzü
 * Orijinal React paketini, 24 üniteyi, 576 alıştırmayı, videoları,
 * cevap kontrolünü ve ayda-a1-progress-v3 ilerleme kayıtlarını değiştirmez.
 */
(()=>{
"use strict";
const PREFIX="ayda-a1-hybrid-v1:";
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const state={view:null,unit:null,tab:"learn",videoIndex:0,pendingTab:null};
let queued=false;
const STAGES=["Temeli kavra","Kullan ve anlat","Pekiştir","Kendini kontrol et"];
const notes=[
["İlk adım kendini tanıtmak. Ich heiße ... bir isim söyler; Ich bin ... ise kim ya da ne olduğunu anlatır. Wie heißt du? sorusunda soru kelimesinden hemen sonra fiil gelir.","Wie heißt du? – Ich heiße Ayşe.","Adın ne? – Benim adım Ayşe."],
["Düzenli fiillerin sonu özneye göre değişir: ich lerne, du lernst, er lernt. Olumsuz bilgi verirken nicht kullanılır; sayı ve meslek cevaplarını birer cümleyle söyle.","Ich arbeite heute nicht.","Bugün çalışmıyorum."],
["Bir şeyin kime ait olduğunu söylerken mein/dein kullanırız. İsim dişilse meine/deine biçimini hatırla. Ja ve nein dışında olumsuz soruya karşılık doch gerekebilir.","Das ist meine Schwester.","Bu benim kız kardeşim."],
["der, die, das isimlerin artikelidir. Aynı ismi tekrar tekrar söylemek yerine uygun zamiri seçebilirsin: der → er, die → sie, das → es.","Das ist ein Tisch. Er ist groß.","Bu bir masa. O büyük."],
["İlk kez tanıttığın eşyada ein/eine; 'yok, değil' derken kein/keine kullanırsın. Artikelin cinsiyetine bak: die Tasche → eine Tasche → keine Tasche.","Das ist keine Tasche.","Bu bir çanta değil."],
["Akkusativ, nesnenin bulunduğu durumu gösterir. Başlangıç için en önemli değişim eril artikelde olur: der → den, ein → einen. Diğerlerini gereksiz yere değiştirme.","Ich brauche einen Stift.","Bir kaleme ihtiyacım var."],
["Können bir şeyi yapabilmeyi anlatır. Çekimli können cümlenin ikinci yerindedir, asıl fiil ise mastar olarak en sona gider.","Ich kann gut Deutsch sprechen.","İyi Almanca konuşabiliyorum."],
["Saat verirken um, gün söylerken am kullanılır. Cümlenin başına zaman koyarsan fiil yine ikinci sırayı korur.","Am Montag lerne ich Deutsch.","Pazartesi günü Almanca çalışıyorum."],
["Mögen genel beğeni, möchten ise kibarca isteme anlatır. Yemek ve içecek siparişlerinde möchten daha doğaldır.","Ich möchte einen Tee, bitte.","Bir çay istiyorum, lütfen."],
["Ayrılabilen fiiller iki parçalıdır: çekimli kısmı ikinci yerde, öneki en sonda kullanırsın. Örnek: aufstehen → ich stehe ... auf.","Ich stehe um sieben Uhr auf.","Saat yedide kalkıyorum."],
["Geçmişi Perfekt ile anlatırken çoğu fiil haben yardımcı fiilini kullanır. haben çekimlenir; Partizip II cümlenin sonuna gider.","Ich habe gestern gelernt.","Dün ders çalıştım."],
["Yer değiştirme bildiren bazı fiiller Perfekt'te sein kullanır: gehen, fahren, kommen gibi. sein çekimlenir, asıl Partizip II sona gider.","Wir sind nach Berlin gefahren.","Berlin'e gittik."],
["Yer bildirirken sorunun ne istediğini ayır: Wo? nerede; Wohin? nereye. Bu ünitedeki yer edatlarının artikel değişimlerini örnekle çalış.","Ich bin in der Stadt.","Şehirdeyim."],
["Sahiplik sözcüğü, sahibi olan kişiye göre seçilir: er → sein, sie → ihr. Daha sonra gelen ismin artikeli ekin biçimini etkileyebilir.","Das ist ihr Zimmer.","Bu onun odası."],
["Bazı fiiller Dativ ister. gefallen ile 'bana hoş geliyor' derken mir, 'sana hoş geliyor' derken dir kullanırsın.","Das gefällt mir.","Bu hoşuma gidiyor."],
["Zaman ifadelerini tek kalıp olarak öğren: vor zwei Tagen, nach dem Kurs, in einer Woche. Önce 'ne zaman?' sorusunu cevapla.","Nach dem Kurs gehe ich nach Hause.","Kurstan sonra eve gidiyorum."],
["Wollen bir planı ya da niyeti anlatır. Çekimli wollen ikinci konumda, yapılacak eylemin mastarı cümle sonunda yer alır.","Wir wollen morgen lernen.","Yarın ders çalışmak istiyoruz."],
["Tavsiye için sollen; kibar resmî talimat için 'Gehen Sie bitte ...' gibi Sie ile emir kullanılır. Emir cümlesinde fiil çoğunlukla baştadır.","Nehmen Sie bitte Platz.","Lütfen oturun."],
["Geçmişteki durumları war ve hatte ile anlatabilirsin: ich war, du warst; ich hatte, du hattest. Her şeyi Perfekt ile söylemek zorunda değilsin.","Ich war gestern müde.","Dün yorgundum."],
["Akkusativ zamirleri bir nesneyi yeniden söylemeden kullanmaya yarar: mich, dich, ihn, sie, es, uns, euch. Kimi? Neyi? sorusuna bak.","Kannst du mich hören?","Beni duyabiliyor musun?"],
["Müssen zorunluluk, dürfen izin, sollen ise öneri veya başkasının beklentisini anlatabilir. Üçünü birbiriyle karıştırma.","Hier darf man nicht rauchen.","Burada sigara içmek yasaktır."],
["İki şeyi karşılaştırırken Komparativ; 'en' dediğinde Superlativ kullanırsın. gut → besser → am besten, gern → lieber → am liebsten biçimlerini kalıp olarak öğren.","Heute geht es mir besser.","Bugün daha iyiyim."],
["Hava durumunu 'Es ist ...' ile anlatabilirsin. Denn iki ana cümleyi bağlar; denn sonrasında normal fiil sırası devam eder.","Ich bleibe zu Hause, denn es regnet.","Evde kalıyorum, çünkü yağmur yağıyor."],
["Tarih söylerken sıra sayıları kullanılır. 'İsterdim' gibi nazik dileklerde würde gern ifadesi işe yarar; istemek ile gerçekleşmiş olmayı ayır.","Ich würde gern mitkommen.","Ben de gelmek isterdim."]
];
const safeGet=(k)=>{try{return sessionStorage.getItem(PREFIX+k)}catch{return null}};
const safeSet=(k,v)=>{try{sessionStorage.setItem(PREFIX+k,String(v))}catch{}};
function el(tag,attrs={},text){
 const node=document.createElement(tag);
 for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);
 if(text!==undefined)node.textContent=text;
 return node;
}
function allowed(){
 const box=$("#aydaProtectedContent");
 return !!(box&&getComputedStyle(box).display!=="none");
}
function getView(){
 if(!allowed())return{view:null,unit:null};
 const intro=$(".lesson-shell .unit-intro");
 if(intro){
  const label=$(".unit-intro__number",intro)?.textContent||"";
  const id=Number(label.match(/ÜNİTE\s*(\d+)/i)?.[1])||null;
  return{view:"intro",unit:id};
 }
 const card=$(".exercise-shell");
 if(card){
  const title=$(".exercise-topbar > span",card)?.textContent||"";
  const parsed=title.match(/Ünite\s*(\d+)\s*·\s*(\d+)\s*\/\s*(\d+)/i);
  return{view:"exercise",unit:parsed?Number(parsed[1]):null,position:parsed?Number(parsed[2]):null,total:parsed?Number(parsed[3]):null};
 }
 if($(".summary-card"))return{view:"summary",unit:state.unit};
 return{view:"other",unit:null};
}
function originalStart(){return $(".lesson-shell .unit-intro > button.primary-button")}
function goExercise(){
 const start=originalStart();
 if(!start)return;
 stopVideo();
 start.click();
}
function returnToIntro(tab){
 state.pendingTab=tab;
 const back=$(".exercise-shell .exercise-topbar .back-button");
 if(back)back.click();
}
function embedSource(href){
 const match=href.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
 if(match)return"https://drive.google.com/file/d/"+match[1]+"/preview";
 const youtube=href.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/);
 return youtube?"https://www.youtube-nocookie.com/embed/"+youtube[1]+"?rel=0":null;
}
function stopVideo(){
 const iframe=$("#aydaA1VideoFrame");
 if(iframe)iframe.removeAttribute("src");
}
function videoEntries(){return $$(".lesson-shell .video-resources__grid a")}
function ensureVideo(){
 const section=$(".lesson-shell .video-resources");
 if(!section)return;
 if(!$("#aydaA1VideoPlayer")){
  const box=el("div",{id:"aydaA1VideoPlayer",class:"ayda-a1-player"});
  const info=el("div",{class:"ayda-a1-player__top"});
  info.append(el("strong",{id:"aydaA1VideoTitle"},"Konu anlatımı"),el("span",{},"Site içinde izle"));
  const frameWrap=el("div",{class:"ayda-a1-player__frame"});
  const iframe=el("iframe",{
   id:"aydaA1VideoFrame",loading:"lazy",allowfullscreen:"",
   allow:"autoplay; encrypted-media; picture-in-picture",
   referrerpolicy:"strict-origin-when-cross-origin",title:"AYDA A1 konu anlatım videosu"
  });
  frameWrap.append(iframe);
  const bottom=el("div",{class:"ayda-a1-player__bottom"});
  const note=el("p",{},"Videolar Google Drive üzerinden oynatılır; görüntüleme izni dosya sahibine bağlıdır.");
  const link=el("a",{id:"aydaA1External",target:"_blank",rel:"noopener noreferrer",href:"#"},"Videoyu ayrı aç ↗");
  bottom.append(note,link);
  box.append(info,frameWrap,bottom);
  $(".video-resources__heading",section)?.insertAdjacentElement("afterend",box);
 }
 videoEntries().forEach((a,index)=>{
  if(a.dataset.aydaPlayerReady==="1")return;
  a.dataset.aydaPlayerReady="1";
  a.addEventListener("click",event=>{
   if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   event.preventDefault();
   openTab("video");
   showVideo(index);
  });
 });
}
function showVideo(index){
 const entries=videoEntries();
 if(!entries.length)return;
 const safe=Math.max(0,Math.min(entries.length-1,index));
 state.videoIndex=safe;
 const link=entries[safe],href=link.getAttribute("href")||"";
 const title=$("strong",link)?.textContent?.trim()||"A1 ders videosu";
 const label=$("small",link)?.textContent?.trim()||"Video";
 const iframe=$("#aydaA1VideoFrame");
 const frameSrc=embedSource(href);
 if(iframe){
  const next=frameSrc||"";
  if(iframe.getAttribute("src")!==next){
   if(next)iframe.src=next;
   else iframe.removeAttribute("src");
  }
  iframe.title=label+" · "+title;
  const wrap=iframe.parentElement;
  wrap.hidden=!frameSrc;
 }
 const external=$("#aydaA1External");
 if(external)external.href=href;
 const headline=$("#aydaA1VideoTitle");
 if(headline)headline.textContent=label+" · "+title;
 entries.forEach((item,i)=>{
  const active=i===safe;
  item.classList.toggle("ayda-a1-video-active",active);
  item.setAttribute("aria-current",active?"true":"false");
 });
}
function ensureNotes(id){
 const grid=$(".lesson-shell .logic-grid");
 if(!grid||!notes[id-1]||$("#aydaA1TeacherNote"))return;
 const [explain,de,tr]=notes[id-1];
 const box=el("aside",{id:"aydaA1TeacherNote",class:"ayda-a1-teacher-note"});
 box.append(el("strong",{},"AYDA Öğrenme Notu · Bir adım daha açıkla"),
            el("p",{},explain));
 const example=el("div",{class:"ayda-a1-teacher-example"});
 example.append(el("b",{lang:"de"},de),el("span",{lang:"tr"},tr));
 box.append(example);
 grid.insertAdjacentElement("afterend",box);
}
function action(text,handler,primary=false){
 const button=el("button",{type:"button",class:primary?"ayda-a1-action ayda-a1-action--primary":"ayda-a1-action"},text);
 button.addEventListener("click",handler);
 return button;
}
function ensureIntro(id){
 const intro=$(".lesson-shell .unit-intro");
 if(!intro)return;
 if(!$("#aydaA1StudyNav")){
  const wrapper=el("section",{id:"aydaA1StudyNav",class:"ayda-a1-nav","aria-label":"Ünite çalışma yolu"});
  const heading=el("div",{class:"ayda-a1-nav__heading"});
  heading.append(el("strong",{},"Ünite çalışma yolu"),el("span",{},"Sıfırdan öğren veya dersten sonra tekrar et."));
  const tabs=el("nav",{class:"ayda-a1-nav__tabs","aria-label":"Ünite bölümleri"});
  [["learn","① Öğren"],["video","▶ Video izle"],["practice","✎ Alıştırma"]].forEach(([key,label])=>{
   const button=action(label,()=>openTab(key));
   button.classList.add("ayda-a1-nav-tab");
   button.dataset.a1Tab=key;
   button.setAttribute("aria-pressed","false");
   tabs.append(button);
  });
  const next=el("div",{class:"ayda-a1-nav__next"});
  const where=el("span",{id:"aydaA1Current"},"Konuyu öğren");
  const button=action("İlerle →",nextStep,true);button.id="aydaA1Next";
  next.append(where,button);
  wrapper.append(heading,tabs,next);
  $(".unit-intro__lead",intro)?.insertAdjacentElement("afterend",wrapper);
 }
 if(!$("#aydaA1IntroHelp")){
  const box=el("p",{id:"aydaA1IntroHelp",class:"ayda-a1-practice-info"},"Bu ünitede 24 kısa soru var. 4 küçük set × 6 soru şeklinde ilerlersin. İhtiyacın olursa konu anlatımına veya videoya dönebilirsin.");
  originalStart()?.insertAdjacentElement("beforebegin",box);
 }
 if(!$("#aydaA1EndLearn")){
  const guide=$(".lesson-shell .workbook-note");
  if(guide){
   const nav=el("nav",{id:"aydaA1EndLearn",class:"ayda-a1-inline-footer","aria-label":"Konu anlatımından sonra"});
   nav.append(action("▶ Videoyu izle",()=>openTab("video"),true),
              action("Alıştırmalara geç →",()=>openTab("practice")));
   guide.insertAdjacentElement("afterend",nav);
  }
 }
 if(!$("#aydaA1EndVideo")){
  const section=$(".lesson-shell .video-resources");
  if(section){
   const nav=el("nav",{id:"aydaA1EndVideo",class:"ayda-a1-inline-footer","aria-label":"Video ardından ilerle"});
   nav.append(action("Alıştırmalara geç →",()=>openTab("practice"),true),
              action("Konuya dön",()=>openTab("learn")));
   section.insertAdjacentElement("afterend",nav);
  }
 }
 ensureNotes(id);
 ensureVideo();
}
function openTab(tab){
 if(!["learn","video","practice"].includes(tab))return;
 if(state.tab==="video"&&tab!=="video")stopVideo();
 state.tab=tab;
 if(state.unit)safeSet("tab-"+state.unit,tab);
 document.body.dataset.aydaA1Tab=tab;
 if(tab==="video")showVideo(state.videoIndex);
 updateIntro();
 renderDock("intro");
 const focus=tab==="video"?$(".lesson-shell .video-resources"):tab==="practice"?$("#aydaA1IntroHelp"):$(".lesson-shell .logic-explainer");
 requestAnimationFrame(()=>focus?.scrollIntoView({behavior:"smooth",block:"start"}));
}
function nextStep(){
 if(state.tab==="learn")openTab("video");
 else if(state.tab==="video")openTab("practice");
 else goExercise();
}
function updateIntro(){
 const nav=$("#aydaA1StudyNav");
 if(!nav)return;
 $$("[data-a1-tab]",nav).forEach(button=>{
  const active=button.dataset.a1Tab===state.tab;
  if(button.getAttribute("aria-pressed")!==String(active))button.setAttribute("aria-pressed",String(active));
  if(button.classList.contains("active")!==active)button.classList.toggle("active",active);
 });
 const status=$("#aydaA1Current");
 const next=$("#aydaA1Next");
 const labels={
  learn:["Şu an: Konu anlatımı","Videoya ilerle →"],
  video:["Şu an: Ünite videoları","Alıştırmalara ilerle →"],
  practice:["Şu an: Alıştırma hazırlığı","Soruları başlat →"]
 };
 const [short,label]=labels[state.tab];
 if(status&&status.textContent!==short)status.textContent=short;
 if(next&&next.textContent!==label)next.textContent=label;
}
function ensureExercise(unit,position,total){
 const shell=$(".exercise-shell");
 if(!shell||!position)return;
 if(!$("#aydaA1SetBar")){
  const top=el("section",{id:"aydaA1SetBar",class:"ayda-a1-setbar","aria-label":"Alıştırma çalışma seti"});
  const row=el("div",{class:"ayda-a1-setbar__top"});
  const status=el("div",{class:"ayda-a1-setbar__summary"});
  status.append(el("strong",{id:"aydaA1SetTitle"},"Çalışma seti"),el("span",{id:"aydaA1SetStatus"},"6 soru"));
  const actions=el("nav",{class:"ayda-a1-setbar__actions","aria-label":"Konu ve video kısayolları"});
  actions.append(action("Konu",()=>returnToIntro("learn")),
                 action("▶ Video",()=>returnToIntro("video")));
  row.append(status,actions);
  const progress=el("div",{class:"ayda-a1-setbar__progress","aria-hidden":"true"});
  for(let i=0;i<4;i++)progress.append(el("span",{"data-a1-set":String(i+1)}));
  const note=el("p",{id:"aydaA1SetMessage",class:"ayda-a1-setbar__message"});
  top.append(row,progress,note);
  $(".exercise-topbar",shell)?.insertAdjacentElement("afterend",top);
 }
 const isMain=total===24;
 const group=Math.floor((position-1)/6)+1;
 const title=$("#aydaA1SetTitle"),status=$("#aydaA1SetStatus"),message=$("#aydaA1SetMessage");
 if(title)title.textContent=isMain?"Set "+group+"/4 · "+STAGES[Math.min(3,group-1)]:"Kısa sınav pratiği";
 if(status)status.textContent=isMain?"Bu sette soru "+((position-1)%6+1)+"/6":"Soru "+position+"/"+total;
 if(message){
  let t="Kısa bir soruya odaklan; işin bitince sonraki adıma geç.";
  if(isMain&&position===1)t="İlk 6 soruyu bitirdiğinde küçük bir aşamayı tamamlayacaksın.";
  else if(isMain&&(position-1)%6===0)t="✓ Önceki set tamamlandı. Yeni 6 soruluk bölümdesin.";
  else if(isMain&&position%6===0)t="Bu setin son sorusu. Sonrasında kısa bir mola verebilirsin.";
  if(message.textContent!==t)message.textContent=t;
 }
 $$("[data-a1-set]",$("#aydaA1SetBar")).forEach((part,i)=>{
  const current=isMain&&i===group-1,finished=isMain&&i<group-1;
  if(part.classList.contains("active")!==current)part.classList.toggle("active",current);
  if(part.classList.contains("done")!==finished)part.classList.toggle("done",finished);
 });
}
function ensureDock(){
 if($("#aydaA1QuickDock"))return;
 const dock=el("nav",{id:"aydaA1QuickDock",hidden:"","aria-label":"Ders içinde hızlı gezinme"});
 [["learn","Konu"],["video","▶ Video"],["practice","Alıştırma"]].forEach(([tab,title])=>{
  const button=el("button",{type:"button","data-a1-dock-tab":tab,"aria-pressed":"false"},title);
  button.addEventListener("click",()=>{
   if(!state.unit)return;
   if(state.view==="exercise"){
    if(tab==="practice"){
     $(".exercise-shell .exercise-card")?.scrollIntoView({behavior:"smooth",block:"start"});
    }else returnToIntro(tab);
   }else if(state.view==="intro"){
    openTab(tab);
   }
  });
  dock.append(button);
 });
 document.body.append(dock);
}
function renderDock(view){
 const dock=$("#aydaA1QuickDock");
 if(!dock)return;
 const enabled=allowed()&&["intro","exercise"].includes(view);
 dock.hidden=!enabled;
 if(!enabled)return;
 const selected=view==="exercise"?"practice":state.tab;
 $("[data-a1-dock-tab]",dock).forEach(button=>{
  const active=button.dataset.a1DockTab===selected;
  if(button.classList.contains("active")!==active)button.classList.toggle("active",active);
  if(button.getAttribute("aria-pressed")!==String(active))button.setAttribute("aria-pressed",String(active));
 });
}
function refresh(){
 const found=getView();
 renderDock(found.view);
 if(found.view===null){
  state.view=null;
  delete document.body.dataset.aydaA1View;
  delete document.body.dataset.aydaA1Tab;
  return;
 }
 const changed=state.view!==found.view||state.unit!==found.unit;
 if(found.view==="intro"&&found.unit){
  if(changed){
   state.unit=found.unit;
   state.tab=state.pendingTab||safeGet("tab-"+found.unit)||"learn";
   if(!["learn","video","practice"].includes(state.tab))state.tab="learn";
   state.pendingTab=null;
   state.videoIndex=0;
  }
  state.view="intro";
  document.body.dataset.aydaA1View="intro";
  document.body.dataset.aydaA1Tab=state.tab;
  ensureIntro(found.unit);
  updateIntro();
  renderDock("intro");
  if(state.tab==="video"&&!$("#aydaA1VideoFrame")?.getAttribute("src"))showVideo(state.videoIndex);
 }else if(found.view==="exercise"&&found.unit&&found.position){
  state.view="exercise";
  state.unit=found.unit;
  document.body.dataset.aydaA1View="exercise";
  delete document.body.dataset.aydaA1Tab;
  ensureExercise(found.unit,found.position,found.total||24);
  renderDock("exercise");
 }else{
  state.view=found.view;
  document.body.dataset.aydaA1View=found.view;
  delete document.body.dataset.aydaA1Tab;
 }
}
function requestRefresh(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;refresh()});
}
function init(){
 ensureDock();
 const root=$("#root");
 if(root)new MutationObserver(requestRefresh).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});
 requestRefresh();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
})();
