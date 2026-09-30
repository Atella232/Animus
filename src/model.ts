import { games, type GameDef } from './catalog';
export type Mode='training'|'daily';
export type Status='completed'|'failed'|'abandoned'|'active';
export type Result={id:string;gameId:string;rulesVersion:number;mode:Mode;date:string;day:string;seed:number;duration:number;value:number|null;unit:string;status:Status;details:Record<string,number>};
export type Settings={sound:boolean;reducedMotion:boolean;favorites:string[]};
export const defaults:Settings={sound:true,reducedMotion:false,favorites:[]};
export function madridDay(date=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
export function dayNumber(day:string){return Math.floor(Date.parse(day+'T00:00:00Z')/86400000)}
export function dailyGame(day=madridDay()){return games[((dayNumber(day)-dayNumber('2026-09-30'))%games.length+games.length)%games.length]}
export function hash(s:string){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
export function rng(seed:number){let state=seed;return ()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
export function validResults(g:GameDef,results:Result[]){return results.filter(r=>r.gameId===g.id&&r.rulesVersion===1&&r.value!==null&&(r.status==='completed'||(r.status==='failed'&&!g.lower)))}
export function summary(g:GameDef,results:Result[]){const all=results.filter(r=>r.gameId===g.id);const valid=validResults(g,all);const values=valid.map(r=>r.value!);return {played:all.length,completed:all.filter(r=>r.status==='completed').length,failed:all.filter(r=>r.status==='failed').length,abandoned:all.filter(r=>r.status==='abandoned').length,best:values.length?(g.lower?Math.min(...values):Math.max(...values)):null,average:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,duration:all.reduce((a,r)=>a+r.duration,0),valid}}
export function validateBackup(raw:unknown):{version:1;results:Result[];settings:Settings}{
 const b=raw as {version?:unknown;results?:unknown;settings?:unknown};if(!b||b.version!==1||!Array.isArray(b.results)||b.results.length>100000)throw Error('Formato de copia no compatible.');
 const ids=new Set<string>();const results=b.results.map((raw:unknown)=>{const r=raw as Result;const g=games.find(g=>g.id===r?.gameId);if(!r||typeof r.id!=='string'||!r.id||ids.has(r.id)||!g||r.rulesVersion!==1||!['training','daily'].includes(r.mode)||!['completed','failed','abandoned','active'].includes(r.status)||!/^\d{4}-\d{2}-\d{2}$/.test(r.day)||!Number.isFinite(Date.parse(r.date))||!Number.isInteger(r.seed)||r.seed<0||r.seed>4294967295||!Number.isFinite(r.duration)||r.duration<0||r.duration>1e9||r.unit!==g.unit||!(r.value===null||(typeof r.value==='number'&&Number.isFinite(r.value)&&r.value>=0))||!r.details||typeof r.details!=='object'||Object.values(r.details).some(v=>typeof v!=='number'||!Number.isFinite(v)))throw Error('La copia contiene partidas inválidas.');ids.add(r.id);return {...r,value:r.status==='active'||r.status==='abandoned'?null:r.value,status:r.status==='active'?'abandoned' as const:r.status}});
 const s=b.settings as Settings;if(!s||typeof s.sound!=='boolean'||typeof s.reducedMotion!=='boolean'||!Array.isArray(s.favorites)||s.favorites.some(id=>!games.some(g=>g.id===id)))throw Error('Los ajustes de la copia no son válidos.');return {version:1,results,settings:{sound:s.sound,reducedMotion:s.reducedMotion,favorites:[...new Set(s.favorites)]}};
}
