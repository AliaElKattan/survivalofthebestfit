//module to load textures
var personTexture = PIXI.Texture.fromImage('assets/img/character.png');
personTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var yellowPersonTexture = PIXI.Texture.fromImage('assets/img/person_yellow.png');

yellowPersonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var bluePersonTexture = PIXI.Texture.fromImage('assets/img/person_blue.png');
bluePersonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var deskTexture = PIXI.Texture.fromImage('assets/img/desk.png');
deskTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var incubator = PIXI.Texture.fromImage('assets/img/incubator-winners.jpeg');

var floorPlanOne = PIXI.Texture.fromImage('assets/img/3D-floorplan-small.jpg');
floorPlanOne.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var floorPlanTwo = PIXI.Texture.fromImage('assets/img/3D-floorplan-large.jpg');
floorPlanTwo.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var xIcon = PIXI.Texture.fromImage('assets/img/x-icon.png');
floorPlanTwo.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var beltTexture = PIXI.Texture.fromImage('assets/img/conveyor_belt.png');
beltTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var doorTexture = PIXI.Texture.fromImage('assets/img/conveyor_belt.png');
doorTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


export {doorTexture, personTexture, yellowPersonTexture, bluePersonTexture, deskTexture, incubator , floorPlanOne, floorPlanTwo, xIcon, beltTexture}
