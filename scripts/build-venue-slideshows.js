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
}, {
  page: 'blue-heron-landing-wylie-photo-booth.html',
  folder: 'images/venues/blue-heron-landing',
  legacy: [],
  alt: 'Photo Booths of Dallas at Blue Heron Landing in Wylie, Texas',
  caption: 'Blue Heron Landing event photo'
}, {
  page: 'event-1013-plano-photo-booth.html',
  folder: 'images/venues/event-1013',
  legacy: [],
  alt: 'Photo Booths of Dallas at Event 1013 in Plano, Texas',
  caption: 'Event 1013 photo'
}, {
  page: 'white-sparrow-quinlan-photo-booth.html',
  folder: 'images/venues/white-sparrow',
  legacy: [],
  alt: 'Photo Booths of Dallas at The White Sparrow wedding venue',
  caption: 'The White Sparrow venue photo'
}];
const valid = /\.(jpe?g|png|webp|gif)$/i;
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const venue of venues) {
  const additions = fs.existsSync(venue.folder) ? fs.readdirSync(venue.folder).filter(f => valid.test(f) && fs.statSync(path.join(venue.folder, f)).isFile()).sort((a,b) => a.localeCompare(b,undefined,{numeric:true})).map(f => path.posix.join(venue.folder,f)) : [];
  const images = [...venue.legacy.filter(f => fs.existsSync(f)), ...additions];
  // A new venue can have no photos yet; the gallery stays hidden until photos arrive.
  const slides = images.map((file,i) => '<div class="wedding-slide'+(i===0?' is-active':'')+'"><img src="/'+escapeHtml(file.split(path.sep).join('/'))+'" alt="'+escapeHtml(venue.alt+' — photo '+(i+1))+'" loading="'+(i===0?'eager':'lazy')+'"><p>Cinnamon Barn wedding photo '+(i+1)+'</p></div>').join('');
  const page = fs.readFileSync(venue.page,'utf8');
  const start = '<!-- VENUE_SLIDES_START -->';
  const end = '<!-- VENUE_SLIDES_END -->';
  if (!page.includes(start) || !page.includes(end)) throw new Error('Missing slideshow markers in '+venue.page);
  const updated = page.replace(new RegExp(start+'[\\s\\S]*?'+end), start+slides+end).replace(/<div class="wedding-count" aria-live="polite">[^<]*<\/div>/,'<div class="wedding-count" aria-live="polite">1 / '+images.length+'</div>');
  fs.writeFileSync(venue.page, updated.replace(/<div class="wedding-slideshow"([^>]*)>/, (match, attrs) => '<div class="wedding-slideshow"'+attrs.replace(/ hidden/g, '')+(images.length ? '' : ' hidden')+'>'));
  console.log('Built '+images.length+' photos for '+venue.page);
}
