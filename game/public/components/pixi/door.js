import * as PIXI from 'pixi.js';
import {pixiApp} from '../../controllers/game/gameSetup';
import {doorTexture} from '../../controllers/common/textures.js';


export default class {
    constructor(options) {
        this.xAnchor = options.x;
        this.yAnchor = options.y;
        this.scale = 0.55;
        this.texture = doorTexture;
        this.door = null;
    }

    draw() {
        this.door = new PIXI.Sprite(doorTexture);
        this.door.x = this.xAnchor;
        this.door.y = this.yAnchor;
        this.door.scale.set(this.scale);
        pixiApp.stage.addChild(this.door);
    }
}
