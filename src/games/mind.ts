import {Engine,C,W,H,clamp,dist,text,rect,circle,button,line,type Point} from './core';
export class Timing extends Engine {
 round=0;values:number[]=[];start=0;target=this.rand(3,8);last=-1;pulses=0;nextPulse=0;
 step(_dt:number){const e=this.t-this.start;if(this.g.engine==='rhythm'){this.message=e<2.4?'Observa el pulso':'Mantén el ritmo';this.nextPulse=Math.floor(e/.6);if(e>=10&&this.values.length<8)this.finish('completed',0)}else if(['reaction','flash'].includes(this.g.engine)){if(this.last<0&&e>=this.target){this.last=this.t;this.message='¡Ahora!'}}}
 action(k:string,p:Point){if(!['tap','action'].includes(k)||this.done)return;const e=this.t-this.start;switch(this.g.engine){
 case 'hawk': {const x=210+Math.sin(e*(2.1+this.round*.25))*160;this.values.push(clamp(100-Math.abs(x-210)/1.6,0,100));this.round++;this.start=this.t;break}
 case 'clock':case 'countdown':this.values.push(Math.abs(e-this.target));this.round++;this.target=this.rand(3,8);this.start=this.t;break;
 case 'rhythm':if(e<2.4)return;{const expected=2.4+this.values.length*.6;this.values.push(clamp(100-Math.abs(e-expected)/.003,0,100));this.round++;}break;
 case 'reaction':if(this.last<0){this.errors++;this.message='Salida falsa. Espera…';this.start=this.t;this.target=this.rand(1,3);return}if(dist(p,this.reactionCell())>48&&k==='tap'){this.errors++;return}this.values.push(this.t-this.last);this.round++;this.start=this.t;this.target=this.rand(1,3);this.last=-1;this.targetCell=this.int(0,8);break;
 case 'flash':if(this.last<0){this.score=Math.max(0,this.score-1);this.errors++}else{this.score++;this.hits++}this.last=-1;this.start=this.t;this.target=this.rand(.7,2.3);return;
 }
 this.hits++;const count=this.g.engine==='hawk'?5:this.g.engine==='rhythm'?8:3;this.score=this.values.reduce((a,b)=>a+b,0)/this.values.length;if(this.round>=count)this.finish();
 }
 targetCell=this.int(0,8);reactionCell(){return {x:110+(this.targetCell%3)*100,y:180+Math.floor(this.targetCell/3)*100}}
 draw(c:CanvasRenderingContext2D){this.background(c);const e=this.t-this.start;const en=this.g.engine;
 if(en==='hawk'){this.header(c,`Toque ${this.round+1} de 5`,'Busca el centro');rect(c,40,250,340,50,'#eed4ba');rect(c,185,250,50,50,C.mint);rect(c,207,245,6,60,C.green);const x=210+Math.sin(e*(2.1+this.round*.25))*160;line(c,{x,y:226},{x,y:318},C.ink,4);button(c,'DETENER',135,420,150)}
 else if(en==='reaction'){this.header(c,`Ronda ${this.round+1} de 3`,this.last<0?'Espera a la casilla verde…':'¡Tócala!');for(let i=0;i<9;i++){const p={x:110+i%3*100,y:180+Math.floor(i/3)*100};rect(c,p.x-43,p.y-43,86,86,i===this.targetCell&&this.last>=0?C.green:'#e3e9da');}text(c,`${this.errors} salidas falsas`,210,480,14,C.muted)}
 else if(en==='flash'){rect(c,35,130,350,300,this.last<0?'#e8ddf0':C.mint,30);this.header(c,this.last<0?'Espera…':'¡Ahora!');text(c,this.last<0?'No te adelantes':'Toca la pantalla',210,280,24)}
 else if(en==='rhythm'){this.header(c,e<2.4?'Observa cuatro pulsos':'Tu turno',`${this.values.length} / 8 toques`);const lit=e<2.4&&(e%.6)<.15;circle(c,210,275,80,lit?C.yellow:C.mint);text(c,e<2.4?'♪':'Toca',210,275,32);text(c,'Mantén el mismo tempo',210,410,18,C.muted)}
 else{this.header(c,`Ronda ${this.round+1} de 3`,en==='clock'?`Toca en ${this.target.toFixed(2)} s`:'Toca cuando termine');if(en==='clock')text(c,e.toFixed(2),210,265,60);else{rect(c,45,250,330,40,'#e1e7d9');rect(c,45,250,330*Math.max(0,1-e/this.target),40,C.green);text(c,'Observa la barra',210,330,18,C.muted)}button(c,'DETENER',135,425,150)}
 }
}
export class Arithmetic extends Engine{
 round=0;penalty=0;answer=0;options:number[]=[];a=0;b=0;op='+';dice:number[]=[];typed='';started=false;digits='';expectedIndex=0;tiles:number[]=[];
 constructor(...args:ConstructorParameters<typeof Engine>){super(...args);this.next()}
 next(){this.typed='';this.a=this.int(1,15);this.b=this.int(1,15);this.op=this.random()>.7?'×':'+';this.answer=this.op==='×'?this.a*this.b:this.a+this.b;this.options=this.shuffled([this.answer,this.answer+this.int(1,7),Math.max(0,this.answer-this.int(1,7)),this.answer+this.int(8,15)]);this.dice=Array.from({length:4},()=>this.int(1,6));if(this.g.engine==='dice')this.answer=this.dice.reduce((a,b)=>a+b,0);this.digits=Array.from({length:this.g.engine==='phone'?8:Math.min(10,3+this.level)},()=>this.int(0,9)).join('');this.tiles=this.shuffled(Array.from({length:16},(_,i)=>i+1));}
 step(_dt:number){if(this.g.engine==='phone'&&!this.started&&this.t>=4){this.started=true;this.t=0}if(this.g.engine==='dictation'&&this.t>5+this.level*2)this.fail();if(this.g.lower)this.score=this.t+this.penalty}
 action(k:string,p:Point){const en=this.g.engine;if(k==='tap'){
 if(en==='math'){if(p.y>=180&&p.y<=380){const i=Math.floor((p.y-180)/100)*2+Math.floor((p.x-50)/165);if(i>=0&&i<4)this.submit(this.options[i])}return}
 if(en==='numbers'){const col=Math.floor((p.x-40)/85),row=Math.floor((p.y-140)/85);if(col>=0&&col<4&&row>=0&&row<4){const v=this.tiles[row*4+col];if(v===this.expectedIndex+1){this.expectedIndex++;this.hits++;if(this.expectedIndex===16)this.finish('completed',this.t+this.penalty)}else{this.penalty++;this.errors++}}return}
 const col=Math.floor((p.x-75)/90),row=Math.floor((p.y-225)/64);if(col>=0&&col<3&&row>=0&&row<4)k=['1','2','3','4','5','6','7','8','9','back','0','enter'][row*3+col];else return;
 }
 if(en==='math'&&/^[1-4]$/.test(k)){this.submit(this.options[Number(k)-1]);return}
 if(k==='back'){this.typed=this.typed.slice(0,-1);return}if(k==='enter'&&en==='dice'){this.submit(Number(this.typed));return}
 if(/^\d$/.test(k)){
 if(en==='phone'&&!this.started)return;
 if(['phone','dictation','pi'].includes(en)){const seq=en==='pi'?'14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196':this.digits;
 const i=en==='pi'?this.expectedIndex:this.typed.length;if(k!==seq[i]){this.errors++;if(en==='phone'){this.penalty++;this.message='Inténtalo de nuevo'}else this.fail();return}this.typed+=k;this.hits++;if(en==='pi'){this.expectedIndex++;this.score=this.expectedIndex;if(this.expectedIndex===seq.length)this.finish();return}if(this.typed.length===seq.length){if(en==='phone')this.finish('completed',this.t+this.penalty);else{this.score=this.hits;this.level++;this.t=0;this.next()}}}
 else if(this.typed.length<3)this.typed+=k;
 }
 }
 submit(v:number){if(v!==this.answer){this.penalty+=2;this.errors++;this.message='Respuesta incorrecta · +2 s';this.typed='';return}this.hits++;this.round++;if(this.round>=(this.g.engine==='math'?5:3))this.finish('completed',this.t+this.penalty);else this.next()}
 draw(c:CanvasRenderingContext2D){this.background(c);const en=this.g.engine;
 if(en==='math'){this.header(c,`Operación ${this.round+1} de 5`);text(c,`${this.a} ${this.op} ${this.b} = ?`,210,120,38);this.options.forEach((v,i)=>button(c,String(v),50+i%2*165,180+Math.floor(i/2)*100,150));}
 else if(en==='numbers'){this.header(c,`Busca el ${this.expectedIndex+1}`,'Del 1 al 16, en orden');this.tiles.forEach((v,i)=>{rect(c,40+i%4*85,140+Math.floor(i/4)*85,76,76,v<=this.expectedIndex?C.mint:'#fff');if(v>this.expectedIndex)text(c,String(v),78+i%4*85,178+Math.floor(i/4)*85,26)})}
 else{this.header(c,en==='dice'?`Ronda ${this.round+1} de 3`:en==='phone'?(this.started?'Marca el número':'Memoriza estos dígitos'):en==='pi'?'π = 3,…':`Nivel ${this.level}`);
 if(en==='dice')this.dice.forEach((v,i)=>{rect(c,40+i*88,100,70,70,'#fff');const layouts:Record<number,number[]>={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};for(const j of layouts[v])circle(c,57+i*88+j%3*18,117+Math.floor(j/3)*18,4,C.ink)});
 else if(en==='phone')text(c,this.started?'● ● ● ● ● ● ● ●':this.digits,210,130,30);
 else if(en==='dictation')text(c,this.digits,210,120,32);
 text(c,this.typed.slice(-18)||'…',210,195,26,C.green);['1','2','3','4','5','6','7','8','9','⌫','0','↵'].forEach((s,i)=>button(c,s,75+i%3*90,225+Math.floor(i/3)*64,78,i===11?C.green:'#728772'));
 }text(c,this.message,210,520,14,C.red);
 }
}
export class Memory extends Engine {
 phase='observe';phaseStart=0;seq:number[]=[];positions:Point[]=[];index=0;selected=new Set<number>();count=0;guess=0;cup=0;cupPositions=[0,1,2];swaps:[number,number][]=[];swapIndex=0;swapFrom=[0,1,2];ballCup=0;traceStart=false;
 constructor(...args:ConstructorParameters<typeof Engine>){super(...args);this.next()}
 next(){this.phase='observe';this.phaseStart=this.t;this.index=0;this.selected.clear();const en=this.g.engine;const n=Math.min(12,2+this.level);const cells=en==='honey'?Math.min(25,9+Math.floor(this.level/3)*7):en==='chimp'?16:9;this.seq=en==='simon'?Array.from({length:n},()=>this.int(0,3)):this.shuffled(Array.from({length:cells},(_,i)=>i)).slice(0,n);this.positions=Array.from({length:cells},(_,i)=>en==='honey'?{x:75+(i%5)*67+(Math.floor(i/5)%2)*15,y:150+Math.floor(i/5)*64}:{x:75+(i%(en==='chimp'?4:3))* (en==='chimp'?90:135),y:160+Math.floor(i/(en==='chimp'?4:3))*90});this.count=this.int(3,Math.min(32,7+this.level*2));this.guess=0;this.cupPositions=[0,1,2];this.ballCup=this.int(0,2);this.swaps=Array.from({length:3+this.level},()=>{const a=this.int(0,2);return [a,(a+this.int(1,2))%3]});this.swapFrom=[...this.cupPositions];this.swapIndex=0;}
 step(_dt:number){const e=this.t-this.phaseStart;const en=this.g.engine;
 if(en==='cups'){if(this.phase==='observe'&&e>1.2){this.phase='mix';this.phaseStart=this.t}if(this.phase==='mix'&&this.t-this.phaseStart>=Math.max(.22,.65-this.level*.025)){const [a,b]=this.swaps[this.swapIndex];[this.cupPositions[a],this.cupPositions[b]]=[this.cupPositions[b],this.cupPositions[a]];this.swapFrom=[...this.cupPositions];this.swapIndex++;this.phaseStart=this.t;if(this.swapIndex>=this.swaps.length){this.phase='answer';this.phaseStart=this.t}}}
 else if(this.phase==='observe'&&e>(en==='simon'?this.seq.length*.7:en==='boxes'?1.5:2.8)){this.phase='answer';this.phaseStart=this.t;this.message='Tu turno'}
 if(this.phase==='answer'&&en==='chimp'&&e>15)this.fail();
 }
 complete(){this.hits++;this.score+=this.g.engine==='cups'||this.g.engine==='boxes'?1:this.seq.length*5;this.level++;this.message='¡Bien hecho!';this.next()}
 choose(i:number){if(this.phase!=='answer')return;if(this.g.engine==='honey'){if(!this.seq.includes(i)||this.selected.has(i)){this.fail();return}this.selected.add(i);if(this.selected.size===this.seq.length)this.complete();return}if(i!==this.seq[this.index]){this.fail();return}this.selected.add(i);this.index++;if(this.index===this.seq.length)this.complete()}
 action(k:string,p:Point){const en=this.g.engine;if(en==='simon'&&['left','up','right','down'].includes(k)){this.choose(['left','up','right','down'].indexOf(k));return}if(k==='release'){this.traceStart=false;return}if(!['tap','move','action','left','right','enter'].includes(k))return;
 if(en==='boxes'){if(this.phase!=='answer')return;if(k==='left'||(k==='tap'&&p.x<150&&p.y>360))this.guess=Math.max(0,this.guess-1);if(k==='right'||(k==='tap'&&p.x>270&&p.y>360))this.guess++;if(k==='enter'||k==='action'||(k==='tap'&&p.x>=150&&p.x<=270&&p.y>360)){if(this.guess===this.count)this.complete();else this.fail()}return}
 if(en==='cups'&&k==='tap'&&this.phase==='answer'){const slot=Math.round((p.x-85)/125);if(slot>=0&&slot<3&&p.y>200&&p.y<410){if(this.cupPositions[this.ballCup]===slot)this.complete();else this.fail()}return}
 if(en==='simon'&&k==='tap'){const ps=[{x:85,y:320},{x:210,y:200},{x:335,y:320},{x:210,y:440}];const i=ps.findIndex(q=>dist(p,q)<50);if(i>=0)this.choose(i);return}
 if(en==='trace'){if(this.phase!=='answer')return;if(k==='tap')this.traceStart=true;if(!this.traceStart)return;const i=this.positions.findIndex(q=>dist(p,q)<24);if(i>=0&&i!==this.seq[this.index-1])this.choose(i);return}
 if(k==='tap'){const i=this.positions.findIndex(q=>dist(p,q)<34);if(i>=0)this.choose(i)}
 }
 draw(c:CanvasRenderingContext2D){this.background(c);const en=this.g.engine;const e=this.t-this.phaseStart;this.header(c,`Nivel ${this.level}`,this.phase==='answer'?'Tu turno':this.phase==='mix'?'Sigue la bola…':'Observa y recuerda');
 if(en==='cups'){for(let i=0;i<3;i++){let x=85+this.cupPositions[i]*125;if(this.phase==='mix'){const [a,b]=this.swaps[this.swapIndex];const progress=clamp(e/Math.max(.22,.65-this.level*.025),0,1);if(i===a||i===b){const target=this.cupPositions[i===a?b:a];x=85+(this.cupPositions[i]+(target-this.cupPositions[i])*progress)*125}}rect(c,x-40,250,80,100,C.green,20);text(c,'?',x,295,35,'#fff');if(this.phase==='observe'&&i===this.ballCup)circle(c,x,390,13,C.yellow)}return}
 if(en==='boxes'){if(this.phase==='observe')for(let i=0;i<this.count;i++){rect(c,45+i%7*47,130+Math.floor(i/7)*47,38,38,'#c79967',4);line(c,{x:45+i%7*47,y:130+Math.floor(i/7)*47},{x:83+i%7*47,y:168+Math.floor(i/7)*47},'#a4784c',1)}else{text(c,'¿Cuántas cajas viste?',210,200,23);text(c,String(this.guess),210,285,55);button(c,'−',55,380,80);button(c,'Enviar',150,380,120);button(c,'+',285,380,80)}return}
 if(en==='simon'){const ps=[{x:85,y:320},{x:210,y:200},{x:335,y:320},{x:210,y:440}];const show=this.phase==='observe'?this.seq[Math.floor(e/.7)]:-1;ps.forEach((p,i)=>{circle(c,p.x,p.y,47,i===show?C.yellow:C.mint);text(c,['←','↑','→','↓'][i],p.x,p.y,30)});return}
 if(en==='trace'&&this.phase==='observe')for(let i=1;i<this.seq.length;i++)line(c,this.positions[this.seq[i-1]],this.positions[this.seq[i]],C.green,5);
 this.positions.forEach((p,i)=>{const active=this.phase==='observe'&&this.seq.includes(i);circle(c,p.x,p.y,en==='honey'?26:30,this.selected.has(i)?C.green:active?C.yellow:'#e1e8d9');if(en==='chimp'&&active)text(c,String(this.seq.indexOf(i)+1),p.x,p.y,24);if(en==='trace'&&active)text(c,String(this.seq.indexOf(i)+1),p.x,p.y,18)});
 }
}
function hslToLab(h:number,s:number,l:number){const a=s*Math.min(l,1-l);const rgb=[0,8,4].map(n=>{const k=(n+h/30)%12;const v=l-a*Math.max(-1,Math.min(k-3,9-k,1));return v>.04045?Math.pow((v+.055)/1.055,2.4):v/12.92});const [r,g,b]=rgb;const f=(v:number)=>v>.008856?Math.cbrt(v):7.787*v+16/116;const x=f((r*.4124+g*.3576+b*.1805)/.95047),y=f(r*.2126+g*.7152+b*.0722),z=f((r*.0193+g*.1192+b*.9505)/1.08883);return [116*y-16,500*(x-y),200*(y-z)]}
export class Colors extends Engine{
 target=[this.rand(0,360),this.rand(.35,.85),this.rand(.3,.7)];values=[180,.6,.5];lastMatch=0;
 similarity(){const a=hslToLab(...this.target as [number,number,number]),b=hslToLab(...this.values as [number,number,number]);return clamp(100-Math.hypot(...a.map((v,i)=>v-b[i])),0,100)}
 step(_dt:number){if(this.g.engine==='match'&&this.similarity()>92&&this.t-this.lastMatch>.6){this.score++;this.hits++;this.target=[this.rand(0,360),.65,this.rand(.3,.7)];this.lastMatch=this.t}}
 action(k:string,p:Point){if(this.g.engine==='color'&&this.t<3)return;if((k==='tap'||k==='move')&&this.held){const i=Math.round((p.y-315)/58);if(i>=0&&i<(this.g.engine==='match'?2:3)&&p.x>=55&&p.x<=365){const idx=this.g.engine==='match'&&i===1?2:i;this.values[idx]=clamp((p.x-55)/310,0,1)*(idx===0?360:1)}}if(this.g.engine==='color'&&(k==='action'||(k==='tap'&&p.y>490)))this.finish('completed',this.similarity())}
 draw(c:CanvasRenderingContext2D){this.background(c);const memorizing=this.g.engine==='color'&&this.t<3;this.header(c,memorizing?'Memoriza este color':this.g.engine==='match'?'Iguala los colores':'Recrea el color',memorizing?'Desaparece en tres segundos':'Arrastra los controles');const color=(v:number[])=>`hsl(${v[0]} ${v[1]*100}% ${v[2]*100}%)`;if(this.g.engine==='match')this.target[1]=.65;rect(c,55,120,145,130,this.g.engine==='match'||memorizing?color(this.target):'#e0e4da',22);rect(c,220,120,145,130,color(this.values),22);text(c,'Objetivo',127,272,14,C.muted);text(c,'Tu color',292,272,14,C.muted);const labels=this.g.engine==='match'?['Tono','Brillo']:['Tono','Saturación','Brillo'];labels.forEach((s,i)=>{const idx=this.g.engine==='match'&&i===1?2:i;text(c,s,55,300+i*58,13,C.muted,'left');rect(c,55,315+i*58,310,8,'#dce4d7',4);circle(c,55+this.values[idx]/(idx===0?360:1)*310,319+i*58,12,C.green)});if(this.g.engine==='color')button(c,'Confirmar',135,495,150);else text(c,`Parecido ${this.similarity().toFixed(0)} %`,210,470,20,C.green)}
}
export class Cut extends Engine{
 start:Point|null=null;end:Point|null=null;round=0;values:number[]=[];
 step(_dt:number){}
 // Clip the jellyfish square by a directed line; score the smaller separated area.
 area(a:Point,b:Point){let poly=[{x:85,y:150},{x:335,y:150},{x:335,y:400},{x:85,y:400}];const side=(p:Point)=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);const out:Point[]=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length];const sp=side(p),sq=side(q);if(sp>=0)out.push(p);if((sp>=0)!==(sq>=0)){const f=sp/(sp-sq);out.push({x:p.x+(q.x-p.x)*f,y:p.y+(q.y-p.y)*f})}}poly=out;let area=0;for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length];area+=p.x*q.y-q.x*p.y}return Math.abs(area)/2/62500}
 action(k:string,p:Point){if(k==='tap'){this.start=p;this.end=p}if(k==='move'&&this.start)this.end=p;if(k==='release'&&this.start&&dist(this.start,p)>30){const a=this.area(this.start,p);const fraction=Math.min(a,1-a);const target=[.5,1/3,.25][this.round];this.values.push(clamp(100-Math.abs(fraction-target)*200,0,100));this.round++;this.start=null;this.end=null;this.score=this.values.reduce((a,b)=>a+b,0)/this.values.length;if(this.round===3)this.finish()}}
 draw(c:CanvasRenderingContext2D){this.background(c);this.header(c,`Separa ${['la mitad','un tercio','un cuarto'][this.round]}`,'Traza un corte recto sobre la medusa');rect(c,85,150,250,250,C.purple,0);circle(c,165,260,9,C.ink);circle(c,255,260,9,C.ink);for(let i=0;i<6;i++)line(c,{x:100+i*44,y:400},{x:100+i*44+Math.sin(i)*10,y:450},C.purple,12);if(this.start&&this.end)line(c,this.start,this.end,C.green,4);text(c,`Corte ${this.round+1} de 3`,210,505,16,C.muted)}
}
export class Sokoban extends Engine{
 player={x:2,y:4};box={x:3,y:3};goal={x:3,y:1};history:{player:Point;box:Point}[]=[];walls:Point[]=[{x:1,y:2},{x:5,y:3}];
 step(_dt:number){}
 action(k:string,p:Point){if(k==='tap'&&p.y>460){if(p.x<210)k='undo';else k='reset'}if(k==='undo'){const old=this.history.pop();if(old){this.player=old.player;this.box=old.box}return}if(k==='reset'){this.player={x:2,y:4};this.box={x:3,y:3};this.history=[];return}const d:Record<string,Point>={left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}};if(!d[k])return;const q={x:this.player.x+d[k].x,y:this.player.y+d[k].y};const blocked=(v:Point)=>v.x<1||v.x>5||v.y<1||v.y>5||this.walls.some(w=>dist(w,v)===0);if(blocked(q))return;const old={player:{...this.player},box:{...this.box}};if(dist(q,this.box)===0){const b={x:this.box.x+d[k].x,y:this.box.y+d[k].y};if(blocked(b))return;this.box=b}this.history.push(old);this.player=q;if(dist(this.box,this.goal)===0){this.score+=10;this.hits++;this.level++;this.goal={x:this.level%2?3:4,y:1};this.box={x:this.level%2?3:4,y:3};this.player={x:2,y:4};this.history=[]}}
 draw(c:CanvasRenderingContext2D){this.background(c);this.header(c,`Nivel ${this.level}`,'Lleva la caja al círculo verde');for(let y=0;y<7;y++)for(let x=0;x<7;x++)rect(c,35+x*50,115+y*46,47,43,x===0||y===0||x===6||y===6||this.walls.some(w=>w.x===x&&w.y===y)?'#a1b29b':'#e8edde',5);circle(c,59+this.goal.x*50,136+this.goal.y*46,14,C.green);rect(c,40+this.box.x*50,120+this.box.y*46,37,33,'#ba9064',5);circle(c,59+this.player.x*50,136+this.player.y*46,14,C.yellow);button(c,'Deshacer',60,470,140,'#718570');button(c,'Reiniciar',220,470,140,'#718570')}
}
