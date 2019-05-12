import '@babel/polyfill';
import ComponentLoader from 'component-loader-js';
import {eventEmitter} from './gameSetup.js';
import {pixiApp, startTweenManager} from './gameSetup.js';
import {gameFSM} from './stateManager.js';
import {trainClf, predictClf} from '../machine-learning/ml.js';
import {loadAssets} from '../common/textures.js';
import ChoiceButton from '../../components/interface/transition/choice-button/choice-button';
import Replica from '../../components/interface/transition/replica/replica';
import Footer from '../../components/interface/footer/footer';


const componentLoader = new ComponentLoader({
    ChoiceButton,
    Replica,
    Footer,
});

document.getElementById('gameCanvas').appendChild(pixiApp.view);
loadAssets().then(() => {
    console.log('start game!!');
    gameFSM.startGame();
    componentLoader.scan();

    startTweenManager();
});


