import $ from 'jquery';
import EVENTS from '~/public/game/controllers/constants/events';
import {waitForSeconds, clamp} from '~/public/game/controllers/common/utils';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class {
    constructor(options) {
        this.ML_TIMELINE = txt.mlLabStage.conversation;
        this.newsTimeOffset = 6;
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

        // MESSAGE FROM BOSS UPDATE

        waitForSeconds(this.ML_TIMELINE[0].delay)
            .then(() => {
                eventEmitter.emit(EVENTS.SHOW_MESSAGE_FROM_BOSS, this.ML_TIMELINE[0]);
                this.updateTimeline();
            }).catch((err) => {
                console.log(err);
            });

        // NEWS UPDATE

        if (!this.ML_TIMELINE[0].hasOwnProperty('news')) return;
        const newsLaunch = clamp(this.ML_TIMELINE[0].delay - this.newsTimeOffset, 1, 5);
        waitForSeconds(newsLaunch)
            .then(() => {
                eventEmitter.emit(EVENTS.UPDATE_NEWS_FEED, {news: this.ML_TIMELINE[0].news});
            }).catch((err) => {
                console.log(err);
            });
    }

    // update schedule: pop the first timer value from the array

    updateTimeline() {
        this.ML_TIMELINE = this.ML_TIMELINE.slice(1);
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
