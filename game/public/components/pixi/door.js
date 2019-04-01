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
        this.animSpeed = 0.3;
        this.sprite = null;
    }

    addToPixi() {
        this.sprite = SPRITES[this.doorType];
        this.sprite.name = this.doorType;
        if (this.doorType === 'doorAccepted') {
            this.sprite.loop = false;
        };
        this._draw();
        mlLabStageContainer.addChild(this.sprite);
        this._addEventListeners();
    }

    playAnimation({direction}) {
        switch (direction) {
        case 'forward':
            this.sprite.animationSpeed = this.animSpeed;
            this.sprite.play();
            break;
        case 'reverse':
            this.sprite.animationSpeed = -1*this.animSpeed;
            this.sprite.play();
            break;
        default:
            throw new Error('Invalid direction setting for the animation');
        }
    }

    _draw() {
        this.sprite.scale.set(this.scale);
        this.sprite.x = this.xAnchor;
        this.sprite.y = this.yAnchor - this.sprite.height - this.floorParent.getHeight() + 5;
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
        eventEmitter.on(EVENTS.RESIZE, this._resizeHandler.bind(this));
        eventEmitter.on(EVENTS.PLAY_DOOR_ANIMATION, this.playAnimation.bind(this));
    }

    // remove event listeners

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESIZE, this._resizeHandler.bind(this));
        eventEmitter.off(EVENTS.PLAY_DOOR_ANIMATION, this.playAnimation.bind(this));
    }

    getSprite() {
        return this.sprite;
    }
}
