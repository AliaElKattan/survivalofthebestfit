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
        this._addEventListeners();
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

    _addEventListeners() {
        eventEmitter.on(EVENTS.ACCEPTED, (data) => {
            this.hiresNum += 1;
            this._updateBar();
        });

        eventEmitter.on(EVENTS.STAGE_ONE_COMPLETED, (data) => {
            this.destroy();
        });
    };

    _removeEventListeners() {
        eventEmitter.off(EVENTS.ACCEPTED, () => {});
        eventEmitter.off(EVENTS.STAGE_ONE_COMPLETED, () => {});
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
