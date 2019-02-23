// module to load textures
const personTexture = PIXI.Texture.fromImage('assets/img/character.png');
personTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const yellowPersonTexture = PIXI.Texture.fromImage('assets/img/person_yellow.png');

yellowPersonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const bluePersonTexture = PIXI.Texture.fromImage('assets/img/person_blue.png');
bluePersonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const deskTexture = PIXI.Texture.fromImage('assets/img/desk.png');
deskTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const incubator = PIXI.Texture.fromImage('assets/img/incubator-winners.jpeg');

const floorPlanOne = PIXI.Texture.fromImage('assets/img/3D-floorplan-small.jpg');
floorPlanOne.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const floorPlanTwo = PIXI.Texture.fromImage('assets/img/3D-floorplan-large.jpg');
floorPlanTwo.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const xIcon = PIXI.Texture.fromImage('assets/img/x-icon.png');
floorPlanTwo.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const beltTexture = PIXI.Texture.fromImage('assets/img/conveyor_belt.png');
beltTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const doorTexture = PIXI.Texture.fromImage('assets/img/door.png');
doorTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const cvTexture = PIXI.Texture.fromImage('assets/img/cv_yellow.png');
cvTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


export {cvTexture, doorTexture, personTexture, yellowPersonTexture, bluePersonTexture, deskTexture, incubator, floorPlanOne, floorPlanTwo, xIcon, beltTexture};
