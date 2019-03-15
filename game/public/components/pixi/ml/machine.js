import * as PIXI from 'pixi.js';
import {pixiApp} from '../../../controllers/game/gameSetup';
import {SPRITES} from '../../../controllers/common/textures.js';
import {uv2px, spacingUtils as space} from '../../../controllers/common/utils.js';
import EVENTS from '../../../controllers/constants/events.js';
import {eventEmitter} from '../../../controllers/game/gameSetup.js';


export default class {
    constructor(options) {
        this.machine = SPRITES.machine;
        this.inspectButton = SPRITES.inspectButton;
        this.scale = 0.7;

        this.machineConfig = {
            scale: this.scale,
            width: this.machine.width*this.scale,
            height: this.machine.height*this.scale,
            x: space.screenCenterX(this.machine.width*this.scale),
            y: space.screenCenterY(this.machine.height*this.scale) - uv2px(0.27, 'h'),
        };
        this.inspectButtonConfig = {
            x: space.getCenteredChildX(this.machineConfig.x, this.machine.width*this.scale, this.inspectButton.width*this.scale),
            y: space.getCenteredChildY(this.machineConfig.y, this.machine.height*this.scale, this.inspectButton.height*this.scale),
        };


        this._addEventListeners();
    }

    _addEventListeners() {
        this.inspectButton.interactive = true;
        this.inspectButton.buttonMode = true;
        this.inspectButton.on('click', this._inspectButtonClickHandler);
        // eventEmitter.on(EVENTS.RESIZE, this._resize);
    }

    _removeEventListeners() {
        this.inspectButton.off('click', this._inspectButtonClickHandler);
        // eventEmitter.off(EVENTS.RESIZE, this._resize);
    }

    draw() {
        this.machine.scale.set(this.scale);
        this.machine.y = this.machineConfig.y;
        this.machine.x = this.machineConfig.x;
        pixiApp.stage.addChild(this.machine);

        this.inspectButton.scale.set(this.scale);
        this.inspectButton.y = this.inspectButtonConfig.y;
        this.inspectButton.x = this.inspectButtonConfig.x;
        pixiApp.stage.addChild(this.inspectButton);
    }

    resize() {
    }

    getMachineConfig() {
        return this.machineConfig;
    }

    _inspectButtonClickHandler() {
        eventEmitter.emit(EVENTS.INSPECT_DATASET, {});
    }
}
