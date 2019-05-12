import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import CircleGrid from '~/public/game/components/pixi/training-stage/circle-grid';
import {gameFSM} from '~/public/game/controllers/game/stateManager.js';
import {waitForSeconds, setCanvasBackground, clamp} from '~/public/game/controllers/common/utils';
import {ticker} from '~/public/game/controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor() {
        super();
        this.$el = $('#TrainingOverlay');
        this.$progressBox = $('#TrainingOverlay > .ProgressBox');
        this.$progressBar = this.$el.find('.ProgressBar__progress');
        this.$content = this.$el.find('.ProgressBox__text');
        this.$email = this.$el.find('.js-email');
        this.$stageEndBtn = this.$el.find('.js-training-stage-btn');
        this.grid = new CircleGrid();
        this.stageDuration = 12;
        this.elapsedTime = 0;
        this.timePerUpdate = null;
        this.progressMessages = [
            'Loading CVs...',
            'Loading Google dataset...',
            'Processing data...',
            'Optimizing algorithm...',
            'Finished!',
        ];
        this.init();
    }

    init() {
        waitForSeconds(1).then(() => {
            this.show();
            this.updateProgressText();
            this.launchProgressBar();
        });
    }

    launchProgressBar() {
        this.timePerUpdate = Math.round(this.stageDuration / this.progressMessages.length);
        this.inProgress = true;
        this.updateProgressStage();
        ticker.add(this.progressBarHandler.bind(this));
        ticker.start();
    }

    progressBarHandler() {
        this.elapsedTime += ticker.elapsedMS;
        const progressPercentage = Math.round((this.elapsedTime/(this.stageDuration*1000)*100));
        this.$progressBar.css('width', `${clamp(progressPercentage, 0, 100)}%`);
    }

    updateProgressStage() {
        waitForSeconds(this.timePerUpdate).then(() => {
            this.updateProgressText();
            // console.log(this.progressMessages.length);
            if (this.progressMessages.length === 0) {
                this.$progressBar.css('width', `100%`);
                ticker.remove(this.progressBarHandler.bind(this));
                this.grid.stopFlickering();
                this.grid.lightDown();
                this.showEndUI();
            } else {
                this.updateProgressStage();
            }
        });
    }

    updateProgressText() {
        // console.log(`new message is: ${this.progressMessages[0]}`);
        this.$content.text(this.progressMessages[0]);
        this.progressMessages = this.progressMessages.filter((el, i) => i > 0);
    }

    showEndUI() {
        // console.log('show end ui!');
        this.$progressBox.addClass(CLASSES.IS_INACTIVE);
        TweenLite.delayedCall(1, () => {
            this.$el.addClass('pink-background');
            this.$email.removeClass(CLASSES.IS_INACTIVE);
            TweenLite.set('#js-training-email', {yPercent: -40, xPercent: -50, opacity: 0});
            TweenLite.to('#js-training-email', 0.3, {yPercent: -50, opacity: 1, ease: Power1.easeInOut});
            this.$stageEndBtn.on('click', () => {
                this.$stageEndBtn.find('.button').addClass('step-completed');
                this.exit();
            });
        });
    }

    exit() {
        setCanvasBackground({});
        waitForSeconds(0.3).then(() => {
            gameFSM.nextStage();
        });
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
    }

    destroy() {
        super.dispose();
        this.hide();
        this.$stageEndBtn.off();
        this.grid.destroy();
    }
}
