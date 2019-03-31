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
        this._addEventListeners();
    }

    addToPixi() {
        this.draw();
        mlLabStageContainer.addChild(this.machine);
        mlLabStageContainer.addChild(this.inspectButton);
    }

    draw() {
        this.scale = SCALES.MACHINE[screenSizeDetector()];
        this.machine.scale.set(this.scale);
        this.machine.x = space.screenCenterX(this.machine.width);
        this.machine.y = space.screenCenterY(this.machine.height) - uv2px(0.27, 'h');

        this.inspectButton.scale.set(this.scale);
        this.inspectButton.x = space.getCenteredChildX(this.machine.x, this.machine.width, this.inspectButton.width);
        this.inspectButton.y = space.getCenteredChildY(this.machine.y, this.machine.height, this.inspectButton.height);
    }

    _addEventListeners() {
        this.inspectButton.interactive = true;
        this.inspectButton.buttonMode = true;
        this.inspectButton.on('click', this._inspectButtonClickHandler);
    }

    removeEventListeners() {
        this.inspectButton.off('click', this._inspectButtonClickHandler);
    }

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
