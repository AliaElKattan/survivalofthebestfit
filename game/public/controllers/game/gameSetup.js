import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
// console.log(PIXI);
const debounce = require('debounce');

// make fullscreen app
const pixiApp = new PIXI.Application(
    window.innerWidth,
    window.innerHeight,
    {backgroundColor: 0xf9f0e2}
);
pixiApp.renderer.autoResize = true;


//TODO - should these be pre-defined here?
const officeContainer = new PIXI.Container();
const personContainer = new PIXI.Container();
const deskContainer = new PIXI.Container();
const timerContainer = new PIXI.Container();

const beltContainer = new PIXI.Container();

pixiApp.stage.addChild(officeContainer);
pixiApp.stage.addChild(timerContainer);

pixiApp.stage.addChild(beltContainer);

officeContainer.addChild(deskContainer);
officeContainer.addChild(personContainer);

// shared eventEmitter across components
const eventEmitter = new PIXI.utils.EventEmitter();
PIXI.settings.PRECISION_FRAGMENT = 'highp';

// setup for the pixi-tween manager  CALLED AT THE END OF MAIN.JS
let raf;
let startTweenManager = function() {
    raf = window.requestAnimationFrame(startTweenManager);
    pixiApp.renderer.render(pixiApp.stage);
    PIXI.tweenManager.update();
};
let stopTweenManager = function() {
    window.cancelAnimationFrame(raf);
};
startTweenManager = startTweenManager.bind(this);
stopTweenManager = startTweenManager.bind(this);

window.addEventListener('resize', debounce(resize, 200));

function resize() {
    pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
    // TODO redraw all the elements!
}

//TODO - should these be pre-defined here?
function clearOfficeContainerGlobal() {
    officeContainer.parent.removeChild(officeContainer);
    console.log("Removed: " + officeContainer);

    officeContainer = new PIXI.Container();
    deskContainer = new PIXI.Container();
    personContainer = new PIXI.Container();

    officeContainer.addChild(deskContainer);
    officeContainer.addChild(personContainer);
} 


export {pixiApp, beltContainer, officeContainer, personContainer, deskContainer,
    timerContainer, eventEmitter, startTweenManager, stopTweenManager};
