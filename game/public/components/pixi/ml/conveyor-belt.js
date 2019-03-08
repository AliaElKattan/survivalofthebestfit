import * as PIXI from 'pixi.js';
import {pixiApp} from '../../../controllers/game/gameSetup';
import {uv2px} from '../../../controllers/common/utils.js';
import {beltTexture} from '../../../controllers/common/textures.js';


export default class {
    constructor(options) {
        this.xAnchor = 0;
        this.yAnchor = options.y;
        this.xOffset = uv2px(0.141, 'w');
        this.numOfPieces = Math.floor(1/0.165)+1;
        this.scale = 0.4;
        this.texture = beltTexture;
    }

    draw() {
        for (let j = 0; j<this.numOfPieces; j++) {
            const belt = new PIXI.Sprite(beltTexture);
            belt.scale.set(this.scale);
            belt.y = this.yAnchor;
            belt.x = this.xAnchor + (this.xOffset* j);
            pixiApp.stage.addChild(belt);
        }
    }
};
