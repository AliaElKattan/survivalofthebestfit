import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';
import UIBase from '../ui-base/ui-base';
import { eventEmitter } from '../../../controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this._removeEventListeners();
        this.$el = $('.js-resume'); // This should be a single element
        this.$nameEl = this.$el.find('.Resume__title');
        this.$taglineEl = this.$el.find('.Resume__tagline');
        this._content = options ? options.content : 'dummy text'; // TODO: change this to null
        this._resumeFeatures = options ? options.features : undefined;
        this._resumes = options ? options.scores : undefined;
        this._candidateNum = 0;
        // this.setContent(); // set content
        if (options && options.show) {
            this.show();
            this.newCV();
        }
    }

    newCV() {
        if (this._resumes === undefined || this._resumeFeatures === undefined) {
            throw new Error('You need to pass CV scores to the CV viewer upon instantiation');
        };
        if (this._candidateNum === this._resumes.length) alert('we have no CVs left');
        this.showCV(this._resumes[this._candidateNum]);
        this._candidateNum++;
    }

    showCV(cv) {
        this.$nameEl.html(cv.name);
        this.$taglineEl.html('personal tagline comes here');
        this._resumeFeatures.forEach((feature, index) => {
            const skillScore = cv.qualifications[index]*10;
            const skillClass = `.${CLASSES.CV_CATEGORY}--${feature.class}`;
            const $skillEl = this.$el.find(skillClass);
            $skillEl.find(`.${CLASSES.CV_CATEGORY}__name`).html(feature.name);
            $skillEl.find(`.${CLASSES.CV_CATEGORY}__progress`).css('width', `${skillScore}%`);
        });
    }

    _testLog() {
        console.log('test emitter works!');
    }

    _buttonIsClicked(e) {
        this.$button.addClass(CLASSES.BUTTON_CLICKED);
        eventEmitter.emit('instructionAcked', {});
        this.hide();
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.EMITTER_TEST, this._testLog());
        this.$button.click(this._buttonIsClicked.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.EMITTER_TEST, this._testLog());
        //this.$button.off(this._buttonIsClicked.bind(this));
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    hide() {
        this.$el.removeClass(CLASSES.FADE_IN)
            .addClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.IS_INACTIVE);

        // TODO you might need a delayed call for this
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        // this.$el.destroy();
    }
}
