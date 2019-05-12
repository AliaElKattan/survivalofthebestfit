import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {eventEmitter, pixiApp} from '~/public/game/controllers/game/gameSetup.js';
import {spotlight} from '~/public/game/components/pixi/manual-stage/office';

export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('#js-task-timer');
        this.$hireGoalEl = this.$el.find('.js-hiring-goal');
        this.$timer = this.$el.find('.js-timer');
        this._duration = options.duration || undefined;
        this._elapsedTime = 0;
        this._runningMS = 0;
        this.timer = pixiApp.ticker;
        this.hiresQuota = options.hires || undefined;
        this.hiresNum = 0;
        this._content = options.content || null;

        this.setContent();
        this.show();

        if (options.showTimer) {
            this.$timer.removeClass(CLASSES.IS_INACTIVE);
            this.startTimer();
        }

        this._addEventListeners();
    }

    setContent() {
        this.updateCounter();
        this.writeTime();
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.ACCEPTED, () => {
            this.hiresNum += 1;
            this.updateCounter();
        });
    };

    updateCounter() {
        const peopleToHire = this.hiresQuota - this.hiresNum;
        const hireText = peopleToHire === 1 ? `${peopleToHire} person` : `${peopleToHire} people`;
        this.$hireGoalEl.find('.TaskTimer-value').text(hireText);
    }

    writeTime() {
        const timeLeft = this._duration-this._elapsedTime;
        const minutesLeft = `0${Math.floor(timeLeft/60)}`;
        const secondsLeft = timeLeft%60 < 10 ? `0${timeLeft%60}` : timeLeft%60;
        this.$timer.find('.TaskTimer-value').text(`${minutesLeft}:${secondsLeft}`);
    }

    updateTimer(elapsedMS) {
        this._runningMS += elapsedMS;
        if (this._runningMS <= this._duration * 1000) {
            if (Math.floor(this._runningMS/1000) > this._elapsedTime) {
                this._elapsedTime++;
                this.writeTime();
            }
        } 
        else if (this._runningMS > this._duration * 1000) {
            this._elapsedTime = this._duration;
            this.writeTime();
            this.timer.stop();
            eventEmitter.emit(EVENTS.STAGE_INCOMPLETE, {});
        }
    }

    startTimer() {
        if (this._duration === undefined) {
            throw new Error('the timer does not have a defined duration');
        } 
        else {
            this.timer.add(() => {
                this.updateTimer(this.timer.elapsedMS);
            });
        }
    }

    reset() {
        this.timer.stop();
        this._duration = undefined;
        this._elapsedTime = 0;
        this._runningMS = 0;
        this.timer.start();
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.ACCEPTED, () => {});
    }

    show() {
        this.$el.css({
            'left': `${spotlight.x}px`,
        });
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
