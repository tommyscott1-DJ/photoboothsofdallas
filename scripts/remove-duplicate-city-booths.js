// Remove the repeated pair of photo booth cards on older city pages.
// The primary booth cards near the hero are retained; newer pages have one pair already.
const fs=require('node:fs');
const files=fs.readdirSync('.').filter(f=>/^photo-booth-rental-.*-tx\.html$/.test(f));
let removed=0;
for(const file of files){
 let html=fs.readFileSync(file,'utf8');
 const pattern=/<section class="section light"><div class="wrap"><h2 style="text-align:center">Two Photo Booth Styles for [^<]*<\/h2>[\s\S]*?<\/div><\/div><\/section>/;
 if(pattern.test(html)){
  if(!html.includes('class="city-booth-grid"'))throw new Error('Cannot find primary booth cards in '+file);
  html=html.replace(pattern,'');fs.writeFileSync(file,html);removed++;
 }
}
console.log('Removed repeated booth section from '+removed+' city pages; preserved main booth cards');
