import {mlLabStageContainer} from '~/public/controllers/game/gameSetup';
import {SPRITES} from '~/public/controllers/common/textures.js';
import ANCHORS from '~/public/controllers/constants/pixi-anchors';
import EVENTS from '~/public/controllers/constants/events.js';
import SCALES from '~/public/controllers/constants/pixi-scales.js';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';
import {screenSizeDetector, uv2px, spacingUtils as space} from '~/public/controllers/common/utils.js';

export default class {
    constructor({type, floor, floorParent, xAnchor}) {
        // this.doorType = type === 'rejected' ? 'doorRejected' : 'doorAccepted';
        this.doorType = type;
        this.floorParent = floorParent;
        this.xAnchor = xAnchor;
        this.yAnchorUV = floor === 'first_floor' ? ANCHORS.FLOORS.FIRST_FLOOR.y : ANCHORS.FLOORS.GROUND_FLOOR.y;
        this.yAnchor = uv2px(this.yAnchorUV, 'h');
        this.scale = SCALES.DOOR[screenSizeDetector()];
        this.door = null;
        this._resizeHandler = this._resizeHandler.bind(this);
        this._addEventListeners();
    }

    addToPixi(parentContainer) {
        this.door = SPRITES[this.doorType];
        this.door.name = this.doorType;
        if (this.doorType === 'doorEntry') {
            console.log('animate the door!');
            this.door.loop = true;
            this.door.animationSpeed = 0.5;
        };
        this._draw();
        parentContainer.addChild(this.door);
    }

    _draw() {
        this.door.scale.set(this.scale);
        this.door.x = this.xAnchor;
        this.door.y = this.yAnchor - this.door.height - this.floorParent.getHeight() + 5;
    }

    // (re)compute draw parameter values

    _recomputeParams() {
        this.scale = SCALES.DOOR[screenSizeDetector()];
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
}
