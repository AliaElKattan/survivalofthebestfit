import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/controllers/constants/classes';
import EVENTS from '~/public/controllers/constants/events';
import UIBase from '~/public/components/interface/ui-base/ui-base';
// import NewsTimeline from '~/public/components/interface/ml/news-timeline/news-timeline';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('#news-feed');
        this.$newsList = this.$el.find('.NewsList');
        this.$newsElArray = [];
        this._newsArray = [
            'Technoradar: Amazon Algorithm Discriminates Against Women',
            '@CITIZEN: #TechCompanies should be held accountable!! #justice',
        ];
        this._content = options ? options.content : 'dummy text'; // TODO: change this to null
        // this._newsTimeline = new NewsTimeline();

        this._addEventListeners();
        // instead of showing the news feed right away launch the news updates timeline
        if (options && options.show) {
            // this._newsTimeline.start();
        }
    }

    // public method to launch news updates

    launchNewsUpdates() {
        this._newsTimeline.start();
    }

    // update news feed

    _updateNewsFeed() {
        const $news = this._createNewsElement(); // create a new news feed element
        if (!$news) return; // if there is no news left to add to the feed, exit the method
        $news.appendTo(this.$newsList); // append the element to the news feed parent container
        // this.animateNews();
        this._updateNewsArray(); // pop the news update from the scheduled posts array
        this.show(); // show the updated news feed
        // TODO tweak this if needed - schedule to hide the news after some time
        this.waitForSeconds(3).then(() => {
            // setTimeout(this.hide(), 3000);
        }).catch((err) => {
            console.log(err);
        });
    }

    // update news array

    _updateNewsArray() {
        this._newsArray = this._newsArray.slice(1);
    }

    // create new news element

    _createNewsElement() {
        const newsEl = document.createElement('p');
        newsEl.classList.add(`${CLASSES.NEWS_FEED_ITEM}`);
        return this._newsArray.length !== 0 ? $(newsEl).text(this._newsArray[0]) : undefined;
    }

    // add event listeners

    _addEventListeners() {
        eventEmitter.on(EVENTS.UPDATE_NEWS_FEED, () => {
            this._updateNewsFeed();
        });
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
        TweenLite.to('.NewsList-item', 3, {x: 300, ease: Power0.easeNone});
    }

    // hide the news feed

    hide() {
        // this.$el.addClass(CLASSES.FADE_OUT);
        TweenLite.to('#news-feed', 0.3, {y: -50});
        TweenLite.delayedCall(0.3, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    // util class for scheduling news updates

    waitForSeconds(durationInSeconds) {
        const durationInMS = durationInSeconds*1000;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, durationInMS);
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
