// Ensure compact city pages show both photo booth images.
const fs=require('node:fs');
const files=fs.readdirSync('.').filter(f=>/^photo-booth-rental-.*-tx\.html$/.test(f));
let updated=0;
for(const file of files){let html=fs.readFileSync(file,'utf8');
const target='<article><h3>Open-Air Photo Booth</h3>';
if(html.includes(target)){
 html=html.replace(target,'<article><img src="/images/open-air/open-air-photo-booth.png" alt="Open-Air Photo Booth rental for '+file.replace(/^photo-booth-rental-|\-tx\.html$/g,'').replace(/-/g,' ')+' Texas events" loading="lazy"><h3>Open-Air Photo Booth</h3>');
 fs.writeFileSync(file,html);updated++;
}}
console.log('Added missing Open-Air booth photos to '+updated+' city pages');
