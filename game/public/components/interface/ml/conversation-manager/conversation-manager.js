import $ from 'jquery';
import EVENTS from '~/public/controllers/constants/events';
import CLASSES from '~/public/controllers/constants/classes';
import TextboxUI from '~/public/components/interface/ui-textbox/ui-textbox';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';

export default class {
    constructor(options) {
        this.messages = [
            'this is message 1',
            'this is message 2',
            'this is message 3',
        ];

        this._addEventListeners();
    }

    _showNewMessage() {
        console.log('show the new message from boss!');
        new TextboxUI({
            show: true,
            type: CLASSES.ML,
            content: this.messages[0],
            responses: ['yes', 'no'],
        });
        this._updateMessageDeck();
    }

    _updateMessageDeck() {
        this.messages = this.messages.slice(1);
    }

    // add event listeners

    _addEventListeners() {
        eventEmitter.on(EVENTS.SHOW_MESSAGE_FROM_BOSS, this._showNewMessage.bind(this));
    }

    // remove event listeners

    _removeEventListeners() {
        eventEmitter.off(EVENTS.SHOW_MESSAGE_FROM_BOSS, this._showNewMessage.bind(this));
    }

    // destroy the instance

    destroy() {
    }
}
