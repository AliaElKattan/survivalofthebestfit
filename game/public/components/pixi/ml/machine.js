import * as PIXI from 'pixi.js';
import {pixiApp} from '../../../controllers/game/gameSetup';
import {machineTexture} from '../../../controllers/common/textures.js';
import {uv2px, spacingUtils as space} from '../../../controllers/common/utils.js';

export default class {
    constructor(options) {
        this.xAnchor = options.x || space.screenCenterX(450);
        this.yAnchor = options.y || space.screenCenterY(100) - uv2px(0.3, 'h');
        this.scale = 0.7;
        this.texture = machineTexture;
        this.machine = null;
    }

    draw() {
        this.machine = new PIXI.Sprite(machineTexture);
        this.machine.scale.set(this.scale);
        this.machine.y = this.yAnchor;
        this.machine.x = this.xAnchor;
        pixiApp.stage.addChild(this.machine);
    }
}