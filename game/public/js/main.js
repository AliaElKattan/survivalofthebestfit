import { eventEmitter } from './shared.js';
import "@babel/polyfill";
import { pixiApp, startTweenManager } from './shared.js';
import TextBoxUI from '../components/ui/ui-instruction/ui-instruction';
import { gameFSM } from './gameStates.js';
import {trainSVM } from './svm.js';

console.log(txt.stageZero.welcome);
console.log('hellooo!');

// const textboxUI = new TextBoxUI();
// setTimeout(() => textboxUI.show(), 2000);
// 
// eventEmitter.emit('emitter-test-emit', {});


document.getElementById("gameCanvas").appendChild(pixiApp.view);
var a = 0;
gameFSM.startGame();

startTweenManager();
