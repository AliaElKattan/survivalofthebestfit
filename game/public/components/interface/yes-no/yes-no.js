import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';
import UIBase from '../ui-base/ui-base';
import {eventEmitter, pixiApp} from '../../../controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('.js-yes-no'); // This should be a single element
        this.$yesButton = this.$el.find('.js-yes');
        this.$noButton = this.$el.find('.js-no');

        this._addEventListeners();
        
        if (options && options.show) {
            this.show();
        };
    }

    _acceptClicked(e) {
        this.$yesButton.addClass(CLASSES.ACCEPTED);
        eventEmitter.emit(EVENTS.ACCEPTED, {});
    }

    _rejectClicked(e) {
        this.$noButton.addClass(CLASSES.REJECTED);
        eventEmitter.emit(EVENTS.REJECTED, {});
    }

    _addEventListeners() {

        // eventEmitter.on('spot-empty', this.disableButtons());
        // eventEmitter.on('spot-filled', this.enableButtons());

        this.$yesButton.click(this._acceptClicked.bind(this));
        this.$noButton.click(this._rejectClicked.bind(this));

        eventEmitter.on(EVENTS.STAGE_ONE_COMPLETED, (data) => {
            this.destroy();
        });
    };
    
    _removeEventListeners() {
        this.$yesButton.off();
        this.$noButton.off();

        eventEmitter.off(EVENTS.ACCEPTED, () => {});
        eventEmitter.off(EVENTS.REJECTED, () => {});
        eventEmitter.off(EVENTS.STAGE_ONE_COMPLETED, () => {});
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    disableButtons(){
        // TODO - dynamically change?!?!
        this.$yesButton.addClass('disabled');
            this.$noButton.addClass('disabled');
    }

    enableButtons(){
        this.$yesButton.removeClass('disabled');
        this.$noButton.removeClass('disabled');
    }

    hide() {
        this.$el.removeClass(CLASSES.FADE_IN)
            .addClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.IS_INACTIVE);

        // TODO you might need a delayed call for this
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
    }
}