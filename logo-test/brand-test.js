/* Faithful isolated reproduction of onurqlp/A1ayda ayda-a1-unified.js attachRealBrand */
(()=>{
"use strict";
function attachRealBrand(){
  const data=window.AYDA_LOGO_DATA;
  if(!data||!(data.startsWith("data:image/png;base64,")||data.startsWith("https://www.aydadil.com/wp-content/uploads/")))return;
  const brand=document.querySelector(".site-header .brand");
  if(brand&&!brand.classList.contains("ayda-logo-applied")){
    brand.style.backgroundImage="url("+data+")";
    brand.classList.add("ayda-logo-applied");
  }
  document.body.classList.add("ayda-a1-logo-ready");
}
attachRealBrand();
})();