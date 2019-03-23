import * as PIXI from 'pixi.js';
import {mlLabStageContainer} from '../../../controllers/game/gameSetup';
import {getScale, uv2px} from '../../../controllers/common/utils.js';
import {beltTexture} from '../../../controllers/common/textures.js';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';
import EVENTS from '~/public/controllers/constants/events.js';

export default class {
    constructor(options) {
        this.texture = beltTexture;
        this.yAnchor = options.y;
        this.xAnchor = 0;
        this._addEventListeners();
    }

    _draw() {
        this._recomputeParams();
        // remove previous sprites
        for (let i = mlLabStageContainer.children.length - 1; i >= 0; i--) {
            if (mlLabStageContainer.children[i].type && mlLabStageContainer.children[i].type === 'belt') {
                mlLabStageContainer.removeChild(mlLabStageContainer.children[i]);
            }
        }
        // redraw new ones
        for (let j = 0; j<this.numOfPieces; j++) {
            const belt = new PIXI.Sprite(beltTexture);
            belt.scale.set(this.scale);
            belt.y = this.yAnchor;
            belt.x = this.xAnchor + (belt.width * j);
            belt.type = 'belt';
            mlLabStageContainer.addChild(belt);
        }
    }

    _recomputeParams() {
        this.scale = getScale('BELT');
        this.numOfPieces = Math.floor(uv2px(1, 'w') / (beltTexture.width * this.scale)) + 1;
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESIZE, this._draw.bind(this));
    }

    _destroy() {
        eventEmitter.off(EVENTS.RESIZE, this._draw);
    }
};
