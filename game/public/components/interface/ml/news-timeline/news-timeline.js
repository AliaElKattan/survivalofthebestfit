import $ from 'jquery';
import CLASSES from '../../../../controllers/constants/classes';
import EVENTS from '../../../../controllers/constants/events';
import {eventEmitter} from '../../../../controllers/game/gameSetup.js';

export default class {
    constructor(options) {
        this.timelineSchedule = [
            2,
            7,
            6,
        ];
        this.isActive = true;
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
        console.log(this.timelineSchedule);

        this.waitForSeconds(this.timelineSchedule[0])
            .then(() => {
                this.updateSchedule();
                this.timelineSchedule.length === 0 ? console.log(`news update! next news in: ${this.timelineSchedule[0]} seconds`) : console.log('we are done with the news updates!');
                eventEmitter.emit(EVENTS.UPDATE_NEWS_FEED, {});
                this.scheduleNewsUpdate(); // do it again
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

    // add event listeners

    _addEventListeners() {

    }

    // remove event listeners

    _removeEventListeners() {

    }

    // destroy the instance

    destroy() {
    }
}
