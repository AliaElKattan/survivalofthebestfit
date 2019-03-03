import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';

import UIBase from '../old-pixi-components-demise/ui-base';
import {eventEmitter} from '../../../controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.options = options;
        this.$el = $('.js-instruction'); // This should be a single element
        this.$textEl = this.$el.find('.Instruction__content');
        this.$button = this.$el.find('.button');
        this._addEventListeners();
        this.setContent = this.setContent.bind(this);
        this._content = options ? options.content : 'dummy text'; // TODO: change this to null
        this.overlay = options ? options.overlay : null; // TODO think about the overlay
        this.setContent(); // set content
        if (options && options.show) {
            this.show();
        }
    }

    setContent() {
        // console.log('set content!');
        this.$textEl.html(this._content);
    }

    _buttonIsClicked(e) {
        this.$button.addClass(CLASSES.BUTTON_CLICKED);
        eventEmitter.emit('instructionAcked', {});
        this.destroy();
    }

    _addEventListeners() {
        this.$button.click(this._buttonIsClicked.bind(this));
    }

    _removeEventListeners() {
        this.$button.off();
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    hide() {
        this.$el.removeClass(CLASSES.FADE_IN)
            .addClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.IS_INACTIVE);

        // TODO you might need a delayed call for this
    }

    destroy() {
        this._removeEventListeners();
        super.dispose();
        this.hide();
        this.$el.destroy();
    }
}
