import SCALES from '~/public/game/controllers/constants/pixi-scales.js';
import {screenSizeDetector} from '~/public/game/controllers/common/utils.js';

const SPRITES = {};

const loader = PIXI.loaders.shared;
loader
    .add('machine', 'assets/img/machine.png')
    .add('inspectButton', 'assets/img/question-mark-icon.png')
    .add('scanRay', 'assets/img/scan-ray.png')
    .add('rayAnim', 'assets/spritesheets/machine-ray/ray_spritesheet.json')
    .add('dataServerRejected', 'assets/spritesheets/data-server-rejected/data-server-rejected.json')
    .add('dataServerAccepted', 'assets/spritesheets/data-server-accepted/data-server-accepted.json')
    .add('doorAccepted', 'assets/img/door-accepted.png')
    .add('officeDoor', 'assets/spritesheets/office-door/office-door.json')
    .add('wayOutDoor', 'assets/spritesheets/way-out-door/way-out-door.json')
    .add('doorRejected', 'assets/img/door-rejected.png');

async function loadAssets() {
    await new Promise((resolve, reject) => {
        loader.load((loader, resources) => {
            SPRITES.doorAccepted = new PIXI.extras.AnimatedSprite(resources.officeDoor.spritesheet.animations['door']);
            SPRITES.doorEntry = new PIXI.extras.AnimatedSprite(resources.officeDoor.spritesheet.animations['door']);
            SPRITES.doorRejected = new PIXI.extras.AnimatedSprite(resources.wayOutDoor.spritesheet.animations['door']);
            SPRITES.machine = new PIXI.Sprite(resources.machine.texture);
            SPRITES.scanRay = new PIXI.Sprite(resources.scanRay.texture);
            SPRITES.inspectButton = new PIXI.Sprite(resources.inspectButton.texture);
            SPRITES.rayAnim = new PIXI.extras.AnimatedSprite(resources.rayAnim.spritesheet.animations['ray']);
            SPRITES.dataServerAccepted = new PIXI.extras.AnimatedSprite(resources.dataServerAccepted.spritesheet.animations['data-server-accepted']);
            SPRITES.dataServerRejected = new PIXI.extras.AnimatedSprite(resources.dataServerRejected.spritesheet.animations['data-server-rejected']);
            SPRITES.dataServerAccepted.scale.set(SCALES.DATA_SERVER[screenSizeDetector()]);
            SPRITES.dataServerRejected.scale.set(SCALES.DATA_SERVER[screenSizeDetector()]);
            resolve();
        });
    });
};


// loader.load((loader, resources) => {
//     console.log('textures are loaded!');
//     SPRITES.machine = new PIXI.Sprite(resources.machine.texture);
// });
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

// const machineTexture = PIXI.Texture.fromImage('assets/img/machine.png');
// machineTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const doorTexture = PIXI.Texture.fromImage('assets/img/door.png');
doorTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const cvTexture = PIXI.Texture.fromImage('assets/img/cv_yellow.png');
cvTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


export {cvTexture, doorTexture, personTexture, SPRITES, loadAssets, yellowPersonTexture, bluePersonTexture, deskTexture, incubator, floorPlanOne, floorPlanTwo, xIcon, beltTexture};
