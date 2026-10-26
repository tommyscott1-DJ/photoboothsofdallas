// Populate the homepage hero slideshow from photos uploaded to images/hero-photo-booth-pictures.
const fs = require('node:fs');
const path = require('node:path');
const folder = 'images/hero-photo-booth-pictures';
const valid = /\.(jpe?g|png|webp|gif)$/i;
const files = fs.readdirSync(folder).filter(f => valid.test(f) && fs.statSync(path.join(folder, f)).isFile()).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const escapeHtml = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const slides = files.map((f,i)=>'      <img class="hero-photo-slide'+(i===0?' active':'')+'" src="/'+folder+'/'+encodeURIComponent(f)+'" alt="'+escapeHtml('Photo Booths of Dallas photo booth picture '+(i+1))+'" loading="'+(i===0?'eager':'lazy')+'">').join('\n');
const start = '<!-- HERO_PHOTO_SLIDES_START -->';
const end = '<!-- HERO_PHOTO_SLIDES_END -->';
let html = fs.readFileSync('index.html','utf8');
if (!html.includes(start) || !html.includes(end)) throw new Error('Hero slideshow markers missing');
html = html.replace(new RegExp(start+'[\\s\\S]*?'+end), start+'\n'+slides+'\n      '+end);
fs.writeFileSync('index.html',html);
console.log('Built hero photo booth slideshow with '+files.length+' pictures');
