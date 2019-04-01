import $ from 'jquery';
import CLASSES from '~/public/controllers/constants/classes';
// import EVENTS from '~/public/controllers/constants/events';
import UIBase from '~/public/components/interface/ui-base/ui-base';
// import {eventEmitter} from '~/public/controllers/game/gameSetup.js';
import {mlLabStageContainer} from '~/public/controllers/game/gameSetup';

export default class extends UIBase {
    constructor({text, parent}) {
        super();
        this.$el = $('#js-person-tooltip');
        this.content = text;
        this.isActive = false;
        this._setContent();
        this._addEventListeners();
    }

    _setContent() {
        const {x, y} = mlLabStageContainer.getChildByName(this.parent).getGlobalPosition();
        this.$el.css({
            'top': `${y}px`,
            'left': `${x}px`,
        }).html(this.content);
    }

    _addEventListeners() {
        // this.$el.on( 'mouseover', this._handleIconHover).mouseleave('mouseout', this._handleIconHover);
        // eventEmitter.on(EVENTS.SHOW_TOOLTIP, this.show.bind(this));
        // eventEmitter.on(EVENTS.DESTROY_TOOLTIP, this.destroy.bind(this));
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
