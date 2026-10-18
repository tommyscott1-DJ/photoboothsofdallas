// Keep city-page headlines centered across both page layouts.
const fs=require('node:fs');
const files=fs.readdirSync('.').filter(f=>/^photo-booth-rental-.*-tx\.html$/.test(f));
const css='<!-- CITY_CENTER_HEADINGS_START --><style>main h1,main h2,main h3,.hero h1,.hero h2,.hero h3{text-align:center}.hero:not(:has(.city-hero-intro))>p{text-align:center}.hero:not(:has(.city-hero-intro))>p .button{margin-left:auto;margin-right:auto}</style><!-- CITY_CENTER_HEADINGS_END -->';
for(const file of files){let html=fs.readFileSync(file,'utf8');
const start='<!-- CITY_CENTER_HEADINGS_START -->',end='<!-- CITY_CENTER_HEADINGS_END -->';
if(html.includes(start))html=html.replace(new RegExp(start+'[\\s\\S]*?'+end),css);
else if(html.includes('</head>'))html=html.replace('</head>',css+'\\n</head>');
else throw new Error('Missing head close in '+file);
fs.writeFileSync(file,html);
}
console.log('Centered headlines on '+files.length+' city pages');
