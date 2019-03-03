import * as machina from 'machina';
import {incubator} from '../common/textures.js';
import {pixiApp, eventEmitter} from './gameSetup.js';
import {Office} from '../../components/pixi/office.js';
import {createMlOffice} from '../../components/pixi/mlLab.js';
import {cvCollection} from '../../assets/text/cvCollection.js';
import NewsFeedUI from '../../components/interface/ml/news-feed/news-feed.js';
import {TextBox} from '../../components/interface/old-pixi-components-demise/instructionBubble.js';
import MLAlgorithmInspectorUI from '../../components/interface/ml/algorithm-inspector/algorithm-inspector.js';
import {startTaskTimer} from '../../components/interface/old-pixi-components-demise/taskTimer.js';
import MLResumeViewerUI from '../../components/interface/ml/resume-viewer/resume-viewer.js';
import TextBoxUI from '../../components/interface/ui-instruction/ui-instruction';
import ResumeUI from '../../components/interface/ui-resume/ui-resume';
import TaskUI from '../../components/interface/ui-task/ui-task';


let office;
let cvList;
let cvViewerML;
/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm({
    namespace: 'game-fsm',
    states: {
        uninitialized: {
            startGame: function() {
                this.transition('smallOfficeStage');
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
                new TextBoxUI({content: txt.smallOfficeStage.messageFromVc, show: true});
                eventEmitter.on('instructionAcked', () => {
                    this.handle('setupOffice');
                });
            },

            setupOffice: function() {
                office = new Office();
                new TaskUI({show: true, hires: 5, duration: 30, content: txt.smallOfficeStage.taskDescription});
                new ResumeUI({show: true, features: cvCollection.cvFeatures, scores: cvCollection.smallOfficeStage});
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
                new TextBoxUI({content: txt.mediumOfficeStage.messageFromVc, show: true});
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
                office.delete();
            },

            nextStage: 'mlLabStage',

            _onExit: function() {

            },
        },

        mlLabStage: {
            _onEnter: function() {
                createMlOffice();
                new MLResumeViewerUI({show: true, type: 'accepted'});
                new MLResumeViewerUI({show: true, type: 'rejected'});
                new MLAlgorithmInspectorUI({});
                new NewsFeedUI({show: true});
            },

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
