import * as PIXI from 'pixi.js';
import {mlLabStageContainer} from '../../../controllers/game/gameSetup';
import {cvTexture} from '../../../controllers/common/textures.js';

export default class {
    constructor(options) {
        this.xAnchor = options.x;
        this.yAnchor = options.y;
        this.scale = options.scale;
        this.parent = options.parent;
        this.draw();
    }

    draw() {
        this.resume = new PIXI.Sprite(cvTexture);
        this.resume.scale.set(this.scale);
        this.resume.y = this.yAnchor;
        this.resume.x = this.xAnchor;
        this.resume.type = 'resume-on-belt';
        this.parent.addChild(this.resume);
    }

    destroy() {
        this.parent.removeChild(this.resume);
    }
}
