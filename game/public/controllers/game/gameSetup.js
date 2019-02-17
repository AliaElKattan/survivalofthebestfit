import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
// console.log(PIXI);
const debounce = require('debounce');

// make fullscreen app
var pixiApp = new PIXI.Application(
  window.innerWidth,
  window.innerHeight,
  {backgroundColor : 0xf9f0e2}
);
pixiApp.renderer.autoResize = true;

var officeContainer = new PIXI.Container();
var personContainer = new PIXI.Container();
var deskContainer = new PIXI.Container();
var timerContainer = new PIXI.Container();
var cvViewerContainer = new PIXI.Container();

var beltContainer = new  PIXI.Container();

pixiApp.stage.addChild(officeContainer);
pixiApp.stage.addChild(timerContainer);
pixiApp.stage.addChild(cvViewerContainer);

pixiApp.stage.addChild(beltContainer);

officeContainer.addChild(deskContainer);
officeContainer.addChild(personContainer);

//shared eventEmitter across components
var eventEmitter = new PIXI.utils.EventEmitter();
PIXI.settings.PRECISION_FRAGMENT = 'highp';

//setup for the pixi-tween manager  CALLED AT THE END OF MAIN.JS
var raf;
var startTweenManager = function(){
  raf = window.requestAnimationFrame(startTweenManager);
  pixiApp.renderer.render(pixiApp.stage);
  PIXI.tweenManager.update();
}
var stopTweenManager = function(){
  window.cancelAnimationFrame(raf);
}
startTweenManager = startTweenManager.bind(this);
stopTweenManager = startTweenManager.bind(this);

window.addEventListener('resize', debounce(resize, 200));

function resize() {
	pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
  // TODO redraw all the elements!
}

export { pixiApp,  beltContainer, officeContainer, personContainer, deskContainer,
  timerContainer, cvViewerContainer, eventEmitter, startTweenManager, stopTweenManager};
