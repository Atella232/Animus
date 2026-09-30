import { openDB } from 'idb';
import { defaults,madridDay,dailyGame,hash,validateBackup,type Result,type Mode,type Settings } from './model';
import { type GameDef } from './catalog';
const database=openDB('animus',1,{upgrade(db){const store=db.createObjectStore('results',{keyPath:'id'});store.createIndex('day','day');db.createObjectStore('settings')}});
export async function readResults():Promise<Result[]>{return (await (await database).getAll('results')).sort((a:Result,b:Result)=>b.date.localeCompare(a.date))}
export async function readSettings():Promise<Settings>{return {...defaults,...await (await database).get('settings','preferences')}}
export async function saveSettings(settings:Settings){await (await database).put('settings',settings,'preferences')}
export async function recover(){const db=await database;const tx=db.transaction('results','readwrite');for(const r of await tx.store.getAll())if(r.status==='active')await tx.store.put({...r,status:'abandoned',value:null});await tx.done}
export async function startRun(g:GameDef,mode:Mode):Promise<Result>{
 const day=madridDay();if(mode==='daily'&&dailyGame(day).id!==g.id)throw Error('El reto diario ha cambiado. Vuelve al inicio.');
 const db=await database;const tx=db.transaction('results','readwrite');if(mode==='daily'){const runs=await tx.store.index('day').getAll(day);if(runs.filter((r:Result)=>r.mode==='daily').length>=2){tx.abort();await tx.done.catch(()=>{});throw Error('Ya has usado tus dos intentos de hoy. Puedes seguir entrenando.')}}
 const seed=mode==='daily'?hash(day+g.id):crypto.getRandomValues(new Uint32Array(1))[0];const r:Result={id:crypto.randomUUID(),gameId:g.id,rulesVersion:1,mode,date:new Date().toISOString(),day,seed,duration:0,value:null,unit:g.unit,status:'active',details:{}};
 await tx.store.add(r);await tx.done;return r;
}
export async function finishRun(r:Result){const db=await database;const tx=db.transaction('results','readwrite');const previous=await tx.store.get(r.id);if(previous?.status==='active')await tx.store.put(r);await tx.done}
export async function exportBackup(){return {version:1,results:await readResults(),settings:await readSettings()}}
export async function importBackup(raw:unknown){const b=validateBackup(raw);const db=await database;const tx=db.transaction(['results','settings'],'readwrite');for(const r of b.results){if(!await tx.objectStore('results').get(r.id))await tx.objectStore('results').add(r)}const previous=await tx.objectStore('settings').get('preferences')??defaults;await tx.objectStore('settings').put({...b.settings,favorites:[...new Set([...previous.favorites,...b.settings.favorites])]},'preferences');await tx.done;return b.results.length}
