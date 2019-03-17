import * as PIXI from 'pixi.js';
import {SPRITES} from '../../controllers/common/textures.js';
import {pixiApp} from '../../controllers/game/gameSetup';


export default class {
    constructor(options) {
        this.doorType = options.type === 'rejected' ? 'doorRejected' : 'doorAccepted';
        this.xAnchor = options.x;
        this.yAnchor = options.y;
        this.scale = 0.5;
        this.door = null;
    }

    draw() {
        this.door = SPRITES[this.doorType];
        this.door.x = this.xAnchor;
        this.door.y = this.yAnchor;
        this.door.scale.set(this.scale);
        pixiApp.stage.addChild(this.door);
    }
}
