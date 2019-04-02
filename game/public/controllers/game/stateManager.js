import * as machina from 'machina';
import {eventEmitter} from './gameSetup.js';
import {Office} from '../../components/pixi/office.js';
import MLLab from '../../components/pixi/ml/lab.js';
import TitlePageUI from '../../components/interface/ui-title/ui-title';
import TextBoxUI from '../../components/interface/ui-textbox/ui-textbox';
import PerfMetrics from '~/public/components/interface/perf-metrics/perf-metrics';
import TaskUI from '../../components/interface/ui-task/ui-task';
import TransitionOverlay from '../../components/interface/transition/overlay/overlay';

let office = new Office();
let task;
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
                // this.transition('titleStage');
                this.transition('smallOfficeStage');
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
        // Small office, hiring 5
        */// /////////////////

        smallOfficeStage: {
            _onEnter: function() {
                new TextBoxUI({
                    content: txt.smallOfficeStage.messageFromVc,
                    responses: txt.smallOfficeStage.responses,
                    show: true,
                    isSmallStage: true,
                    overlay: true
                });

                new PerfMetrics();

                eventEmitter.on('instructionAcked', (data) => {
                    if (data.isSmallStage) {
                        office.draw(0);
                        task = new TaskUI({show: true, hires: hiringGoals['smallStage'], duration: 60, content: txt.smallOfficeStage.taskDescription});
                    }
                });
            },

            nextStage: 'mediumOfficeStage',

            repeatStage: 'repeatSmallOfficeStage',
            
            _onExit: function() {
                
            },
        },

        repeatSmallOfficeStage: {
            _onEnter: function() {
                new TextBoxUI({
                    content: txt.smallOfficeStage.retryMessage,
                    responses: txt.smallOfficeStage.retryResponses,
                    show: true,
                    isSmallStage: true,
                    overlay: true

                });

                eventEmitter.on('instructionAcked', (data) => {
                    this.handle('nextStage');
                });
            },

            nextStage: 'smallOfficeStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Medium office, hiring 15
        */// /////////////////
        mediumOfficeStage: {
            _onEnter: function() {
                new TextBoxUI({
                    content: txt.mediumOfficeStage.messageFromVc,
                    responses: txt.mediumOfficeStage.responses,
                    show: true,
                    overlay: true
                });
                
                eventEmitter.on('instructionAcked', (data) => {
                    if (!data.isSmallStage) {
                        office.draw(1);
                        task = new TaskUI({ show: true, hires: hiringGoals['mediumStage'], duration: 60, content: txt.mediumOfficeStage.taskDescription });
                    }
                });
            },

            nextStage: 'mlTransitionStage',

            repeatStage: 'repeatMediumOfficeStage',

            _onExit: function() {

            },
        },

        repeatMediumOfficeStage: {
            _onEnter: function() {
                new TextBoxUI({
                    content: txt.mediumOfficeStage.retryMessage,
                    responses: txt.mediumOfficeStage.retryResponses,
                    show: true,
                    isSmallStage: false,
                    overlay: true

                });

                eventEmitter.on('instructionAcked', (data) => {
                    this.handle('nextStage');
                });
            },

            nextStage: 'smallOfficeStage',

            _onExit: function() {

            },
        },

        mlTransitionStage: {
            _onEnter: function() {
                if (office) office.delete();
                transitionOverlay = new TransitionOverlay({show: true});
            },

            nextStage: 'mlLabStage',

            _onExit: function() {
                transitionOverlay.destroy();
            },
        },

        mlLabStage: {
            _onEnter: function() {
                new MLLab();
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
