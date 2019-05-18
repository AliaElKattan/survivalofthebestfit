import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {mlLabStageContainer} from '~/public/game/controllers/game/gameSetup';

export default class extends UIBase {
    constructor({text, parent}, callback) {
        super();
        this.$el = $('#js-tooltip');
        this.$icon = this.$el.find('.Tooltip-icon');
        this.$tooltip = this.$el.find('.Tooltip-box');
        this.$text = this.$el.find('.Tooltip-box__text');
        this.$dismissBtn = this.$el.find('.Tooltip-box__button');

        this.parent = parent;
        this.content = text;
        this.isActive = false;
        this.callback = callback;

        this._handleIconHover = this._handleIconHover.bind(this);
        this._setContent();
        this._addEventListeners();
        this.show();
    }

    _setContent() {
        const {x, y} = mlLabStageContainer.getChildByName(this.parent).getGlobalPosition();
        this.$el.css({
            'top': `${y}px`,
            'left': `${x}px`,
        });
        if (!this.$icon.hasClass(CLASSES.PULSATE)) this.$icon.addClass(CLASSES.PULSATE);
        this.$text.html(this.content);
        this.$tooltip.addClass(CLASSES.IS_INACTIVE);
    }

    _handleIconHover() {
        if (!this.isActive) {
            this.isActive = true;
            this.$icon.removeClass(CLASSES.PULSATE);
            eventEmitter.emit(EVENTS.RESUME_TIMELINE, {});
        };
    }

    _expandTooltip() {
        this.isActive = true;
        this.$icon.addClass(CLASSES.IS_INACTIVE);
        this.$tooltip.removeClass(CLASSES.IS_INACTIVE);
    }

    _dismissTooltip() {
        this.callback();
        this.destroy();
    }

    _addEventListeners() {
        this.$el.on('click', this._expandTooltip.bind(this));
        this.$dismissBtn.on('click', this._dismissTooltip.bind(this));
    }

    _removeEventListeners() {
        this.$el.off();
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE);
    }

    hide() {
        this.$el.addClass(CLASSES.IS_INACTIVE);
    }

    destroy() {
        this._removeEventListeners();
        super.dispose();
        this.hide();
    }
}
