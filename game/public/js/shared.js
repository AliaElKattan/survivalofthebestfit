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

pixiApp.stage.addChild(officeContainer);
pixiApp.stage.addChild(timerContainer);
pixiApp.stage.addChild(cvViewerContainer);

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

// convenience function to animate object, parameter default to not moving anywhere
function animateTo({target, x, y, scale=1, easing=PIXI.tween.Easing.inQuart(), time=1000} = {}){
  if (x === undefined) {
        x = target.x;
  };
  if (y === undefined) {
        y = target.y;
  };
  var tween = PIXI.tweenManager.createTween(target);
  tween.easing = easing;
  tween.time = time;
  tween.expire = true;
  tween.from({
    'x' : target.x,
    'y' : target.y,
    'scale' : {'x': target.scale.x, 'y': target.scale.y}
  })
  tween.to({
    'x' : x,
    'y' : y,
    'scale' : {'x': target.scale.x*scale, 'y': target.scale.y*scale}
  })
  return tween;
}

window.addEventListener('resize', debounce(resize, 200));
function resize() {
  console.log('debounced!');
	// pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
  // rect.position.set(app.screen.width, app.screen.height);
}

export { pixiApp,  officeContainer, personContainer, deskContainer, 
  timerContainer, cvViewerContainer, eventEmitter, startTweenManager, stopTweenManager, animateTo};
