import {pixiApp} from '../../../controllers/game/gameSetup.js';
import {spacingUtils as space} from '../../../controllers/common/utils.js';
import {SPRITES} from '../../../controllers/common/textures.js';

export default class {
    constructor(options) {
        this.scanRay = SPRITES.rayAnim;
        this.machineConfig = options;
        this.scanRayConfig = {
            x: space.getCenteredChildX(this.machineConfig.x, this.machineConfig.width, this.scanRay.width*this.machineConfig.scale),
            y: this.machineConfig.y + this.machineConfig.height,
        };
    }

    draw() {
        this.scanRay.scale.set(this.machineConfig.scale);
        this.scanRay.y = this.scanRayConfig.y;
        this.scanRay.x = this.scanRayConfig.x;
        this.scanRay.loop = false;
        this.scanRay.animationSpeed = 0.5;
        this.scanRay.gotoAndStop(0);
        this.scanRay.visible = false;
        pixiApp.stage.addChild(this.scanRay);
    }

    hideRay() {
        this.scanRay.visible = false;
    }

    showRay() {
        this.scanRay.visible = true;
    }

    getSprite() {
        return this.scanRay;
    }
}
