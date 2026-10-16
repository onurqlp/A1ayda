/* AYDA A1 • B1-style unified navigation, 24-unit catalog and lesson header.
   Safe, additive UI layer. All original React screens, resources and progress persist.
   Course card labels are copied from the original A1 course data, not invented. */
(()=>{
"use strict";
const UNITS=[{"id":1,"title":"Tanışma ve İlk Cümle","topicTr":"Selamlaş, adını ve nereden geldiğini söyle.","tags":["sein","heißen"]},{"id":2,"title":"Kişisel Bilgi ve Meslek","topicTr":"Meslek, yaş ve yaşadığın yer hakkında konuş.","tags":["meslekler","sayılar"]},{"id":3,"title":"Aile ve Sahiplik","topicTr":"Aileni tanıt, dilleri ve sahipliği anlat.","tags":["Familie","mein/meine"]},{"id":4,"title":"Eşyalar ve Zamirle Tekrar","topicTr":"Eşyaları adlandır, der/die/das yerine er/es/sie kullan.","tags":["eşyalar","der/die/das"]},{"id":5,"title":"Artikel ve Yok Demek","topicTr":"Bir şeyi tanıt, varlığını veya yokluğunu söyle.","tags":["ein/eine","kein/keine"]},{"id":6,"title":"Nesne ve Çoğul","topicTr":"İhtiyaç duyduğun nesneyi Akkusativ ile söyle.","tags":["Akkusativ","der→den"]},{"id":7,"title":"Yapabilmek","topicTr":"Beceri ve imkânları können ile anlat.","tags":["können","Satzklammer"]},{"id":8,"title":"Zamanı Başa Almak","topicTr":"Gün, saat ve randevuları doğru sırayla söyle.","tags":["am","um"]},{"id":9,"title":"Yemek, İçmek, İstemek","topicTr":"Yiyecek tercihlerini ve kibar isteklerini söyle.","tags":["mögen","möchten"]},{"id":10,"title":"Ayrılabilen Fiiller","topicTr":"Günlük rutinini cümle çerçevesiyle anlat.","tags":["trennbare Verben","günlük rutin"]},{"id":11,"title":"Geçmişi Anlatmak 1","topicTr":"Dünkü etkinlikleri haben + Partizip II ile anlat.","tags":["Perfekt mit haben","Partizip II"]},{"id":12,"title":"Geçmişi Anlatmak 2","topicTr":"Hareket ve durum değişimini sein + Partizip II ile anlat.","tags":["Perfekt mit sein","reisen"]},{"id":13,"title":"Yer Tarif Etmek","topicTr":"Şehirde bir yeri sor ve konumunu anlat.","tags":["lokale Präpositionen","Dativ"]},{"id":14,"title":"Ev, Oda ve Sahiplik","topicTr":"Bir evi tanıt, sein/ihr ile kime ait olduğunu söyle.","tags":["Wohnung","sein/ihr"]},{"id":15,"title":"Bana, Sana, Ona","topicTr":"Dativ zamirlerle yardım ve beğeni anlat.","tags":["Dativ zamirler","helfen"]},{"id":16,"title":"Süre ve Zaman Aralığı","topicTr":"Randevu değiştir, süre ve zaman sınırı söyle.","tags":["vor/nach","in"]},{"id":17,"title":"Plan Yapmak","topicTr":"İstek ve planlarını wollen ile anlat.","tags":["wollen","mit + Dativ"]},{"id":18,"title":"Doktor, Tavsiye ve Resmî Emir","topicTr":"Şikâyetini anlat, tavsiye ver ve resmî yönlendirme yap.","tags":["Gesundheit","sollen"]},{"id":19,"title":"Eskiden ve Geçmiş Durum","topicTr":"war/hatte ile geçmişteki durumları ve deneyimleri anlat.","tags":["war/hatte","un-"]},{"id":20,"title":"Beni, Seni, Onu","topicTr":"Akkusativ zamirleri ve samimi emir kipini kullan.","tags":["Akkusativ zamirler","Imperativ du/ihr"]},{"id":21,"title":"Kurallar ve Zorunluluk","topicTr":"d dürfen, müssen ve sollen ile kuralları anlat.","tags":["dürfen","müssen"]},{"id":22,"title":"Karşılaştırma","topicTr":"Kıyafet ve seçenekleri karşılaştır, tercih belirt.","tags":["Komparation","Vergleiche"]},{"id":23,"title":"Hava ve Neden Söylemek","topicTr":"Havayı anlat ve denn ile gerekçe ver.","tags":["Wetter","denn"]},{"id":24,"title":"Kutlama, Tarih ve Dilek","topicTr":"Tarih söyle, kutla ve kibar dileklerini ifade et.","tags":["würde gern","Ordinalzahlen"]}];
const $=(q,base=document)=>base.querySelector(q);
const $$=(q,base=document)=>Array.from(base.querySelectorAll(q));
const make=(tag,className,text)=>{
 const el=document.createElement(tag);
 if(className)el.className=className;
 if(text!==undefined)el.textContent=text;
 return el;
};
const state={filter:"all",route:null,working:false};
let queued=false;
function allowed(){
 const protectedArea=$("#aydaProtectedContent");
 return !!(protectedArea&&getComputedStyle(protectedArea).display!=="none");
}
function progressData(){
 try{return JSON.parse(localStorage.getItem("ayda-a1-progress-v3")||'{"lastUnit":1,"units":{}}')}
 catch{return{lastUnit:1,units:{}}}
}
function perUnit(id){
 const data=progressData().units?.[id]||{};
 const done=Math.min(24,Array.isArray(data.attempted)?data.attempted.length:0);
 return{done,pct:Math.round(done/24*100),complete:Boolean(data.completed)||done===24};
}
function view(){
 if(!allowed())return"locked";
 if($(".exercise-shell"))return"exercise";
 if($(".lesson-shell .unit-intro"))return"intro";
 if($(".lesson-shell .summary-card"))return"summary";
 if($(".home-shell"))return"home";
 if($(".module-list"))return"units";
 if($(".resource-list"))return"resources";
 if($(".exam-grid"))return"exam";
 if($(".support-card"))return"help";
 return"other";
}
async function waitFor(predicate,frames=130){
 for(let i=0;i<frames;i++){
  const item=predicate();
  if(item)return item;
  await new Promise(resolve=>requestAnimationFrame(resolve));
 }
 return null;
}
function navButton(viewName){
 const names={home:"Ana Sayfa",units:"Üniteler",resources:"Kaynaklar",help:"Yardım"};
 return $$(".bottom-nav button").find(b=>b.textContent?.includes(names[viewName]||"-----"));
}
async function openView(destination){
 if(state.working)return false;
 state.working=true;
 try{
  if(destination==="home"){
   $(".site-header .brand")?.click();
   return Boolean(await waitFor(()=>$(".home-shell")));
  }
  if(destination==="exam"){
   if(!$(".home-shell")){
    $(".site-header .brand")?.click();
    if(!await waitFor(()=>$(".home-shell")))return false;
   }
   const exam=$$(".quick-grid button").find(b=>b.textContent?.includes("Sınav Mini Pratik"));
   if(!exam)return false;
   exam.click();
   return Boolean(await waitFor(()=>$(".exam-grid")));
  }
  if(!navButton(destination)){
   $(".site-header .brand")?.click();
   if(!await waitFor(()=>navButton(destination)))return false;
  }
  navButton(destination).click();
  const selectors={units:".module-list",resources:".resource-list",help:".support-card"};
  return Boolean(await waitFor(()=>$(selectors[destination])));
 }finally{state.working=false;schedule()}
}
async function scrollSection(id){
 if(view()!=="home"){
  const ok=await openView("home");
  if(!ok)return;
 }
 const section=await waitFor(()=>document.getElementById(id));
 section?.scrollIntoView({behavior:"smooth",block:"start"});
}
async function openUnit(id){
 if(state.working)return;
 const target=UNITS.find(x=>x.id===id);
 if(!target)return;
 const ok=await openView("units");
 if(!ok)return;
 const group=Math.ceil(id/3),index=(id-1)%3;
 const module=$$(".module-list > .module")[group-1];
 const header=module?.querySelector(".module__header");
 if(!header)return;
 if(header.getAttribute("aria-expanded")!=="true")header.click();
 const button=await waitFor(()=>$$(".module-list > .module")[group-1]?.querySelectorAll(".module__content .unit-card .secondary-button")?.[index]);
 if(button)button.click();
 await waitFor(()=>$(".unit-intro"));
 schedule();
}
function action(label,callback,cls=""){
 const b=make("button",cls,label);
 b.type="button";
 b.addEventListener("click",callback);
 return b;
}
function updateNav(){
 const current=view();
 const active=current==="intro"||current==="exercise"||current==="summary"?"units":current;
 $$(".ayda-b1-main-nav > button").forEach(b=>{
  const selected=(b.dataset.destination==="catalog"&&active==="units")||
    (b.dataset.destination==="resources"&&active==="resources")||
    (b.dataset.destination==="progress"&&active==="home");
  if(b.classList.contains("active")!==selected)b.classList.toggle("active",selected);
  if(b.getAttribute("aria-current")!==(selected?"page":null)){
   if(selected)b.setAttribute("aria-current","page");
   else b.removeAttribute("aria-current");
  }
 });
}
function ensureNav(){
 const header=$(".site-header");
 if(!header)return;
 if(!$(".ayda-b1-main-nav",header)){
  const nav=make("nav","ayda-b1-main-nav");
  nav.setAttribute("aria-label","AYDA ana menü");
  const catalog=action("Video + Alıştırma",()=>scrollSection("uniteler"));catalog.dataset.destination="catalog";
  const resources=action("AYDA Kaynakları",()=>scrollSection("kaynaklar"));resources.dataset.destination="resources";
  const progress=action("İlerleme",()=>scrollSection("ilerleme"));progress.dataset.destination="progress";
  nav.append(catalog,resources,progress);
  const other=make("details","ayda-b1-other");
  const summary=make("summary","","Diğer ▾");
  const panel=make("div","ayda-b1-other-panel");
  [["Sınav Mini Pratik",()=>openView("exam")],["Yardım ve iletişim",()=>openView("help")],
   ["Tüm A1 kaynakları",()=>openView("resources")],["8 modül görünümü",()=>openView("units")]
  ].forEach(([name,fn])=>panel.append(action(name,()=>{other.open=false;fn()})));
  other.append(summary,panel);
  nav.append(other);
  header.querySelector(".brand")?.insertAdjacentElement("afterend",nav);
  const pill=make("span","ayda-b1-level-pill","24 Ünite");
  header.append(pill);
 }
 updateNav();
}
function resourceCard(kind,num,kicker,title,description,label,href){
 const a=make("a","resourceCard "+kind);
 a.href=href;a.target="_blank";a.rel="noopener noreferrer";
 const number=make("span","resourceIcon",num);
 number.setAttribute("aria-hidden","true");
 const body=make("div","");
 body.append(make("small","",kicker),make("h3","",title),make("p","",description),make("strong","",label));
 a.append(number,body);
 return a;
}
function ensureHomeResources(home){
 if($("#kaynaklar",home))return;
 const section=make("section","resourceHub");
 section.id="kaynaklar";
 const head=make("header","");
 const group=make("div","");
 group.append(make("p","sectionLabel","AYDA BAĞLANTILARI"),make("h2","","Ders, kaynak ve sınav alanları"));
 head.append(group,make("p","","AYDA'nın mevcut eğitim platformlarına hızlıca ulaş."));
 const grid=make("div","resourceGrid");
 grid.append(
  resourceCard("live","01","CANLI DERS KAYITLARI","Kaçırdığın dersi tekrar izle",
    "Canlı ders kayıtlarına ve tekrar videolarına geç.","Ders kayıtlarını aç ↗","https://kurs.aydadil.com/"),
  resourceCard("library","02","ONLINE KÜTÜPHANE","Ek kaynaklarla çalış",
    "Okuma, materyal ve tamamlayıcı çalışma kaynaklarını keşfet.","Kütüphaneye git ↗","https://www.aydadil.com/bibliothek/"),
  resourceCard("exam","03","SINAV HAZIRLIK PLATFORMU","A1 sınavına odaklan",
    "Sınav bölümleri ve hedefli hazırlık içeriklerine ulaş.","Sınav platformunu aç ↗","https://www.aydadil.com/sinavhazirlik/")
 );
 section.append(head,grid);
 $(".hero-card",home)?.insertAdjacentElement("afterend",section);
}
function unitCard(unit){
 const p=perUnit(unit.id);
 const card=make("article","unitCard ayda-a1-b1-card");
 card.dataset.unit=String(unit.id);
 const head=make("div","unitCardTop");
 head.append(make("span","unitIndex",String(unit.id).padStart(2,"0")),
             make("span","unitStatus",p.complete?"✓ Tamamlandı":p.done?("%"+p.pct):"Yeni"));
 card.append(head,make("p","",unit.topicTr),make("h3","",unit.title));
 const tags=make("div","tagRow");
 unit.tags.forEach(t=>tags.append(make("span","",t)));
 card.append(tags);
 const flow=make("div","unitCardFlow");
 flow.append(make("span","","▶ 3 video"),make("span","","✦ 24 alıştırma"));
 card.append(flow);
 const progress=make("div","cardProgress");
 const bar=make("span","");
 bar.style.width=p.pct+"%";
 progress.append(bar);card.append(progress);
 const label=p.done?"Videoya ve alıştırmaya dön":"Videoyu izle ve başla";
 const go=action(label+"  →",()=>openUnit(unit.id));
 go.setAttribute("aria-label","Ünite "+unit.id+": "+label);
 card.append(go);
 return card;
}
function renderGrid(home){
 const grid=$("#aydaA1B1Grid",home);
 if(!grid)return;
 const matches=UNITS.filter(u=>state.filter==="all"||(state.filter==="a11"?u.id<=12:u.id>=13));
 const current=[...grid.children].map(el=>Number(el.dataset.unit));
 const ids=matches.map(u=>u.id);
 if(JSON.stringify(current)===JSON.stringify(ids))return;
 grid.replaceChildren(...matches.map(unitCard));
}
function filterTab(key,label){
 const b=action(label,()=>{
  state.filter=key;
  const area=$("#aydaA1B1Grid")?.closest(".ayda-b1-catalog");
  if(!area)return;
  $$(".filterTabs button",area).forEach(btn=>btn.classList.toggle("active",btn.dataset.filter===key));
  renderGrid($(".home-shell"));
 });
 b.dataset.filter=key;
 if(state.filter===key)b.classList.add("active");
 return b;
}
function ensureCatalog(home){
 if($("#aydaA1B1Catalog",home)){renderGrid(home);return}
 const wrapper=make("section","ayda-b1-catalog");
 wrapper.id="aydaA1B1Catalog";
 const intro=make("section","unitIntro");
 intro.id="uniteler";
 const copy=make("div","");
 copy.append(make("p","eyebrow","VİDEO TEKRAR + A1 ALIŞTIRMALARI"),
             make("h2","","Önce konuyu öğren, sonra 24 alıştırmayı çöz"));
 intro.append(copy,make("p","","Her ünitede konu anlatımı, 3 video ve 24 soru. Canlı ders sonrası tekrar veya kendi hızında çalışma."));
 const filters=make("div","filterTabs");
 filters.setAttribute("role","group");filters.setAttribute("aria-label","Ünite filtresi");
 filters.append(filterTab("all","Tümü"),filterTab("a11","A1.1 · 1–12"),filterTab("a12","A1.2 · 13–24"));
 const grid=make("section","unitGrid");
 grid.id="aydaA1B1Grid";grid.setAttribute("aria-label","24 A1 ünitesi");
 wrapper.append(intro,filters,grid);
 $("#kaynaklar",home)?.insertAdjacentElement("afterend",wrapper);
 renderGrid(home);
}
function ensureMethod(home){
 if($(".ayda-b1-method",home))return;
 const method=make("section","methodSection ayda-b1-method");
 method.append(make("p","sectionLabel","NASIL ÇALIŞIR?"),
  make("h2","","Konuyu anlayarak öğren, sonra pratikle pekiştir."));
 const grid=make("div","");
 [
 ["01","Mantığı hatırla","Kuralı Türkçe açıklamalar ve gerçek A1 örnekleriyle öğren."],
 ["02","Video ve alıştırma","Ünite videolarını izle, 24 soruyu dört mini sette çöz."],
 ["03","Kaldığın yerden sürdür","İlerlemen cihazında saklanır; sonraki derste kaldığın yerden başla."]
 ].forEach(([num,title,desc])=>{
  const box=make("article","");
  box.append(make("b","",num),make("h3","",title),make("p","",desc));
  grid.append(box);
 });
 method.append(grid);
 $("#aydaA1B1Catalog",home)?.insertAdjacentElement("afterend",method);
 const tools=make("div","ayda-b1-tools-title");
 tools.append(make("p","sectionLabel","A1 EK ARAÇLAR"),
              make("h2","","Mevcut AYDA öğrenci kaynakları"));
 method.insertAdjacentElement("afterend",tools);
}
function ensureHeroProgress(home){
 const hero=$(".hero-card",home);
 if(!hero)return;
 if(!$("#aydaA1B1StudyCard",hero)){
  const card=make("aside","studyCard ayda-b1-studyCard");
  card.id="aydaA1B1StudyCard";
  card.append(make("span","ayda-b1-cardKicker","ÖĞRENME İLERLEMEN"),
              make("strong","ayda-b1-bigPercent","0%"),
              make("p","ayda-b1-completeInfo","0/24 ünite tamamlandı"));
  const bar=make("div","ayda-b1-studyProgress");
  bar.append(make("span",""));
  card.append(bar,make("p","ayda-b1-resumeText","İstediğin üniteden çalışmaya başlayabilirsin."));
  hero.append(card);
 }
 const data=progressData(),units=data.units||{};
 const complete=UNITS.filter(u=>Boolean(units[u.id]?.completed)||(units[u.id]?.attempted?.length||0)>=24).length;
 const pct=Math.round(complete/24*100);
 const percent=$("#aydaA1B1StudyCard .ayda-b1-bigPercent");
 const count=$("#aydaA1B1StudyCard .ayda-b1-completeInfo");
 const bar=$("#aydaA1B1StudyCard .ayda-b1-studyProgress span");
 const resume=$("#aydaA1B1StudyCard .ayda-b1-resumeText");
 const last=Math.max(1,Math.min(24,Number(data.lastUnit)||1));
 if(percent&&percent.textContent!==pct+"%")percent.textContent=pct+"%";
 if(count&&count.textContent!==complete+"/24 ünite tamamlandı")count.textContent=complete+"/24 ünite tamamlandı";
 if(bar&&bar.style.width!==pct+"%")bar.style.width=pct+"%";
 if(resume&&resume.textContent!=="Kaldığın yer: Ünite "+last)resume.textContent="Kaldığın yer: Ünite "+last;
}
function ensureHome(){
 const home=$(".home-shell");
 if(!home)return;
 const hero=$(".hero-card",home);
 if(hero&&!hero.id)hero.id="ilerleme";
 ensureHeroProgress(home);
 ensureHomeResources(home);
 ensureCatalog(home);
 ensureMethod(home);
}
function ensureDetailTop(){
 const shell=$(".lesson-shell");
 const original=shell?.querySelector(":scope > .back-button");
 if(!shell||!original)return;
 if(!$("#aydaA1DetailTop")){
  const bar=make("div","ayda-b1-detailTop");
  bar.id="aydaA1DetailTop";
  const back=action("← Tüm üniteler",()=>original.click(),"ayda-b1-detailBack");
  const track=make("div","ayda-b1-detailProgress");
  track.append(make("span",""));
  const pct=make("b","", "%0");
  bar.append(back,track,pct);
  original.insertAdjacentElement("beforebegin",bar);
 }
 const id=Number($(".unit-intro__number",shell)?.textContent?.match(/ÜNİTE\s+(\d+)/i)?.[1]);
 if(!id)return;
 const progress=perUnit(id).pct;
 const width=$("#aydaA1DetailTop .ayda-b1-detailProgress span");
 const text=$("#aydaA1DetailTop b");
 if(width&&width.style.width!==progress+"%")width.style.width=progress+"%";
 if(text&&text.textContent!=="%"+progress)text.textContent="%"+progress;
}
function refresh(){
 const current=view();
 document.body.dataset.aydaA1B1View=current;
 if(current==="locked")return;
 ensureNav();
 if(current==="home")ensureHome();
 if(current==="intro")ensureDetailTop();
}
function schedule(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;refresh()});
}
function init(){
 const root=$("#root"),gate=$("#aydaProtectedContent");
 if(root)new MutationObserver(schedule).observe(root,{subtree:true,childList:true});
 if(gate)new MutationObserver(schedule).observe(gate,{attributes:true,attributeFilter:["style","class"]});
 schedule();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
})();