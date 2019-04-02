import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';
import UIBase from '../ui-base/ui-base';
import {eventEmitter, pixiApp} from '../../../controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('.js-task-timer'); // This should be a single element
        this.$progressBar = this.$el.find('.TaskTimer__timer-progress');
        this.$taskDescription = this.$el.find('.TaskTimer__task');
        this.$counter = this.$el.find('.TaskTimer__task-progress');
        this._durationMS = options ? options.duration*1000 : undefined;
        this._runningMS = 0;
        this.timeUp = false;
        this.timer = pixiApp.ticker;
        this.hiresQuota = options.hires || undefined;
        this.hiresNum = 0;
        this._content = options.content || null;
        this.setContent = this.setContent.bind(this);
        this._addEventListeners();
        if (options && options.show) {
            this.setContent();
            this.show();
            this.startTimer();
        };
    }

    setContent() {
        this.$taskDescription.html(this._content);
        this.$counter.html(`${this.hiresNum}/${this.hiresQuota}`);
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.ACCEPTED, (data) => {
            this.hiresNum += 1;
            this.updateCounter();
        });
    };

    updateCounter() {
        this.$counter.html(`${this.hiresNum}/${this.hiresQuota}`);
    }

    updateTimer(elapsedMS) {
        this._runningMS += elapsedMS;
        if (this._runningMS < this._durationMS) {
            const progressAmt = (this._runningMS / this._durationMS)*100;
            this.$progressBar.css('width', `${progressAmt}%`);
        } else {
            this.$progressBar.css('width', '100%');
        }
    }

    startTimer() {
        if (this._durationMS === undefined) {
            throw new Error('the timer does not have a defined duration');
        } else {
            this.timer.add(() => {
                this.updateTimer(this.timer.elapsedMS);
            });
        }
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.ACCEPTED, () => {});
        eventEmitter.off(EVENTS.STAGE_ONE_COMPLETED, () => {});
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE);
    }

    hide() {
        this.$el.removeClass(CLASSES.FADE_IN)
            .addClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.IS_INACTIVE);
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
    }
}
