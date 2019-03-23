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
        eventEmitter.on(EVENTS.RESIZE, this.draw.bind(this));
    }

    draw() {
        this._recomputeParams();
        if (this.beltContainer) {
            // remove previous sprites
            for (let i = this.beltContainer.children.length - 1; i >= 0; i--) {
                if (this.beltContainer.children[i].type && this.beltContainer.children[i].type === 'belt') {
                    this.beltContainer.removeChild(this.beltContainer.children[i]);
                }
            }
        } else {
            this.beltContainer = new PIXI.Container();
            mlLabStageContainer.addChild(this.beltContainer);
        }

        // redraw new ones
        for (let j = 0; j<this.numOfPieces; j++) {
            const belt = new PIXI.Sprite(beltTexture);
            belt.scale.set(this.scale);
            belt.y = this.yAnchor;
            belt.x = this.xAnchor + (belt.width * j);
            belt.type = 'belt';
            this.beltContainer.addChild(belt);
        }
    }

    _recomputeParams() {
        this.scale = getScale('BELT');
        this.numOfPieces = Math.floor(uv2px(1, 'w') / (beltTexture.width * this.scale)) + 1;
    }

    // it is dangerous to not remove the event listener when destroying sprites
    destroy() {
        eventEmitter.off(EVENTS.RESIZE, this.draw.bind(this));

        for (let i = this.beltContainer.children.length - 1; i >= 0; i--) {
            if (this.beltContainer.children[i].type && this.beltContainer.children[i].type === 'belt') {
                this.beltContainer.removeChild(this.beltContainer.children[i]);
            }
        }
    }
};
