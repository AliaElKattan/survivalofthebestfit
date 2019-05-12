// import $ from 'jquery';
import EVENTS from '~/public/game/controllers/constants/events';
import PersonTooltip from '~/public/game/components/interface/ml/person-tooltip/person-tooltip';
import {clamp} from '~/public/game/controllers/common/utils';
import {ticker} from '~/public/game/controllers/game/gameSetup.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class {
    constructor({parent, stage}) {
        this.peopleContainer = parent;
        this.stage = stage;
        this.elapsedTime = 0;
        this.nextTimeUpdate = 3000;
        this.personTooltip = new PersonTooltip();
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
        if (this.stage === 'ml') this._addEventListeners();
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
        const maxIndex = this.stage === 'ml' ? clamp(this.peopleContainer.children.length, 0, 8) : this.peopleContainer.children.length;
        const childIndex = Math.floor(Math.random()*maxIndex);
        const message = this.messages[Math.floor(Math.random()*this.messages.length)];
        // console.log('show tooltip on child with index number: ', childIndex);
        this.personTooltip.showNewTooltip({
            parentContainer: this.peopleContainer,
            index: childIndex,
            message: message,
        });
    }

    _addEventListeners() {
        console.log('people talk manager is listening to events!');
        eventEmitter.on(EVENTS.MAKE_ML_PEOPLE_TALK, this.createTooltip.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.MAKE_ML_PEOPLE_TALK, this.createTooltip.bind(this));
    }


    destroy() {
        this.stopTimeline();
        this.personTooltip.destroy();
        this._removeEventListeners();
    }
}
