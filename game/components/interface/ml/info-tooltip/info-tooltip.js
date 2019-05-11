import $ from 'jquery';
import CLASSES from '~/public/controllers/constants/classes';
import EVENTS from '~/public/controllers/constants/events';
import UIBase from '~/public/components/interface/ui-base/ui-base';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';
import {mlLabStageContainer} from '~/public/controllers/game/gameSetup';

export default class extends UIBase {
    constructor({text, parent}) {
        super();
        this.$el = $('#js-tooltip');
        this.$icon = this.$el.find('.Tooltip-icon');
        this.$text = this.$el.find('.Tooltip-text');
        this.parent = parent;
        this.content = text;
        this.isActive = false;
        this._handleIconHover = this._handleIconHover.bind(this);
        this._setContent();
        this._addEventListeners();
    }

    _setContent() {
        const {x, y} = mlLabStageContainer.getChildByName(this.parent).getGlobalPosition();
        this.$el.css({
            'top': `${y}px`,
            'left': `${x}px`,
        });
        if (!this.$icon.hasClass(CLASSES.PULSATE)) this.$icon.addClass(CLASSES.PULSATE);
        this.$text.html(this.content);
        this.$text.addClass(CLASSES.IS_INACTIVE);
    }

    _handleIconHover() {
        if (!this.isActive) {
            this.isActive = true;
            this.$icon.removeClass(CLASSES.PULSATE);
            eventEmitter.emit(EVENTS.RESUME_TIMELINE, {});
        };
        this.$text.toggleClass(CLASSES.IS_INACTIVE);
    }

    _addEventListeners() {
        this.$el.on( 'mouseover', this._handleIconHover).mouseleave('mouseout', this._handleIconHover);
        eventEmitter.on(EVENTS.SHOW_TOOLTIP, this.show.bind(this));
        eventEmitter.on(EVENTS.DESTROY_TOOLTIP, this.destroy.bind(this));
    }

    _removeEventListeners() {
        this.$el.off();
        eventEmitter.off(EVENTS.SHOW_TOOLTIP, this.show.bind(this));
        eventEmitter.off(EVENTS.DESTROY_TOOLTIP, this.destroy.bind(this));
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
