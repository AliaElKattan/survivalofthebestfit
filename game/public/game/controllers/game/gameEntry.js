import '@babel/polyfill';
import ComponentLoader from 'component-loader-js';
import {pixiApp, startTweenManager} from './gameSetup.js';
import {gameFSM} from './stateManager.js';
import {loadAssets} from '../common/textures.js';
import ChoiceButton from '../../components/interface/transition/choice-button/choice-button';
import Replica from '../../components/interface/transition/replica/replica';
import Footer from '../../components/interface/footer/footer';


const componentLoader = new ComponentLoader({
    ChoiceButton,
    Replica,
    Footer,
});

componentLoader.scan();

document.getElementById('gameCanvas').appendChild(pixiApp.view);
loadAssets().then(() => {
    console.log('Start game!!');
    gameFSM.startGame();

    startTweenManager();
});


