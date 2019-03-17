import {mlLabStageContainer} from '../../../controllers/game/gameSetup.js';
import {spacingUtils as space} from '../../../controllers/common/utils.js';
import {SPRITES} from '../../../controllers/common/textures.js';
import EVENTS from '../../../controllers/constants/events.js';
import {eventEmitter} from '../../../controllers/game/gameSetup.js';

export default class {
    constructor({machine}) {
        this.scanRay = SPRITES.rayAnim;
        this.machineContainer = machine;
        this.machineDim = undefined;
        this._resizeHandler = this._resizeHandler.bind(this);
        this._addEventListeners();
    }

    addToPixi() {
        this._initParams();
        this._computeParams();
        this._draw();
        mlLabStageContainer.addChild(this.scanRay);
    }

    _draw() {
        this.scanRay.scale.set(this.machineDim.scale);
        this.scanRay.x = space.getCenteredChildX(this.machineDim.x, this.machineDim.width, this.scanRay.width);
        this.scanRay.y = this.machineDim.y + this.machineDim.height;
    }

    _initParams() {
        this.scanRay.loop = false;
        this.scanRay.animationSpeed = 0.5;
        this.scanRay.gotoAndStop(0);
        this.scanRay.visible = false;
    }

    _computeParams() {
        this.machineDim = this.machineContainer.getMachineDimensions();
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESIZE, this._resizeHandler);
    }

    _resizeHandler() {
        this._computeParams();
        this._draw();
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

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESIZE, this._resizeHandler);
    }

    destroy() {
        this._removeEventListeners();
    }
}
