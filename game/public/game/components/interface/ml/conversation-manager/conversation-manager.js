import EVENTS from '~/public/game/controllers/constants/events';
import CLASSES from '~/public/game/controllers/constants/classes';
import TextboxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import InfoTooltip from '~/public/game/components/interface/ml/info-tooltip/info-tooltip';
import EndGameOverlay from '~/public/game/components/interface/ml/endgame-overlay/endgame-overlay';

import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

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

    _addEventListeners() {
        eventEmitter.on(EVENTS.SHOW_MESSAGE_FROM_BOSS, this._showNewMessage.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.SHOW_MESSAGE_FROM_BOSS, this._showNewMessage.bind(this));
    }

    destroy() {
    }
}
