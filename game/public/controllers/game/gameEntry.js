import {eventEmitter} from './gameSetup.js';
import '@babel/polyfill';
import {pixiApp, startTweenManager} from './gameSetup.js';
import {gameFSM} from './stateManager.js';
import {trainSVM} from '../machine-learning/svm.js';
import {loadAssets} from '../common/textures.js';

import ResumeUI from '../../components/interface/ui-resume/ui-resume';

/* -- JUST TESTING -- */
// new Resume({content: 'this is my CV', show: true});
// new TaskTimer({show: true});


document.getElementById('gameCanvas').appendChild(pixiApp.view);
const a = 0;
loadAssets().then(() => {
    console.log('start game!!');
    gameFSM.startGame();

    startTweenManager();
});

