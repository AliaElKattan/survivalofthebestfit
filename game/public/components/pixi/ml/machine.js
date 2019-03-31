import {mlLabStageContainer} from '~/public/controllers/game/gameSetup';
import {SPRITES} from '~/public/controllers/common/textures.js';
import {screenSizeDetector, uv2px, spacingUtils as space} from '~/public/controllers/common/utils.js';
import EVENTS from '~/public/controllers/constants/events.js';
import SCALES from '~/public/controllers/constants/pixi-scales.js';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';


export default class {
    constructor(options) {
        this.machine = SPRITES.machine;
        this.machine.name = 'machine';
        this.inspectButton = SPRITES.inspectButton;
        this.scale = SCALES.MACHINE[screenSizeDetector()];
        this._resizeHandler = this._resizeHandler.bind(this);
        this._addEventListeners();
    }

    // add element to pixi container

    addToPixi() {
        this._draw();
        mlLabStageContainer.addChild(this.machine);
        mlLabStageContainer.addChild(this.inspectButton);
        
        

        // const msg = new PIXI.Text(
        //     'Hello',
        //     {
        //         fontFamily: 'VT323',
        //         fontHeight: '10 px',
        //         // strokeThickness: 5,
        //     }
        // );
        // msg.resolution = 2;
        // msg.x = this.machine.x + 50;
        // msg.y = this.machine.y;

        // mlLabStageContainer.addChild(msg);
    }

    // draw based on current dimensions

    _draw() {
        this.machine.scale.set(this.scale);
        this.machine.x = space.screenCenterX(this.machine.width);
        this.machine.y = space.screenCenterY(this.machine.height) - uv2px(0.27, 'h');

        this.inspectButton.scale.set(this.scale);
        this.inspectButton.x = space.getCenteredChildX(this.machine.x, this.machine.width, this.inspectButton.width);
        this.inspectButton.y = space.getCenteredChildY(this.machine.y, this.machine.height, this.inspectButton.height);
    }

    // (re)compute draw parameter values

    _recomputeParams() {
        this.scale = SCALES.MACHINE[screenSizeDetector()];
    }

    // resize function

    _resizeHandler() {
        this._recomputeParams();
        this._draw();
    }

    // add event listeners

    _addEventListeners() {
        this.inspectButton.interactive = true;
        this.inspectButton.buttonMode = true;
        this.inspectButton.on('click', this._inspectButtonClickHandler);
        eventEmitter.on(EVENTS.RESIZE, this._resizeHandler);
    }

    // remove event listeners

    _removeEventListeners() {
        this.inspectButton.off('click', this._inspectButtonClickHandler);
        eventEmitter.off(EVENTS.RESIZE, this._resizeHandler);
    }

    // click handler

    _inspectButtonClickHandler() {
        eventEmitter.emit(EVENTS.DATASET_VIEW_INSPECT, {});
    }

    // util function to pass machine dimensions to data server/scan ray

    getMachineDimensions() {
        return {
            scale: this.scale,
            width: this.machine.width,
            height: this.machine.height,
            x: space.screenCenterX(this.machine.width),
            y: space.screenCenterY(this.machine.height) - uv2px(0.27, 'h'),
        };
    }
}
