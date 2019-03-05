import '@babel/polyfill';
import ComponentLoader from 'component-loader-js';
import {eventEmitter} from './gameSetup.js';
import {pixiApp, startTweenManager} from './gameSetup.js';
import {gameFSM} from './stateManager.js';
import {trainSVM} from '../machine-learning/svm.js';
import {loadAssets} from '../common/textures.js';
import ChoiceButton from '../../components/interface/transition/choice-button/choice-button';
import Replica from '../../components/interface/transition/replica/replica';

const componentLoader = new ComponentLoader({
    ChoiceButton,
    Replica,
});

componentLoader.scan();

document.getElementById('gameCanvas').appendChild(pixiApp.view);
const a = 0;
loadAssets().then(() => {
    console.log('start game!!');
    gameFSM.startGame();

    startTweenManager();
});


