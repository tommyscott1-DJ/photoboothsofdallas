// Automatically populate the homepage Audio Guest Book slideshow from its image folder.
const fs = require('node:fs');
const path = require('node:path');
const pagePath = 'index.html';
const folder = 'images/audio-guest-book';
const valid = /\.(jpe?g|png|webp|gif)$/i;
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const images = fs.readdirSync(folder).filter(f => valid.test(f) && fs.statSync(path.join(folder,f)).isFile()).sort((a,b) => a.localeCompare(b,undefined,{numeric:true}));
const slides = images.map((file,i) => {
  const src = '/' + folder + '/' + file.split('/').map(encodeURIComponent).join('/');
  return '        <img class="audio-guest-slide' + (i===0?' active':'') + '" src="' + escapeHtml(src) + '" alt="Photo Booths of Dallas Audio Guest Book event photo ' + (i+1) + '" loading="' + (i===0?'eager':'lazy') + '">';
}).join('\n');
const start = '<!-- AUDIO_GUEST_SLIDES_START -->';
const end = '<!-- AUDIO_GUEST_SLIDES_END -->';
let html = fs.readFileSync(pagePath,'utf8');
if (!html.includes(start) || !html.includes(end)) throw new Error('Audio Guest Book slideshow markers missing');
html = html.replace(new RegExp(start+'[\\s\\S]*?'+end),start+'\n'+slides+'\n        '+end);
fs.writeFileSync(pagePath,html);
console.log('Built Audio Guest Book slideshow with '+images.length+' photos');
