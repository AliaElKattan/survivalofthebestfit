import * as machina from 'machina';
import {incubator} from '../common/textures.js';
import {pixiApp, eventEmitter} from './gameSetup.js';
import {Office} from '../../components/pixi/office.js';
import MLLab from '../../components/pixi/ml/lab.js';
import TitlePageUI from '../../components/interface/ui-title/ui-title';
import TextBoxUI from '../../components/interface/ui-textbox/ui-textbox';
import ResumeUI from '../../components/interface/ui-resume/ui-resume';
import TaskUI from '../../components/interface/ui-task/ui-task';
import TransitionOverlay from '../../components/interface/transition/overlay/overlay';
import {cvCollection} from '../../assets/text/cvCollection.js';
import YesNo from '../../components/interface/yes-no/yes-no';

let office;
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
                //this.transition('mlLabStage');
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
        // Small office, hiring from the street
        */// /////////////////

        smallOfficeStage: {
            _onEnter: function() {
                new TextBoxUI({
                    content: txt.smallOfficeStage.messageFromVc,
                    responses: txt.smallOfficeStage.responses,
                    show: true,
                });

                eventEmitter.on('instructionAcked', () => {
                    office = new Office();
                    new TaskUI({show: true, hires: 5, duration: 60, content: txt.smallOfficeStage.taskDescription});
                    new YesNo({show: true});
                });
            },

            nextStage: 'mediumOfficeStage',

            _onExit: function() {
                
            },
        },

        /* ///////////////////
        // Big office, city level view
        */// /////////////////
        mediumOfficeStage: {
            _onEnter: function() {
                new TextBoxUI({
                    content: txt.mediumOfficeStage.messageFromVc,
                    responses: txt.mediumOfficeStage.responses,
                    show: true,
                });
                eventEmitter.on('instructionAcked', () => {
                    new TaskUI({show: true, hires: 10, duration: 60, content: txt.mediumOfficeStage.taskDescription});
                    new YesNo({show: true});
                });

                // eventEmitter.on('time-up', () => {
                //     this.handle('retryStage');
                // });
            },

            nextStage: 'mlTransitionStage',

            _onExit: function() {

            },
        },

        // /* ///////////////////
        // // Huge office, ccountry level view
        // */// /////////////////
        // bigOfficeStage: {
        //     _onEnter: function() {
        //         office.expandOffice();
        //     },

        //     nextStage: 'mlTransitionStage',

        //     _onExit: function() {

        //     },
        // },

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
});

export {gameFSM};
