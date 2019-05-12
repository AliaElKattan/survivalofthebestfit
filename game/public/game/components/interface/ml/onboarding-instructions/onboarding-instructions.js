import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {screenSizeDetector} from '~/public/game/controllers/common/utils.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        // this.$el = $('#news-feed');
        // this.isDesktop = screenSizeDetector() === 'desktop';

        this._addEventListeners();
        // if (options && options.show) {
        // }
    }

  
    _addEventListeners() {
        // eventEmitter.on(EVENTS.HIDE_NEWS_FEED, this.hide.bind(this));
    }

    _removeEventListeners() {
        // eventEmitter.off(EVENTS.SHOW_NEWS, () => {});
    }

    show({text}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(text);
                resolve();
            }, 1000);
        });
        // TweenLite.set('#news-feed', {y: -50}); // set the Y transform before animating it
        // this.$el.removeClass(CLASSES.IS_INACTIVE);
        // TweenLite.to('#news-feed', 0.3, {y: 0});
    }

    hide() {
        // TweenLite.to('#news-feed', 0.3, {y: -50});
        // TweenLite.delayedCall(0.3, () => {
        //     this.$el.addClass(CLASSES.IS_INACTIVE);
        // });
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.destroy();
    }
}
