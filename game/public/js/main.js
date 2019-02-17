import { eventEmitter } from './shared.js';
import "@babel/polyfill";
import { pixiApp, startTweenManager } from './shared.js';
import { gameFSM } from './gameStates.js';
import {trainSVM } from './svm.js';

import ResumeUI from '../components/ui/ui-resume/ui-resume';

console.log(txt.stageZero.welcome);
console.log('hellooo!');

// new ResumeUI({content: 'this is my CV', show: true}); 
// eventEmitter.emit('emitter-test-emit', {});


document.getElementById("gameCanvas").appendChild(pixiApp.view);
var a = 0;
gameFSM.startGame();

startTweenManager();
