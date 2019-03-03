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
        this.scanRay = SPRITES.scanRay;
        this.machineAnchors = {
            x: space.screenCenterX(this.machine.width*this.scale),
            y: space.screenCenterY(this.machine.height*this.scale) - uv2px(0.27, 'h'),
        };
        this.scanRayAnchors = {
            x: space.getCenteredChildX(this.machineAnchors.x, this.machine.width*this.scale, this.scanRay.width*this.scale),
            y: this.machineAnchors.y + this.machine.height*this.scale,
        };
        this.inspectButtonAnchors = {
            x: space.getCenteredChildX(this.machineAnchors.x, this.machine.width*this.scale, this.inspectButton.width*this.scale),
            y: space.getCenteredChildY(this.machineAnchors.y, this.machine.height*this.scale, this.inspectButton.height*this.scale),
        };
        this._setup();
    }

    _setup() {
        // inspect button click
        this.inspectButton.interactive = true;
        this.inspectButton.buttonMode = true;
        this.inspectButton.on('click', this._inspectButtonClickHandler);
    }

    draw() {
        this.machine.scale.set(this.scale);
        this.machine.y = this.machineAnchors.y;
        this.machine.x = this.machineAnchors.x;
        pixiApp.stage.addChild(this.machine);

        this.scanRay.scale.set(this.scale);
        this.scanRay.y = this.scanRayAnchors.y;
        this.scanRay.x = this.scanRayAnchors.x;
        pixiApp.stage.addChild(this.scanRay);


        this.inspectButton.scale.set(this.scale);
        this.inspectButton.y = this.inspectButtonAnchors.y;
        this.inspectButton.x = this.inspectButtonAnchors.x;
        pixiApp.stage.addChild(this.inspectButton);
    }

    _inspectButtonClickHandler() {
        eventEmitter.emit(EVENTS.INSPECT_ALGORITHM, {});
    }
}
