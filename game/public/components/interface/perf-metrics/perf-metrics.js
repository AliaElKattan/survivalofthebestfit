import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';
import UIBase from '../ui-base/ui-base';
import {eventEmitter, pixiApp} from '../../../controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('.PerfMetrics'); // This should be a single element
        this.$progressBar = this.$el.find('.PerfMetrics__progress');
        this.revenue = 33;
        this.hiresNum = 1;
        eventEmitter.on(EVENTS.ACCEPTED, this.updateHandler.bind(this));
    }

    _updateBar(revenue) {
        const randomIncrement = (Math.floor(Math.random() * 50) - 10) / this.hiresNum;
        this.revenue = revenue === undefined ? this.revenue + randomIncrement : revenue;
        this.$progressBar.css('width', `${this.revenue}%`);
        if (this.revenue < 33) {
            this.$progressBar.addClass('blinking-bar');
        } else {
            this.$progressBar.removeClass('blinking-bar');
        }
    }

    updateHandler() {
        this.hiresNum += 1;
        this._updateBar();
    }

    _removeEventListeners() {
        eventEmitter.removeListener(EVENTS.ACCEPTED, this.updateHandler.bind(this));
        eventEmitter.off(EVENTS.ACCEPTED, this.updateHandler.bind(this));
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE);
    }

    hide() {
        this.$el.addClass(CLASSES.IS_INACTIVE);
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.remove();
    }
}
