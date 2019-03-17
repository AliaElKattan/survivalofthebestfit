import {mlLabStageContainer} from '../../../controllers/game/gameSetup.js';
import {screenSizeDetector, spacingUtils as space} from '../../../controllers/common/utils.js';
import {SPRITES} from '../../../controllers/common/textures.js';
import EVENTS from '../../../controllers/constants/events.js';
import SCALES from '../../../controllers/constants/pixi-scales.js';
import {eventEmitter} from '../../../controllers/game/gameSetup.js';

export default class {
    constructor({machine, side}) {
        this.dataServer = side === 'left' ? SPRITES.dataServerRejected : SPRITES.dataServerAccepted;
        this.dataServerScale = SCALES.DATA_SERVER[screenSizeDetector()];
        this.directionVector = side === 'left' ? -1 : 1;
        this.machine = machine;
        this.machineDim = undefined;
        this.centerX = undefined;
        this.serverConfig = undefined;

        this._resizeHandler = this._resizeHandler.bind(this);
        this._addEventListeners();
    }

    // initialization function

    addToPixi() {
        this._initParams();
        this._draw();
        mlLabStageContainer.addChild(this.dataServer);
    }

    // sprite parameter, set once

    _initParams() {
        this.dataServer.loop = false;
        this.dataServer.animationSpeed = 0.17;
        this.dataServer.gotoAndStop(0);
        this.machineDim = this.machine.getMachineDimensions();
        this.centerX = space.getCenteredChildX(this.machineDim.x, this.machineDim.width, this.dataServer.width*this.dataServerScale);
    }

    // sprite parameters (re)computed on canvas resizing

    _recomputeParams() {
        this.dataServerScale = SCALES.DATA_SERVER[screenSizeDetector()];
        this.machineDim = this.machine.getMachineDimensions();
        this.centerX = space.getCenteredChildX(this.machineDim.x, this.machineDim.width, this.dataServer.width);
    }

    // draw based on dimension parameters

    _draw() {
        this.dataServer.scale.set(this.dataServerScale);
        this.dataServer.x = this.centerX + this.directionVector*1.6*this.dataServer.width;
        this.dataServer.y = this.machineDim.y - 10;
    }

    // add event listeners

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESIZE, this._resizeHandler);
    }

    // resize event handler

    _resizeHandler() {
        this._recomputeParams();
        this._draw();
    }

    getSprite() {
        return this.dataServer;
    }
}
