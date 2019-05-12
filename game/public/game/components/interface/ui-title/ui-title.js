import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';

import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.options = options;
        this.isAtSecondStage = false;
        this.$el = $('.js-titlepage'); // This should be a single element
        this.$headerEl = this.$el.find('.Titlepage__header');
        this.$textEl = this.$el.find('.Titlepage__content');
        this.$buttons = this.$el.find('.TextboxButton');
        this._addEventListeners();
        this.setContent = this.setContent.bind(this);
        this._headerText = options.headerText;
        this._mainContent = options.content; // TODO: change this to null
        this._responseContent = options.responses || ['OK'];
        if (options.show) this.show();
        this.setContent(); // set content
    }

    setContent() {
        this.$headerEl.html(this._headerText);
        this.$textEl.html(this._mainContent);
        this._responseContent.forEach((response, index) => {
            const $responseButton = $(this.$buttons[index]);
            $responseButton.removeClass(CLASSES.IS_INACTIVE);
            $responseButton.find('.button__text').html(response);
        });
    }

    updateContent(options) {
        this.show();
        this.$headerEl.html(options.headerText);
        this.$textEl.html(options.content);
        options.responses.forEach((response, index) => {
            const $responseButton = $(this.$buttons[index]);
            $responseButton.removeClass(CLASSES.IS_INACTIVE);
            $responseButton.find('.button__text').html(response);
        });
    }

    _buttonIsClicked(e) {
        //TODO how to handle start button clicked vs share
        this.$buttons.addClass(CLASSES.BUTTON_CLICKED);
        if (!this.isAtSecondStage) {
            eventEmitter.emit('first-start-button-clicked', {});
            this.isAtSecondStage = true;
            //this.hide();
        }
        else {
            eventEmitter.emit('second-start-button-clicked', {});
            this.destroy();
        }
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
