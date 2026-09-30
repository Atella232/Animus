import { defineConfig,loadEnv,type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
function offline(base:string):Plugin{return {name:'animus-offline',generateBundle(_options,bundle){
 const assets=[base,...['index.html','icon.svg','icon-192.png','icon-512.png','manifest.webmanifest',...Object.keys(bundle)].map(s=>base+s)];
 const prefix='animus-'+base;const version=Object.keys(bundle).join('|');
 const source=`const PREFIX=${JSON.stringify(prefix)};const CACHE=PREFIX+${JSON.stringify(version)};const ASSETS=${JSON.stringify(assets)};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(${JSON.stringify(base)}))return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match(${JSON.stringify(base+'index.html')})));return}e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)))});`;
 this.emitFile({type:'asset',fileName:'sw.js',source});
 const manifest={name:'Animus · Minijuegos animales',short_name:'Animus',lang:'es',start_url:base,scope:base,display:'standalone',background_color:'#f7f8f2',theme_color:'#225e45',icons:[{src:base+'icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'},...[192,512].map(size=>({src:base+`icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any maskable'}))]};
 this.emitFile({type:'asset',fileName:'manifest.webmanifest',source:JSON.stringify(manifest)});
}}}
export default defineConfig(({mode})=>{const configured=loadEnv(mode,'.','').ANIMUS_BASE??'/';const base='/'+configured.replace(/^\/+|\/+$/g,'')+(configured.replace(/^\/+|\/+$/g,'')?'/':'');return {base,plugins:[react(),offline(base)],server:{port:5173},build:{chunkSizeWarningLimit:1600}}});
