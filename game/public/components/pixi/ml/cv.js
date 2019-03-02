import * as PIXI from 'pixi.js';
import {pixiApp} from '../../../controllers/game/gameSetup';
import {cvTexture} from '../../../controllers/common/textures.js';

export default class {
    constructor(options) {
        this.xAnchor = options.x;
        this.yAnchor = options.y;
        this.scale = 0.4;
        this.texture = cvTexture;
        this.cv = null;
    }

    draw() {
        this.cv = new PIXI.Sprite(cvTexture);
        this.cv.scale.set(this.scale);
        this.cv.y = this.yAnchor;
        this.cv.x = this.xAnchor;
        pixiApp.stage.addChild(this.cv);
    }
}