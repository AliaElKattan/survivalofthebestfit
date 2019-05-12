import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {spotlight} from '~/public/game/components/pixi/manual-stage/office';
import {eventEmitter, pixiApp} from '~/public/game/controllers/game/gameSetup.js';
import {waitForSeconds} from '~/public/game/controllers/common/utils';

export default class extends UIBase {
    constructor(options) {
        super();
        this.$id = '#js-instruction';
        this.$el = $(`${this.$id}`); // This should be a single element
        this.$textbox = this.$el.find('.Instruction');
        this.$textEl = this.$el.find('.Instruction__content');
        this._addEventListeners();
    }

    setContent(content) {
        this.$textEl.text(content);
    }

    reveal({type}) {
        switch (type) {
        case 'manual-click':
            waitForSeconds(0.5).then(() => {
                this.setContent(txt.instructions.manual.click);
                this.show();
            });
            break;
        case 'manual-eval-show':
            this.hide();
            waitForSeconds(1).then(() => {
                this.setContent(txt.instructions.manual.eval);
                this.$el.css({
                    'bottom': 'unset',
                    'top': `${spotlight.y - 200}px`,
                    'left': `${spotlight.x + 10}px`,
                });
                this.show();
            });
            break;
        case 'manual-eval-hide':
            this.hide();
            break;
        default:
            throw new Error('invalid type!');
        }
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.UPDATE_INSTRUCTIONS, this.reveal.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.UPDATE_INSTRUCTIONS, this.show.bind(this));
    }

    show() {
        TweenLite.set(`${this.$id}`, {y: 5, xPercent: -50, opacity: 0});
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to(`${this.$id}`, 0.2, {y: 0, opacity: 1, ease: Power1.easeInOut});
    }

    hide() {
        TweenLite.to(`${this.$id}`, 0.2, {y: 5, opacity: 0, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.3, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    destroy() {
        this._removeEventListeners();
        super.dispose();
        this.hide();
    }
}
