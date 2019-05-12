
import EVENTS from '~/public/game/controllers/constants/events';
import CLASSES from '~/public/game/controllers/constants/classes';
import TextboxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import InfoTooltip from '~/public/game/components/interface/ml/info-tooltip/info-tooltip';
import EndGameOverlay from '~/public/game/components/interface/ml/endgame-overlay/endgame-overlay';

import NewsFeedUI from '~/public/game/components/interface/ml/news-feed/news-feed.js';
import MlLabAnimator from '~/public/game/controllers/game/mlLabAnimator.js';
import {waitForSeconds, clamp} from '~/public/game/controllers/common/utils';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class MlLabNarrator {
    constructor() {
        new MlLabAnimator();
        
        this.newsFeed = new NewsFeedUI({show: true});
        
        this.ML_TIMELINE = txt.mlLabStage.conversation;
        this.newsTimeOffset = 6;
        this.isActive = false;
        this.scheduleTimelineUpdate = this.scheduleTimelineUpdate.bind(this);
        this._addEventListeners();

        this.start();
    }

    start() {
        this.isActive = true;
        if (!Array.isArray(this.ML_TIMELINE)) throw new Error('The timeline needs to be an array!');
        this.scheduleTimelineUpdate();
    }

    stop() {
        this.isActive = false;
    }

    scheduleTimelineUpdate() {
        if (this.ML_TIMELINE.length === 0 || !this.isActive) return;
        if (!this.ML_TIMELINE[0].hasOwnProperty('delay')) throw new Error('The ML message object needs to have a delay!');
        if ( this.ML_TIMELINE.length === 1) this.ML_TIMELINE[0].isLastMessage = true;

        // MESSAGE FROM BOSS UPDATE
        waitForSeconds(this.ML_TIMELINE[0].delay)
            .then(() => {
                this._showNewMessage(this.ML_TIMELINE[0]);
                this.updateTimeline();
            }).catch((err) => {
                console.log(err);
            });

        // NEWS UPDATE
        if (!this.ML_TIMELINE[0].hasOwnProperty('news')) return;
        const newsLaunch = clamp(this.ML_TIMELINE[0].delay - this.newsTimeOffset, 1, 5);
        waitForSeconds(newsLaunch)
            .then(() => {
                this.newsFeed.updateNewsFeed({news: this.ML_TIMELINE[0].news});
            }).catch((err) => {
                console.log(err);
            });
    };
    
    _showNewMessage(msg) {
        if (!msg.hasOwnProperty('messageFromVc') || !msg.hasOwnProperty('responses')) throw new Error('message object does not have valid properties!');

        let callback = this.textAckCallback.bind({}, msg, this.scheduleTimelineUpdate, this.newsFeed);
        if (msg.tooltip) callback = this.showTooltipCallback.bind({}, msg, this.scheduleTimelineUpdate, this.newsFeed, callback);
        
        new TextboxUI({
            show: true,
            type: CLASSES.ML,
            content: msg.messageFromVc,
            responses: msg.responses,
            callback: callback,
        });
    }

    showTooltipCallback(msg, scheduleTimelineUpdate, newsFeed, textAckCallback) {
        new InfoTooltip(msg.tooltip, textAckCallback);
        scheduleTimelineUpdate();
        newsFeed.hide();
    }

    textAckCallback(msg, scheduleTimelineUpdate, newsFeed) {
        if (msg.isLastMessage) {
            // whenever you want to log an event in Google Analytics, just call one of these functions with appropriate names
            gtag('event', 'test-game-completed', {
                'event_category': 'default',
                'event_label': 'how-far-do-ppl-get',
            });
            new EndGameOverlay();
            return;
        } 
        scheduleTimelineUpdate();
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
