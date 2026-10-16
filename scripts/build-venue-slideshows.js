// Builds venue slideshows from images stored in each venue folder.
const fs = require('node:fs');
const path = require('node:path');
const venues = [{
  page: 'cinnamon-barn-princeton-photo-booth.html',
  folder: 'images/venues/cinnamon-barn',
  legacy: [
    'images/venues/cinnamon-barn-wedding-photo-booth-guests.jpg',
    'images/venues/cinnamon-barn-princeton-open-air-photo-booth.jpg'
  ],
  alt: 'Photo Booths of Dallas at Cinnamon Barn in Princeton, Texas'
}];
const valid = /\.(jpe?g|png|webp|gif)$/i;
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const venue of venues) {
  const additions = fs.existsSync(venue.folder) ? fs.readdirSync(venue.folder).filter(f => valid.test(f) && fs.statSync(path.join(venue.folder, f)).isFile()).sort((a,b) => a.localeCompare(b,undefined,{numeric:true})).map(f => path.posix.join(venue.folder,f)) : [];
  const images = [...venue.legacy.filter(f => fs.existsSync(f)), ...additions];
  if (!images.length) throw new Error('No photos found for '+venue.page);
  const slides = images.map((file,i) => '<div class="wedding-slide'+(i===0?' is-active':'')+'"><img src="/'+escapeHtml(file.split(path.sep).join('/'))+'" alt="'+escapeHtml(venue.alt+' — photo '+(i+1))+'" loading="'+(i===0?'eager':'lazy')+'"><p>Cinnamon Barn wedding photo '+(i+1)+'</p></div>').join('');
  const page = fs.readFileSync(venue.page,'utf8');
  const start = '<!-- VENUE_SLIDES_START -->';
  const end = '<!-- VENUE_SLIDES_END -->';
  if (!page.includes(start) || !page.includes(end)) throw new Error('Missing slideshow markers in '+venue.page);
  const updated = page.replace(new RegExp(start+'[\\s\\S]*?'+end), start+slides+end).replace(/<div class="wedding-count" aria-live="polite">[^<]*<\/div>/,'<div class="wedding-count" aria-live="polite">1 / '+images.length+'</div>');
  fs.writeFileSync(venue.page,updated);
  console.log('Built '+images.length+' photos for '+venue.page);
}
