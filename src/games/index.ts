import type { GameDef } from '../catalog';
import { Engine,type Factory } from './core';
import { Timing,Arithmetic,Memory,Colors,Cut,Sokoban } from './mind';
import { Flyer,Avoider,Needles,Snake,Equilibrium,Bouncer,Timber,Slice,Stack,PathRunner,Helix,JumperAim,Swing,Moon } from './arcade';
import { Golf,Maze,Race } from './circuits';
import { Targets,Tap,Piano,Conveyor,Bingo,Arrows,Basket,Thrower,Garden,Bricks } from './rapid';
const factory=(Class: new(g:GameDef,seed:number)=>Engine):Factory=>(g,seed)=>new Class(g,seed);
export const engines:Record<string,Factory>={};
function register(names:string[],Class:new(g:GameDef,seed:number)=>Engine){for(const n of names)engines[n]=factory(Class)}
register(['hawk','clock','countdown','rhythm','reaction','flash'],Timing);
register(['math','dice','numbers','phone','dictation','pi'],Arithmetic);
register(['cups','boxes','chimp','simon','honey','trace'],Memory);
register(['color','match'],Colors);register(['cut'],Cut);register(['sokoban'],Sokoban);
register(['flappy','jet','chicken','bat','gecko','eel'],Flyer);register(['asteroids','traffic','crossing'],Avoider);
register(['spikes','knives'],Needles);register(['snake'],Snake);register(['balance','seesaw'],Equilibrium);
register(['juggle','flea','jumper'],Bouncer);register(['timber'],Timber);register(['slice'],Slice);register(['stack'],Stack);
register(['cheetah','zigzag','lemur'],PathRunner);register(['helix'],Helix);register(['penguin','frog','web'],JumperAim);
register(['swing'],Swing);register(['moon'],Moon);register(['golf','golf2','multigolf'],Golf);register(['maze'],Maze);
register(['race','roadrace','slot','ballrace'],Race);register(['targets','switches'],Targets);register(['tap'],Tap);
register(['piano'],Piano);register(['stamp','sort'],Conveyor);register(['bingo'],Bingo);register(['arrows'],Arrows);
register(['basket'],Basket);register(['throw'],Thrower);register(['garden'],Garden);register(['bricks'],Bricks);
export function createEngine(g:GameDef,seed:number){if(!engines[g.engine])throw Error(`Motor no disponible: ${g.engine}`);return engines[g.engine](g,seed)}
