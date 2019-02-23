import $ from 'jquery';
import CLASSES from '../../../js/constants/classes';
import EVENTS from '../../../js/constants/events';
import UIBase from '../old-pixi-components-demise/ui-base';
import {eventEmitter} from '../../../js/shared.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('.js-task-timer'); // This should be a single element
        // this.$textEl = this.$el.find('.Timer__content');
        this.setContent = this.setContent.bind(this);
        this._content = options ? options.content : 'dummy text'; // TODO: change this to null
        this.setContent(); // set content
        if (options && options.show) {
            this.show();
        }
    }

    setContent() {
    // this.$textEl.html(this._content);
    }

    _testLog() {
        console.log('test emitter works!');
    }

    // _buttonIsClicked(e) {
    //   this.$button.addClass(CLASSES.BUTTON_CLICKED);
    //   eventEmitter.emit('instructionAcked', {});
    //   this.hide();
    // }

    // _addEventListeners() {
    //   eventEmitter.on(EVENTS.EMITTER_TEST, this._testLog());
    //   this.$button.click(this._buttonIsClicked.bind(this));
    // }
    //
    // _removeEventListeners() {
    //   eventEmitter.off(EVENTS.EMITTER_TEST, this._testLog());
    //   this.$button.off(this._buttonIsClicked.bind(this));
    // }

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
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.destroy();
    }
}
