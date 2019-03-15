import * as machina from 'machina';
import {incubator} from '../common/textures.js';
import {pixiApp, eventEmitter} from './gameSetup.js';
import {Office} from '../../components/pixi/office.js';
import MLLab from '../../components/pixi/ml/lab.js';
import TextBoxUI from '../../components/interface/ui-textbox/ui-textbox';
import ResumeUI from '../../components/interface/ui-resume/ui-resume';
import TaskUI from '../../components/interface/ui-task/ui-task';
import TransitionOverlay from '../../components/interface/transition/overlay/overlay';
import {cvCollection} from '../../assets/text/cvCollection.js';


let office;
let transitionOverlay;

/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm({
    namespace: 'game-fsm',
    states: {
        uninitialized: {
            startGame: function() {

                // this.transition('smallOfficeStage');
                this.transition('mlLabStage');
            },
        },

        /* ///////////////////
        // Welcome image
        */// /////////////////
        welcomeStage: {
            _onEnter: function() {
                this.timer = setTimeout(() => {
                    this.handle('timeout');
                }, 300);

                this.image = new PIXI.Sprite(incubator);
                pixiApp.stage.addChild(this.image);
                this.image.scale.set(0.7);
            },

            timeout: 'smallOfficeStage',

            _onExit: function() {
                clearTimeout(this.timer);
                this.image.parent.removeChild(this.image);
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
                    this.handle('setupOffice');
                });
            },

            setupOffice: function() {
                office = new Office();
                new TaskUI({show: true, hires: 5, duration: 30, content: txt.smallOfficeStage.taskDescription});

                eventEmitter.on('person-clicked', () => {
                    new ResumeUI({
                        show: true, 
                        features: cvCollection.cvFeatures, 
                        scores: cvCollection.smallOfficeStage,
                        candidateId: candidateInScope
                    });
                })
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
                    this.handle('expandOffice');
                });

                eventEmitter.on('time-up', () => {
                    this.handle('retryStage');
                });
            },

            expandOffice: function() {
                office.expandOffice();
                new TaskUI({show: true, hires: 10, duration: 30, content: txt.mediumOfficeStage.taskDescription});
            },

            nextStage: 'bigOfficeStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Huge office, ccountry level view
        */// /////////////////
        bigOfficeStage: {
            _onEnter: function() {
                office.expandOffice();
            },

            nextStage: 'mlTransitionStage',

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
});

export {gameFSM};