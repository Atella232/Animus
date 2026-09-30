import { rng, type Status } from '../model';
import type { GameDef } from '../catalog';
export type End={value:number|null;status:Exclude<Status,'active'>;details:Record<string,number>};
export type Point={x:number;y:number};
export const W=420,H=560;
export const C={ink:'#203d32',muted:'#7b8a80',green:'#2b7450',mint:'#c8e6c1',red:'#dc725d',yellow:'#efc855',blue:'#81b5d6',paper:'#f5f6e9',purple:'#b7a5ce'};
export const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export const dist=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export function text(c:CanvasRenderingContext2D,s:string,x:number,y:number,size=18,color=C.ink,align:CanvasTextAlign='center'){c.fillStyle=color;c.font=`${size>=24?'700':'600'} ${size}px system-ui, sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y)}
export function rect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string,r=12){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
export function circle(c:CanvasRenderingContext2D,x:number,y:number,r:number,color:string){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
export function line(c:CanvasRenderingContext2D,a:Point,b:Point,color=C.green,width=4){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}
export function button(c:CanvasRenderingContext2D,s:string,x:number,y:number,w=100,color=C.green){rect(c,x,y,w,48,color);text(c,s,x+w/2,y+24,17,'#fff')}
export function animal(c:CanvasRenderingContext2D,x:number,y:number,color=C.green,size=20){
 const raw=(c as CanvasRenderingContext2D & {animalKind?:string}).animalKind;const kind=typeof raw==='string'?raw:'';
 const bird=['hawk','sparrow','rooster','chicken','crow','parrot','woodpecker','swallow','swift','stork','hummingbird','pigeon','roadrunner','toucan','penguin','owl'].includes(kind);
 const bug=['bee','ant','flea','firefly','butterfly','dragonfly','mantis','beetle','spider'].includes(kind);
 const long=['rabbit','kangaroo','donkey'].includes(kind);
 if(bug){circle(c,x-size*.8,y-size*.25,size*.65,'#dce9e4');circle(c,x+size*.8,y-size*.25,size*.65,'#dce9e4');line(c,{x:x-size*.3,y:y-size*.7},{x:x-size*.65,y:y-size*1.4},color,2);line(c,{x:x+size*.3,y:y-size*.7},{x:x+size*.65,y:y-size*1.4},color,2)}
 else if(!bird){if(long){c.fillStyle=color;c.beginPath();c.ellipse(x-size*.5,y-size*.9,size*.25,size*.75,-.15,0,Math.PI*2);c.ellipse(x+size*.5,y-size*.9,size*.25,size*.75,.15,0,Math.PI*2);c.fill()}else if(['fox','cat','wolf'].includes(kind)){c.fillStyle=color;c.beginPath();c.moveTo(x-size,y-size*.2);c.lineTo(x-size*.85,y-size*1.5);c.lineTo(x,y-size*.6);c.moveTo(x+size,y-size*.2);c.lineTo(x+size*.85,y-size*1.5);c.lineTo(x,y-size*.6);c.fill()}else{circle(c,x-size*.65,y-size*.7,size*.45,color);circle(c,x+size*.65,y-size*.7,size*.45,color)}}
 circle(c,x,y,size,kind==='penguin'?C.ink:color);
 if(bird){circle(c,x,y+size*.3,size*.6,'#fff6dd');c.fillStyle=C.yellow;c.beginPath();c.moveTo(x-size*.25,y+size*.1);c.lineTo(x+size*.25,y+size*.1);c.lineTo(x,y+size*.5);c.fill();if(kind==='rooster'||kind==='chicken'){circle(c,x-size*.25,y-size,size*.23,C.red);circle(c,x+size*.25,y-size,size*.23,C.red)}}
 circle(c,x-size*.3,y-3,size*.15,'#fff');circle(c,x+size*.3,y-3,size*.15,'#fff');circle(c,x-size*.3,y-3,size*.08,C.ink);circle(c,x+size*.3,y-3,size*.08,C.ink);if(!bird)circle(c,x,y+size*.25,size*.15,C.ink)
}
export abstract class Engine {
 t=0;elapsed=0;score=0;errors=0;hits=0;level=1;done:End|null=null;message=''; keys=new Set<string>();held=false;pointer:Point={x:210,y:280}; random:()=>number;
 constructor(public g:GameDef,seed:number){this.random=rng(seed)}
 rand(a:number,b:number){return a+(b-a)*this.random()}
 int(a:number,b:number){return Math.floor(this.rand(a,b+1))}
 shuffled<T>(arr:T[]){const out=[...arr];for(let i=out.length-1;i>0;i--){const j=this.int(0,i);[out[i],out[j]]=[out[j],out[i]]}return out}
 finish(status:End['status']='completed',value=this.score){if(!this.done)this.done={status,value:status==='abandoned'||this.g.lower&&status!=='completed'?null:Math.max(0,value),details:{hits:this.hits,errors:this.errors,level:this.level}}}
 fail(){this.errors++;this.finish('failed')}
 tick(dt:number){if(this.done)return;this.t+=dt;this.elapsed+=dt;this.step(dt);if(this.g.limit&&this.elapsed>=this.g.limit&&!this.done)this.finish(this.g.lower?'failed':'completed')}
 abstract step(dt:number):void;
 abstract draw(c:CanvasRenderingContext2D):void;
 input(kind:'down'|'move'|'up',p:Point){this.pointer=p;if(kind==='down'){this.held=true;this.action('tap',p)}if(kind==='up'){this.held=false;this.action('release',p)}if(kind==='move')this.action('move',p)}
 key(key:string,down:boolean){if(down){if(this.keys.has(key))return;this.keys.add(key);if(key==='action')this.held=true;this.action(key,this.pointer)}else{this.keys.delete(key);if(key==='action'){this.held=false;this.action('release',this.pointer)}}}
 action(_key:string,_p:Point){}
 axis(axis:'x'|'y'){return axis==='x'?(Number(this.keys.has('right'))-Number(this.keys.has('left'))):(Number(this.keys.has('down'))-Number(this.keys.has('up')))}
 background(c:CanvasRenderingContext2D){(c as CanvasRenderingContext2D & {animalKind?:string}).animalKind=this.g.animal;c.clearRect(0,0,W,H);rect(c,0,0,W,H,C.paper,0);for(let i=0;i<8;i++)circle(c,25+i*57,40+((i*79)%470),2,'#dce4d7')}
 header(c:CanvasRenderingContext2D,title:string,sub=''){text(c,title,210,35,20);if(sub)text(c,sub,210,65,14,C.muted)}
 hud(){return {score:this.score,time:this.g.limit?Math.max(0,this.g.limit-this.elapsed):this.elapsed,message:this.message}}
}
export type Factory=(g:GameDef,seed:number)=>Engine;
