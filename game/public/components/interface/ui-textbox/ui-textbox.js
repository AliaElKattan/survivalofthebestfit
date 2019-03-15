import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';

import UIBase from '../ui-base/ui-base';
import {eventEmitter} from '../../../controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.options = options;
        this.$el = $('.js-textbox'); // This should be a single element
        this.$textEl = this.$el.find('.Textbox__content');
        this.$buttons = this.$el.find('.TextboxButton');
        console.log(this.$buttons);
        this._addEventListeners();
        this.setContent = this.setContent.bind(this);
        this._mainContent = options.content || 'dummy text'; // TODO: change this to null
        this._responseContent = options.responses || ['OKK'];
        this.overlay = options.overlay || null; // TODO think about the overlay
        if (options.show) this.show();
        this.setContent(); // set content
    }

    setContent() {
        this.$textEl.html(this._mainContent);
        this._responseContent.forEach((response, index) => {
            const $responseButton = $(this.$buttons[index]);
            $responseButton.removeClass(CLASSES.IS_INACTIVE);
            $responseButton.find('.button__text').html(response);
        });
    }

    _buttonIsClicked(e) {
        this.$buttons.addClass(CLASSES.BUTTON_CLICKED);
        eventEmitter.emit('instructionAcked', {});
        this.destroy();
    }

    _addEventListeners() {
        this.$buttons.click(this._buttonIsClicked.bind(this));
    }

    _removeEventListeners() {
        // event listeners need to be removed explicitly because they are managed globally Jquery
        this.$buttons.off();
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
        // this.$el.destroy();
    }
}
