import $ from 'jquery';
import EVENTS from '~/public/controllers/constants/events';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';

export default class {
    constructor(options) {
        this.ML_TIMELINE = txt.mlLabStage.conversation;
        this.isActive = false;
        this.scheduleTimelineUpdate = this.scheduleTimelineUpdate.bind(this);
        this._addEventListeners();
    }

    // launch timeline: once it starts it runs on its own

    start() {
        this.isActive = true;
        if (!Array.isArray(this.ML_TIMELINE)) throw new Error('The timeline needs to be an array!');
        this.scheduleTimelineUpdate();
    }

    // stop timeline: the next news update will not fire

    stop() {
        this.isActive = false;
    }

    // schedule a news update

    scheduleTimelineUpdate() {
        if (this.ML_TIMELINE.length === 0 || !this.isActive) return;
        if (!this.ML_TIMELINE[0].hasOwnProperty('delay')) throw new Error('The ML message object needs to have a delay!');
        if ( this.ML_TIMELINE.length === 1) this.ML_TIMELINE[0].isLastMessage = true;

        this.waitForSeconds(this.ML_TIMELINE[0].delay)
            .then(() => {
                eventEmitter.emit(EVENTS.SHOW_MESSAGE_FROM_BOSS, this.ML_TIMELINE[0]);
                this.updateTimeline();
            }).catch((err) => {
                console.log(err);
            });
    }

    // update schedule: pop the first timer value from the array

    updateTimeline() {
        this.ML_TIMELINE = this.ML_TIMELINE.slice(1);
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
        eventEmitter.on(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
    }

    destroy() {
    }
}
