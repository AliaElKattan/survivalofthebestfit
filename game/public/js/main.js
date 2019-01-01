import { pixiApp, startTweenManager } from './shared.js';
import { gameFSM } from './gameStates.js';
import {trainSVM } from './svm.js'

document.getElementById("gameCanvas").appendChild(pixiApp.view);

gameFSM.startGame();

startTweenManager();
