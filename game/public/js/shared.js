var pixiApp = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
var officeContainer = new PIXI.Container();
var personContainer = new PIXI.Container();
var deskContainer = new PIXI.Container();

deskContainer.zOrder = 2;
personContainer.zOrder = 3;
officeContainer.enableSort = true;

pixiApp.stage.addChild(officeContainer);
officeContainer.addChild(deskContainer);
officeContainer.addChild(personContainer);

//shared eventEmitter across components
var eventEmitter = new PIXI.utils.EventEmitter();

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


export { pixiApp,  officeContainer, personContainer, deskContainer, eventEmitter, startTweenManager, stopTweenManager};
