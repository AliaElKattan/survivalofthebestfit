import $ from 'jquery';
import EVENTS from '~/public/controllers/constants/events';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';

export default class {
    constructor(options) {
        this.timelineSchedule = [
            2,
            3,
            6,
        ];
        this.isActive = true;
        this.scheduleNewsUpdate = this.scheduleNewsUpdate.bind(this);
        this._addEventListeners();
    }

    // launch timeline: once it starts it runs on its own

    start() {
        this.scheduleNewsUpdate();
    }

    // stop timeline: the next news update will not fire

    stop() {
        this.isActive = false;
    }

    // schedule a news update

    scheduleNewsUpdate() {
        if (this.timelineSchedule.length === 0 || !this.isActive) return;

        this.waitForSeconds(this.timelineSchedule[0])
            .then(() => {
                this.updateSchedule();
                eventEmitter.emit(EVENTS.UPDATE_NEWS_FEED, {});
                return this.waitForSeconds(2);
            })
            .then(() => {
                eventEmitter.emit(EVENTS.SHOW_MESSAGE_FROM_BOSS, {});
            }).catch((err) => {
                console.log(err);
            });
    }

    // update schedule: pop the first timer value from the array

    updateSchedule() {
        this.timelineSchedule = this.timelineSchedule.slice(1);
    }

    // create a new countdown timer

    waitForSeconds(duration) {
        const durationInMS = duration*1000;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, durationInMS);
        });
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESUME_NEWS_TIMELINE, this.scheduleNewsUpdate);
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESUME_NEWS_TIMELINE, this.scheduleNewsUpdate);
    }

    destroy() {
    }
}
