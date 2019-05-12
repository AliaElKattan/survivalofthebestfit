import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {eventEmitter, pixiApp} from '../../../controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('.PerfMetrics'); // This should be a single element
        this.$progressBar = this.$el.find('.PerfMetrics__progress');
        this.revenue = 33;
        this.hiresNum = 1;
        eventEmitter.on(EVENTS.ACCEPTED, this._updateBar.bind(this));
    }

    _updateBar(revenue) {
        this.hiresNum += 1;
        const randomIncrement = (Math.round(Math.random() * 50) - 10) / this.hiresNum;
        this.revenue = revenue === undefined || typeof revenue === 'object' ? this.revenue + randomIncrement : revenue;
        this.$progressBar.css('width', `${this.revenue}%`);
        if (this.revenue < 33) {
            this.$progressBar.addClass('blinking-bar');
        } else {
            this.$progressBar.removeClass('blinking-bar');
        }
    }

    _removeEventListeners() {
        eventEmitter.removeListener(EVENTS.ACCEPTED, this._updateBar.bind(this));
    }

    show() {
        // this.$el.removeClass(CLASSES.IS_INACTIVE);
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
