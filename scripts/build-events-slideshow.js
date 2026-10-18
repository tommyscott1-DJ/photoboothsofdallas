// Generate the homepage Events slideshow from all supported images in images/events.
const fs = require('node:fs');
const path = require('node:path');
const folder = 'images/events';
const valid = /\.(jpe?g|png|webp|gif)$/i;
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const files = fs.readdirSync(folder).filter(f => valid.test(f) && fs.statSync(path.join(folder,f)).isFile()).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const slides = files.map((f,i)=>'  <img class="slide'+(i===0?' active':'')+'" src="/'+folder+'/'+encodeURIComponent(f)+'" alt="'+escapeHtml('Photo Booths of Dallas event photo '+(i+1))+'" loading="'+(i===0?'eager':'lazy')+'">').join('\n');
const start = '<!-- EVENT_SLIDES_START -->';
const end = '<!-- EVENT_SLIDES_END -->';
let html = fs.readFileSync('index.html','utf8');
if (!html.includes(start)||!html.includes(end)) throw new Error('Events slideshow markers missing');
html=html.replace(new RegExp(start+'[\\s\\S]*?'+end),start+'\n'+slides+'\n  '+end);
fs.writeFileSync('index.html',html);
console.log('Built Events slideshow with '+files.length+' images');
