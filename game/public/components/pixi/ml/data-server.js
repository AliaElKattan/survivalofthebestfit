import {mlLabStageContainer} from '../../../controllers/game/gameSetup.js';
import {screenSizeDetector, spacingUtils as space} from '../../../controllers/common/utils.js';
import {SPRITES} from '../../../controllers/common/textures.js';
import SCALES from '../../../controllers/constants/pixi-scales.js';

export default class {
    constructor({machine, side}) {
        this.sprite = side === 'left' ? SPRITES.dataServerRejected : SPRITES.dataServerAccepted;
        this.directionVector = side === 'left' ? -1 : 1;
        this.machine = machine;
    }

    addToPixi() {
        this.sprite.loop = false;
        this.sprite.animationSpeed = 0.17;
        this.sprite.gotoAndStop(0);
        this.draw();
        mlLabStageContainer.addChild(this.sprite);
    }

    draw() {
        this.sprite.scale.set(SCALES.DATA_SERVER[screenSizeDetector()]);
        this.machineDim = this.machine.getMachineDimensions();
        this.centerX = space.getCenteredChildX(this.machineDim.x, this.machineDim.width, this.sprite.width);
        this.sprite.x = this.centerX + this.directionVector*1.6*this.sprite.width;
        this.sprite.y = this.machineDim.y - 10;
    }

    getSprite() {
        return this.sprite;
    }
}
