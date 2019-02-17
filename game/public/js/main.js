import { eventEmitter } from './shared.js';
import "@babel/polyfill";
import { pixiApp, startTweenManager } from './shared.js';
import { gameFSM } from './gameStates.js';
import {trainSVM } from './svm.js';

import Resume from '../components/ui/ui-resume/ui-resume';
import TaskTimer from '../components/ui/task-timer/task-timer';


console.log(txt.stageZero.welcome);
console.log('hellooo!');

/* -- JUST TESTING -- */
// new Resume({content: 'this is my CV', show: true}); 
// new TaskTimer({show: true});



document.getElementById("gameCanvas").appendChild(pixiApp.view);
var a = 0;
gameFSM.startGame();

startTweenManager();
