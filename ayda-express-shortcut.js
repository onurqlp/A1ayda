/* AYDA A1 — Kurumsal Komple Alıştırmalar kartı. Öğrenci akışına müdahale etmez. */
(()=>{"use strict";
const ID="ayda-express-course-link";
const css=document.createElement("style");
css.textContent=`
#${ID}{display:flex;align-items:center;justify-content:space-between;gap:18px;width:100%;margin:20px 0 24px;padding:22px 25px;background:#fff;border:1px solid #dbe3ea;border-left:5px solid #e8c37b;border-radius:15px;box-shadow:0 8px 25px #0b1b3109;color:#142b44;text-decoration:none;transition:border-color .15s,box-shadow .15s}
#${ID}:hover{border-color:#a9bac9;box-shadow:0 11px 28px #0b1b3112}
#${ID}:focus-visible{outline:3px solid #214d75;outline-offset:3px}
#${ID} .ayda-express-title{display:block;font-weight:850;font-size:clamp(17px,2vw,20px);line-height:1.3;letter-spacing:-.015em;color:#102541}
#${ID} .ayda-express-description{display:block;margin-top:6px;font-size:13px;line-height:1.6;color:#536779}
#${ID} .ayda-express-action{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 15px;border-radius:9px;background:#102541;color:#fff;font-size:13px;font-weight:700}
@media(max-width:650px){#${ID}{padding:17px 16px;align-items:flex-start;flex-direction:column;gap:12px;margin:16px 0}#${ID} .ayda-express-action{width:100%}}
@media(prefers-reduced-motion:reduce){#${ID}{transition:none}}
`;
document.head.appendChild(css);
function mount(){
 const home=document.querySelector(".home-shell");
 if(!home||!home.isConnected||home.querySelector("#"+ID))return;
 const card=document.createElement("a");card.id=ID;card.href="./express/";
 card.setAttribute("aria-label","A1 Komple Alıştırmalar akıllı çalışma kitabını aç");
 card.innerHTML='<span><span class="ayda-express-title">A1 Komple Alıştırmalar</span><span class="ayda-express-description">24 ünite · 311 interaktif soru · Türkçe açıklamalar · Cevap kontrolü ve tekrar</span></span><span class="ayda-express-action">Çalışmaya başla →</span>';
 const hero=home.querySelector(".hero-card");
 if(hero)hero.insertAdjacentElement("afterend",card);
 else home.insertAdjacentElement("afterbegin",card);
}
let queued=false;
const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mount()})});
observer.observe(document.getElementById("aydaProtectedContent")||document.body,{childList:true,subtree:true});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();