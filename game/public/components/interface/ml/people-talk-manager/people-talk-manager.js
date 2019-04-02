// import $ from 'jquery';
import EVENTS from '~/public/controllers/constants/events';
import PersonTooltip from '~/public/components/interface/ml/person-tooltip/person-tooltip';
import {clamp} from '~/public/controllers/common/utils';
import {ticker} from '~/public/controllers/game/gameSetup.js';

export default class {
    constructor({parent}) {
        this.peopleContainer = parent;
        // this.messages = content;
        this.isActive = false;
        this.elapsedTime = 0;
        this.nextTimeUpdate = 3000;
        this._addEventListeners();
        this.personTooltip = new PersonTooltip();
        this.startTimeline();
        // TODO change this to a more robust setup
        this.messages = [
            'Hire me!',
            'I\'m the best',
            'Help me support my family!',
            'I\'m an expert!',
            'Help me pay off debts!',
            'I need this!',
            'Choose me!',
            'I\'m a nice person!',
        ];
    }

    // launch timeline: once it starts it runs on its own

    startTimeline() {
        console.log('the length of the person container is:' + this.peopleContainer.children.length);
        ticker.add(this.tickerHandler.bind(this));
        ticker.start();
    }

    stopTimeline() {
        ticker.stop();
        ticker.remove(this.tickerHandler.bind(this));
    }

    tickerHandler() {
        this.elapsedTime += ticker.elapsedMS;
        if (this.elapsedTime > this.nextTimeUpdate) {
            this.createTooltip();
            this.elapsedTime = 0;
            this.nextTimeUpdate = (Math.floor(Math.random()*8)+1)*1000;
        };
    }

    createTooltip() {
        const childIndex = Math.floor(Math.random()*this.peopleContainer.children.length);
        const message = this.messages[Math.floor(Math.random()*this.messages.length)];
        this.personTooltip.showNewTooltip({
            parentContainer: this.peopleContainer,
            index: childIndex,
            message: message,
        });
    }

    // stop timeline: the next news update will not fire

    stop() {
        this.isActive = false;
    }

    // schedule a news update

    scheduleTimelineUpdate() {
    }

    _addEventListeners() {
        // eventEmitter.on(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
    }

    _removeEventListeners() {
        // eventEmitter.off(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
    }

    destroy() {
    }
}
