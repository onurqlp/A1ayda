/* AYDA A1 • Unified Learning Theme
   Brand + compact academic journey. Enhances the existing A1 preview only.
   Never edits the React curriculum, answer-checking or ayda-a1-progress-v3 data. */
(()=>{
  "use strict";
  const $=(query,root=document)=>root.querySelector(query);
  const $$=(query,root=document)=>Array.from(root.querySelectorAll(query));
  let queued=false;
  const steps=[
    ["1", "Öğren"],
    ["2", "Video izle"],
    ["3", "Alıştırma"]
  ];
  const icon=(name)=>({book:"▤",video:"▶",practice:"✎"}[name]||"•");
  function visibleContent(){
    const root=$("#aydaProtectedContent");
    return !!(root&&getComputedStyle(root).display!=="none");
  }
  function attachRealBrand(){
    const data=window.AYDA_LOGO_DATA;
    if(!data||!data.startsWith("data:image/png;base64,"))return;
    const login=$("#aydaLoginBox .ayda-login-logo");
    if(login&&login.style.backgroundImage!=="url(\""+data+"\")"){
      login.style.backgroundImage="url("+data+")";
      login.setAttribute("aria-label","AYDA Dil Akademisi");
    }
    const brand=$(".site-header .brand");
    if(brand&&!brand.classList.contains("ayda-logo-applied")){
      brand.style.backgroundImage="url("+data+")";
      brand.classList.add("ayda-logo-applied");
    }
    document.body.classList.add("ayda-a1-logo-ready");
  }
  function make(tag,className,text){
    const element=document.createElement(tag);
    if(className)element.className=className;
    if(text!==undefined)element.textContent=text;
    return element;
  }
  function enrichHome(){
    const hero=$(".hero-card");
    if(!hero||$("#aydaA1Journey"))return;
    const lead=$(".hero-card__lead",hero);
    if(!lead)return;
    const journey=make("div","ayda-a1-journey");
    journey.id="aydaA1Journey";
    journey.setAttribute("aria-label","AYDA çalışma yöntemi");
    journey.append(
      make("span","ayda-a1-journey-label","BİR ÜNİTE, ÜÇ KOLAY ADIM"),
      ...steps.map(([num,title],index)=>{
        const node=make("span","ayda-a1-journey-step",num+". "+title);
        node.setAttribute("aria-label",title);
        return node;
      })
    );
    lead.insertAdjacentElement("afterend",journey);
  }
  function enrichModuleCards(){
    $$(".unit-card").forEach(card=>{
      if($(".ayda-a1-card-flow",card))return;
      const tags=$(".tag-row",card);
      if(!tags)return;
      const flow=make("div","ayda-a1-card-flow");
      flow.setAttribute("aria-label","Ünite çalışmasının bölümleri");
      ["Öğren","Video","Alıştırma"].forEach((name,i)=>{
        const node=make("span","",name);
        node.setAttribute("data-phase",String(i+1));
        flow.append(node);
      });
      tags.insertAdjacentElement("afterend",flow);
    });
  }
  function enrichStudyStep(){
    const nav=$("#aydaA1StudyNav");
    if(!nav)return;
    if(!$(".ayda-a1-study-meta",nav)){
      const meta=make("div","ayda-a1-study-meta");
      meta.append(
        make("span","","Canlı ders sonrası tekrar + kendi hızında öğrenme"),
        make("strong","","24 soru · 4 mini set")
      );
      const head=$(".ayda-a1-nav__heading",nav);
      head?.insertAdjacentElement("afterend",meta);
    }
  }
  function enrichExercise(){
    const setbar=$("#aydaA1SetBar");
    const shell=$(".exercise-shell");
    if(!shell||!setbar)return;
    const top=$(".exercise-topbar > span",shell);
    const found=top?.textContent.match(/Ünite\s+(\d+)\s*·\s*(\d+)\/(\d+)/i);
    if(!found)return;
    const step=Number(found[2]),total=Number(found[3]);
    if(!total||total!==24)return;
    const reachedBoundary=step%6===0;
    const feedback=$(".exercise-card .feedback",shell);
    let breakNotice=$("#aydaA1SetBreak");
    if(!feedback||!reachedBoundary){
      if(breakNotice)breakNotice.remove();
      return;
    }
    if(!breakNotice){
      breakNotice=make("aside","ayda-a1-set-break");
      breakNotice.id="aydaA1SetBreak";
      breakNotice.setAttribute("role","status");
      const title=make("strong","","✓ Bu mini seti tamamladın");
      const detail=make("p","",step===24?
        "Bu ünitenin 24 sorusunu gördün. Sonuç ekranına geçebilir, yanlışlarını tekrar edebilirsin.":
        "6 soruluk bu bölüm bitti. Devam etmek istersen sonraki mini sete geçebilirsin.");
      breakNotice.append(title,detail);
      feedback.insertAdjacentElement("afterend",breakNotice);
    }
    const phase=Math.ceil(step/6);
    const title=$("strong",breakNotice);
    if(title)title.textContent="✓ "+phase+". mini set tamamlandı";
  }
  function refresh(){
    attachRealBrand();
    if(!visibleContent())return;
    enrichHome();
    enrichModuleCards();
    enrichStudyStep();
    enrichExercise();
  }
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;refresh()});
  }
  function start(){
    const root=$("#root");
    attachRealBrand();
    if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
    schedule();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();