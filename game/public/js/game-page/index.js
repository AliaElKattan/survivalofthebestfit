import "@babel/polyfill";
import { pixiApp, startTweenManager } from '../shared.js';
import { gameFSM } from '../gameStates.js';
import {trainSVM } from '../svm.js';

console.log(txt.stageZero.welcome);

document.getElementById("gameCanvas").appendChild(pixiApp.view);
var a = 0;
gameFSM.startGame();

startTweenManager();