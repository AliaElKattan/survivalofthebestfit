import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import PersonCard from '~/public/game/components/interface/ml/person-card/person-card';
import DatasetResumePreview from '~/public/game/components/interface/ml/dataset-resume-preview/dataset-resume-preview';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.options = options;
        this.$el = $('#dataset-overlay');
        this.$resume = $('#dataset-view-resume');
        this.$xIcon = this.$el.find('.js-x-icon');
        this.dataset = [];
        this.resumePreview = new DatasetResumePreview();
        this.scrollIsActive = false;
        this._handleIconClick = this._handleIconClick.bind(this);
        this._handleInspectButtonClick = this._handleInspectButtonClick.bind(this);
        this._handlePersonCardHover = this._handlePersonCardHover.bind(this);
        this.activePerson = null;
        this._addEventListeners();
        if (options && options.show) {
            this.show();
        }
    }

    _addEventListeners() {
        this.$xIcon.on('click', this._handleIconClick);
        eventEmitter.on(EVENTS.DATASET_VIEW_INSPECT, this._handleInspectButtonClick);
        const $resumeGrids = document.querySelectorAll('.DatasetGrid');
        $resumeGrids.forEach((grid) => grid.addEventListener('mouseover', this._handlePersonCardHover));
    }

    _removeEventListeners() {
        this.$xIcon.off('click', this._handleIconClick);
        eventEmitter.off(EVENTS.DATASET_VIEW_INSPECT, this._handleInspectButtonClick);
    }

    _handleIconClick() {
        this.hide();
    }

    _handleInspectButtonClick() {
        this.$el.hasClass(CLASSES.IS_INACTIVE) ? this.show() : '';
    }

    handleNewResume(resume) {
        const personCard = new PersonCard({
            resume: resume,
            $parent: this.$el,
        });
        // if (!this.scrollIsActive) this._checkForScroll();
        this.dataset.push(personCard);
    }

    _checkForScroll() {
        const $resumeGrids = document.querySelectorAll('.DatasetGrid');
        $resumeGrids.forEach((grid) => {
            console.log(grid.scrollHeight - grid.clientHeight);
            if (grid.scrollHeight > grid.clientHeight) {
                $('#dataset-scroller').removeClass(CLASSES.IS_INACTIVE);
                this.scrollIsActive = true;
            }
        });
    }

    _handlePersonCardHover(event) {
        let personID;
        if (event.target.matches('.PersonCard.is-parent')) {
            personID = $(event.target).attr('data-id');
        } else if (event.target.matches('.PersonCard-item')) {
            personID = $(event.target).parent().attr('data-id');
        };
        const activePerson = this.dataset.find((person) => person.getID() === parseInt(personID));
        if (activePerson && activePerson !== this.activePerson) {
            this.resumePreview.previewNewPerson(activePerson.getData());
            this.activePerson = activePerson;
        };
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.set('#dataset-overlay', {y: 50, opacity: 0});
        TweenLite.to('#dataset-overlay', 0.3, {y: 0, opacity: 1, ease: Power1.easeOut});
    }

    hide() {
        TweenLite.to('#dataset-overlay', 0.2, {y: 20, opacity: 0, ease: Power1.easeOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.destroy();
    }
}
