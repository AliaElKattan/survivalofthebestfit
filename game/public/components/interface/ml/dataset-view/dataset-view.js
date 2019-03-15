import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '../../../../controllers/constants/classes';
import EVENTS from '../../../../controllers/constants/events';
import UIBase from '../../ui-base/ui-base';
import {eventEmitter} from '../../../../controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.options = options;
        this.$el = $('#dataset-overlay');
        this.$xIcon = this.$el.find('.js-x-icon');
        this._handleIconClick = this._handleIconClick.bind(this);
        this._handleInspectButtonClick = this._handleInspectButtonClick.bind(this);
        // this.setContent = this.setContent.bind(this);
        // this._content = options ? options.content : 'dummy text'; // TODO: change this to null

        // this.setContent();
        this._addEventListeners();
        if (options && options.show) {
            this.show();
        }
    }

    setContent() {
    }

    _addEventListeners() {
        this.$xIcon.on('click', this._handleIconClick);
        eventEmitter.on(EVENTS.INSPECT_DATASET, this._handleInspectButtonClick);
    }

    _removeEventListeners() {
        this.$xIcon.off('click', this._handleIconClick);
        eventEmitter.off(EVENTS.INSPECT_DATASET, this._handleInspectButtonClick);
    }

    _handleIconClick() {
        this.hide();
    }

    _handleInspectButtonClick() {
        console.log('show the inspector panel!');
        this.$el.hasClass(CLASSES.IS_INACTIVE) ? this.show() : '';
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    hide() {
        this.$el.addClass(CLASSES.FADE_OUT);
        TweenLite.delayedCall(0.3, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE)
                .removeClass(CLASSES.FADE_IN);
        });
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.destroy();
    }
}
