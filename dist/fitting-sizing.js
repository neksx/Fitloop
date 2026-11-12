'use strict';
(() => {
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 window.FitloopSizeGuide={markup(product,look){
  const sizes=product.sizes?.length?`<div class="fitting-size-options"><h4>AVAILABLE SIZES</h4><div class="fitting-available-sizes">${product.sizes.map(size=>`<span>${escape(size)}</span>`).join('')}</div></div>`:'';
  const brand=product.brand||'PURPLE',guide=product.sizeGuideUrl||'https://purple-brand.com/pages/size-guide';
  return `<section class="fitting-sizing" aria-labelledby="fitting-sizing-heading"><h3 id="fitting-sizing-heading">FIT &amp; SIZING</h3><p class="fitting-sizing-kicker">CURRENT MODEL</p><dl class="fitting-fit-profile">${[['GENDER',look.gender==='man'?'MAN':'WOMAN'],['HEIGHT',`${look.height} CM`],['WEIGHT',`${look.weight} KG`],['CUT',product.cut||'REGULAR']].map(([label,value])=>`<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>${sizes}<a class="fitting-back fitting-brand-size-link" href="${escape(guide)}" target="_blank" rel="noopener noreferrer">${escape(brand)} SIZE GUIDE</a></section>`;
 }};
})();
