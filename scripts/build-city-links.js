// Keep homepage and all city-page navigation synchronized with every city page.
const fs=require('node:fs');
const pages=fs.readdirSync('.').filter(f=>/^photo-booth-rental-.*-tx\.html$/.test(f)).sort();
const names=Object.fromEntries(pages.map(f=>[f,f.replace(/^photo-booth-rental-|\-tx\.html$/g,'').split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')]));
const links=pages.map(f=>'<a href="/'+f+'">'+names[f]+', TX</a>');
const homepage='index.html';
let html=fs.readFileSync(homepage,'utf8');
const intro='<strong>Explore Our Local Photo Booth Rentals:</strong><br>';
const start=html.indexOf(intro);
if(start<0)throw new Error('Homepage city links not found');
const end=html.indexOf('</p>',start);
if(end<0)throw new Error('Homepage city links closing tag not found');
html=html.slice(0,start)+intro+links.join(' &nbsp;•&nbsp; ')+html.slice(end);
fs.writeFileSync(homepage,html);
for(const file of pages){let s=fs.readFileSync(file,'utf8');const nav=s.match(/<nav class="nearby-city-links"[^>]*>[\s\S]*?<\/nav>/);if(nav){const replacement=nav[0].replace(/>[^>]*<\/nav>$/, '>'+pages.filter(p=>p!==file).map(p=>'<a href="/'+p+'">'+names[p]+', TX</a>').join(' <span aria-hidden="true">•</span> ')+'</nav>');s=s.replace(nav[0],replacement)}else{const section='<section class="section nearby-cities" aria-label="Other cities we serve"><div class="wrap"><h2>More DFW Photo Booth Rental Locations</h2><p>'+pages.filter(p=>p!==file).map(p=>'<a href="/'+p+'">'+names[p]+', TX</a>').join(' &nbsp;•&nbsp; ')+'</p></div></section>';if(!s.includes('<!-- ALL_CITY_LINKS -->'))s=s.replace('</main>','<!-- ALL_CITY_LINKS -->'+section+'</main>')}fs.writeFileSync(file,s)}
console.log('Updated navigation links for '+pages.length+' cities');
