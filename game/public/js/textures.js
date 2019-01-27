//module to load textures
var personTexture = PIXI.Texture.fromImage('assets/img/character.png');
personTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var deskTexture = PIXI.Texture.fromImage('assets/img/desk.png');
deskTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var incubator = PIXI.Texture.fromImage('assets/img/incubator-winners.jpeg');

var floorPlanOne = PIXI.Texture.fromImage('assets/img/3D-floorplan-small.jpg');
floorPlanOne.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var floorPlanTwo = PIXI.Texture.fromImage('assets/img/3D-floorplan-large.jpg');
floorPlanTwo.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var xIcon = PIXI.Texture.fromImage('assets/img/x-icon.png');
floorPlanTwo.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


export { personTexture, deskTexture, incubator , floorPlanOne, floorPlanTwo, xIcon}
