import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
function offlineState(state:string){document.documentElement.dataset.offline=state;window.dispatchEvent(new Event('animus-offline'))}
if(import.meta.env.PROD){
 if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{try{await navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{scope:import.meta.env.BASE_URL});await navigator.serviceWorker.ready;offlineState('ready')}catch{offlineState('unavailable')}});
 }else offlineState('unavailable');
}else offlineState('development');
