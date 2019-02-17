import "@babel/polyfill";
import { pixiApp, startTweenManager } from '../../controllers/game/gameSetup.js';
import { gameFSM } from '../../controllers/game/stateManager.js';
import {trainSVM } from '../../controllers/machine-learning/svm.js';

console.log(txt.stageZero.welcome);

document.getElementById("gameCanvas").appendChild(pixiApp.view);
var a = 0;
gameFSM.startGame();

startTweenManager();