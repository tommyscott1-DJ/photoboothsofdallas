// Add a concise, consistent explanation of real photo strips to city pages.
// Preserve existing page URLs, canonical tags, layouts and booking links.
const fs=require('node:fs');
const files=fs.readdirSync('.').filter(f=>/^photo-booth-rental-.*-tx\.html$/.test(f));
for(const file of files){
 let html=fs.readFileSync(file,'utf8');
 const city=file.replace(/^photo-booth-rental-|\-tx\.html$/g,'').split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
 const marker='<!-- CITY_PRINT_VALUE_START -->';
 if(html.includes(marker))continue;
 const section=marker+'<section class="city-print-value" aria-label="Real printed photo strips"><h2>Real Photo Booth Prints for '+city+' Events</h2><p>Our Classic Enclosed Photo Booth brings back the traditional behind-the-curtain experience, complete with real photo strips printed during your event. Prefer group pictures? Our Open-Air Photo Booth also prints keepsakes on the spot. Both options include a friendly attendant, props, personalized photo-strip designs and digital sharing.</p><p><a href="/enclosed-photo-booth-dallas.html">See our Classic Enclosed Photo Booth</a> or <a href="/#availability">check your event date</a>.</p></section><!-- CITY_PRINT_VALUE_END -->';
 if(html.includes('</main>'))html=html.replace('</main>',section+'</main>');
 else throw Error('Missing main closing tag: '+file);
 fs.writeFileSync(file,html);
}
console.log('Updated printed-photo-strip messaging across '+files.length+' city pages');
