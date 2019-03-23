import * as PIXI from 'pixi.js';
import {mlLabStageContainer} from '~/public/controllers/game/gameSetup.js';
import {uv2px, clamp} from '~/public/controllers/common/utils.js';
import COLORS from '~/public/controllers/constants/pixi-colors.js';
import ANCHORS from '~/public/controllers/constants/pixi-anchors';
import EVENTS from '~/public/controllers/constants/events.js';
// import SCALES from '~/public/controllers/constants/pixi-scales.js';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';

export default class {
    constructor({type}) {
        this.heightMain = clamp(uv2px(0.1, 'w'), 40, 50);
        this.heightShadow = clamp(this.heightMain/5, 20, 30);
        this.yAnchorUV = type === 'ground_floor' ? ANCHORS.FLOORS.GROUND_FLOOR.y : ANCHORS.FLOORS.FIRST_FLOOR.y;
        this.yAnchor = uv2px(this.yAnchorUV, 'h');
        this.surface = null;
        this.side = null;
        this._resizeHandler = this._resizeHandler.bind(this);
        this._addEventListeners();
    }

    addToPixi() {
        this._initParams();
        this._draw();
        mlLabStageContainer.addChild(this.surface);
        mlLabStageContainer.addChild(this.side);
    }

    _initParams() {
        // main floor
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(COLORS.ROSE_MAIN);
        this.surface.drawRect(0, 0, uv2px(1, 'w'), this.heightMain);
        this.surface.endFill();
        // dark pink shadow
        this.side = new PIXI.Graphics();
        this.side.beginFill(COLORS.ROSE_SHADOW);
        this.side.drawRect(0, 0, uv2px(1, 'w'), this.heightShadow);
        this.side.endFill();
    }

    _draw() {
        this.surface.x = 0;
        this.surface.y = this.yAnchor-this.heightMain;

        this.side.x = 0;
        this.side.y = this.yAnchor;
    }

    // (re)compute draw parameter values

    _recomputeParams() {
        this.yAnchor = uv2px(this.yAnchorUV, 'h');
    }

    // resize function

    _resizeHandler() {
        this._recomputeParams();
        this._draw();
    }

    // add event listeners

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESIZE, this._resizeHandler);
    }

    // remove event listeners

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESIZE, this._resizeHandler);
    }

    getHeight() {
        return this.heightMain;
    }
}
