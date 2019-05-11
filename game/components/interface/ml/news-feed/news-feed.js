import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/controllers/constants/classes';
import EVENTS from '~/public/controllers/constants/events';
import UIBase from '~/public/components/interface/ui-base/ui-base';
import {screenSizeDetector} from '~/public/controllers/common/utils.js';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('#news-feed');
        this.$newsList = this.$el.find('.NewsList');
        this.$newsElArray = [];
        this._newsArray = [];
        this.isDesktop = screenSizeDetector() === 'desktop';
        this._content = options ? options.content : 'dummy text'; // TODO: change this to null

        this._addEventListeners();
        // instead of showing the news feed right away launch the news updates timeline
        if (options && options.show) {
            // this._newsTimeline.start();
        }
    }

    // update news feed

    _updateNewsFeed({news}) {
        if (!Array.isArray(news) || news.length < 2) throw new Error('News has to be an array - with at least two members!');

        this.$newsList.empty();

        news.forEach((n) => {
            this._newsArray.unshift(n); // add element to the beginning of the news array

            if (!this.isDesktop) {
                this._createNewsElement(n); // create a new news feed DOM element
            } else {
                // for (let i = 0; i < 2; i++) {
                    this._createNewsElement(n); // create a new news feed DOM element
                // };
            }
        });

        // this.animateNews(); // TODO
        this._newsArray = this._newsArray.slice(0, 2); // pop the outdated news from the array
        this.show(); // show the updated news feed
        // TODO tweak this if needed - schedule to hide the news after some time
    }

    // create new news element

    _createNewsElement(newsText) {
        const newsEl = document.createElement('p');
        newsEl.classList.add(`${CLASSES.NEWS_FEED_ITEM}`);
        $(newsEl).text(newsText).appendTo(this.$newsList);
    }

    // add event listeners

    _addEventListeners() {
        eventEmitter.on(EVENTS.UPDATE_NEWS_FEED, this._updateNewsFeed.bind(this));
        eventEmitter.on(EVENTS.HIDE_NEWS_FEED, this.hide.bind(this));
    }

    // remove event listeners

    _removeEventListeners() {
        eventEmitter.off(EVENTS.SHOW_NEWS, () => {});
    }

    // show the news feed

    show() {
        TweenLite.set('#news-feed', {y: -50}); // set the Y transform before animating it
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to('#news-feed', 0.3, {y: 0});
    }


    animateNews() {
        TweenLite.to('.NewsList-item', 8, {x: '100vw', ease: Power0.easeNone});
    }

    // hide the news feed

    hide() {
        TweenLite.to('#news-feed', 0.3, {y: -50});
        TweenLite.delayedCall(0.3, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    // destroy the instance

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.destroy();
    }
}
