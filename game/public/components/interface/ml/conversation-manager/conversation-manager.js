import $ from 'jquery';
import EVENTS from '~/public/controllers/constants/events';
import CLASSES from '~/public/controllers/constants/classes';
import TextboxUI from '~/public/components/interface/ui-textbox/ui-textbox';
import InfoTooltip from '~/public/components/interface/ml/info-tooltip/info-tooltip';
import EndGameOverlay from '~/public/components/interface/ml/endgame-overlay/endgame-overlay';

import {eventEmitter} from '~/public/controllers/game/gameSetup.js';

export default class {
    constructor(options) {
        this.tooltip = null;
        this._addEventListeners();
    }

    _showNewMessage(msg) {
        if (!msg.hasOwnProperty('messageFromVc') || !msg.hasOwnProperty('responses')) throw new Error('message object does not have valid properties!');

        // clear tooltip if one exists
        if (this.tooltip) {
            this.tooltip.destroy();
            delete this.tooltip;
        }

        // if we have a last
        if (msg.hasOwnProperty('isLastMessage')) {
            console.log('LAST MESSAGE!');
            new EndGameOverlay();
        };

        // show new textbox
        new TextboxUI({
            show: true,
            type: CLASSES.ML,
            content: msg.messageFromVc,
            responses: msg.responses,
            hasTooltip: msg.hasOwnProperty('tooltip'),
            isLastMessage: msg.hasOwnProperty('isLastMessage'),
        });

        // if there is a tooltip linked to the message object, set up the tooltip object
        if (msg.tooltip) {
            this.tooltip = new InfoTooltip(msg.tooltip);
        }
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
