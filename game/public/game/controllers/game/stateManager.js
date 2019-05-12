import * as machina from 'machina';
import {eventEmitter} from './gameSetup.js';
import {Office} from '~/public/game/components/pixi/manual-stage/office.js';
import MlLabNarrator from '~/public/game/controllers/game/mlLabNarrator';
import TitlePageUI from '~/public/game/components/interface/ui-title/ui-title';
import TextBoxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import PerfMetrics from '~/public/game/components/interface/perf-metrics/perf-metrics';
import TransitionOverlay from '~/public/game/components/interface/transition/overlay/overlay';
import {mlModule} from '~/public/game/controllers/machine-learning/mlModule.js';

let office = new Office();
let currentStage;
let revenue;
let transitionOverlay;
let titlePageUI;

/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm({
    namespace: 'game-fsm',
    states: {
        uninitialized: {
            startGame: function() {
                this.transition('titleStage');
                // this.transition('smallOfficeStage');
                // this.transition('mlTransitionStage');
                // this.transition('mlLabStage');
            },
        },

        /* ///////////////////
        // Title stage
        */// /////////////////
        titleStage: {
            _onEnter: function() {
                titlePageUI = new TitlePageUI({
                    headerText: txt.titleStage.header,
                    content: txt.titleStage.instruction,
                    responses: txt.titleStage.responses,
                    show: true,
                });

                eventEmitter.on('first-start-button-clicked', () => {
                    this.handle('nextStage');
                });
            },

            nextStage: 'tutorialStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Tutorial stage
        */// /////////////////
        tutorialStage: {
            _onEnter: function() {
                titlePageUI.updateContent({
                    headerText: txt.tutorialStage.header,
                    content: txt.tutorialStage.instruction,
                    responses: txt.tutorialStage.responses,
                    show: true,
                });

                eventEmitter.on('second-start-button-clicked', () => {
                    this.handle('nextStage');
                });
            },

            nextStage: 'smallOfficeStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Small Office Stage
        */// /////////////////
        smallOfficeStage: {
            _onEnter: function() {
                currentStage = 0;

                new TextBoxUI({
                    content: txt.smallOfficeStage.messageFromVc,
                    responses: txt.smallOfficeStage.responses,
                    show: true,
                    stageNumber: currentStage,
                    overlay: true,
                });
            },

            nextStage: 'mediumOfficeStage',

            _onExit: function() {
            },
        },

        /* //////////////////
        // Medium Small Office Stage
        */// /////////////////
        mediumOfficeStage: {
            _onEnter: function() {
                currentStage = 1;

                new TextBoxUI({
                    stageNumber: currentStage,
                    content: txt.mediumOfficeStage.messageFromVc,
                    responses: txt.mediumOfficeStage.responses,
                    show: true,
                    overlay: true,
                });
            },

            nextStage: 'largeOfficeStage',

            _onExit: function() {
            },
        },

        /* //////////////////
        // Large Small Office Stage
        */// /////////////////
        largeOfficeStage: {
            _onEnter: function() {
                currentStage = 2;

                new TextBoxUI({
                    stageNumber: currentStage,
                    content: txt.largeOfficeStage.messageFromVc,
                    responses: txt.largeOfficeStage.responses,
                    show: true,
                    overlay: true,
                });
            },

            nextStage: 'mlTransitionStage',

            _onExit: function() {
            },
        },

        mlTransitionStage: {
            _onEnter: function() {
                if (office) office.delete();
                transitionOverlay = new TransitionOverlay({show: true});
                mlModule.train();
            },

            nextStage: 'mlLabStage',

            _onExit: function() {
                transitionOverlay.destroy();
            },
        },

        mlLabStage: {
            _onEnter: function() {
                if (revenue) {
                    revenue.show();
                } else {
                    office.delete();
                    new PerfMetrics().show();
                }

                new MlLabNarrator();
            },
            // TODO destroy the lab!
            nextStage: 'Oh gosh we haven\'t even started it hahah',

        },

    },

    startGame: function() {
        this.handle('startGame');
    },

    nextStage: function() {
        this.handle('nextStage');
    },

    repeatStage: function() {
        this.handle('repeatStage');
    },
});

export {gameFSM};