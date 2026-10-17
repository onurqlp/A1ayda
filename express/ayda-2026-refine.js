/* AYDA Express: yalnızca başlık ve kurumsal geri dönüş bağlantısı. */
(()=>{"use strict";
document.title="A1 Komple Alıştırmalar | AYDA Dil Akademisi";
function add(){
 const top=document.querySelector(".top");
 if(!top||document.getElementById("ayda-express-back"))return;
 const link=document.createElement("a");
 link.id="ayda-express-back";
 link.href="../";
 link.textContent="← A1 Ana Sayfa";
 link.setAttribute("aria-label","AYDA A1 ana sayfasına dön");
 link.style.cssText="display:inline-flex;align-items:center;justify-content:center;color:#f5e5c2;border:1px solid #61738b;border-radius:9px;padding:9px 10px;font-size:12px;font-weight:700;text-decoration:none;min-height:40px;white-space:nowrap;";
 const actions=top.querySelector(".head-actions");
 (actions||top).appendChild(link);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add,{once:true});else add();
})();