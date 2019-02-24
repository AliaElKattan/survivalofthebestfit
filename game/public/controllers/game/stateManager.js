import * as machina from 'machina';
import { pixiApp, eventEmitter, beltContainer, officeContainer } from './gameSetup.js';
import { createPerson } from '../../components/pixi/person.js';
import { Office } from '../../components/pixi/office.js';
import { createMlOffice } from '../../components/pixi/mlLab.js';

import { incubator } from '../common/textures.js';
import { TextBox } from '../../components/interface/old-pixi-components-demise/instructionBubble.js';
import TextBoxUI from '../../components/interface/ui-instruction/ui-instruction';
import { startTaskTimer } from '../../components/interface/old-pixi-components-demise/taskTimer.js';
import { CVViewer } from '../../components/interface/old-pixi-components-demise/cvViewer.js';
import { cvCollection } from '../../assets/text/cvCollection.js';
import { uv2px, animateTo } from '../common/utils.js';

import { xIcon } from '../common/textures.js';
import { beltTexture, doorTexture, cvTexture } from '../common/textures.js';

let office;
let personList;
let cvViewerML;
let cvList;

/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm({

    namespace: 'game-fsm',
    initialState: 'welcomeStage',

    states: {
        uninitialized: {
            startGame: function () {
                this.transition('welcomeStage');
            },
        },

        /* ///////////////////
        // Welcome image
        */// /////////////////
        welcomeStage: {
            _onEnter: function () {
                this.timer = setTimeout(() => {
                    this.handle('timeout');
                }, 300);

                this.image = new PIXI.Sprite(incubator);
                pixiApp.stage.addChild(this.image);
                this.image.scale.set(0.7);
            },

            timeout: 'smallOfficeStage',

            _onExit: function () {
                clearTimeout(this.timer);
                this.image.parent.removeChild(this.image);
            },
        },

        /* ///////////////////
        // Small office, hiring from the street
        */// /////////////////
        smallOfficeStage: {
            _onEnter: function () {
                const smallOfficeStageText = new TextBoxUI({ content: txt.smallOfficeStage.messageFromVc, show: true });
                eventEmitter.on('instructionAcked', () => {
                    office = new Office();
                    this.handle('setupOffice');
                });
                eventEmitter.on('time-up', () => {
                    this.handle('retryStage');
                });
            },

            setupOffice: function () {
                personList = [];
                // create People in the office
                let numberOfCandidates = 0.12;
                for (let i = 0; i < 12; i++) {
                    const person = createPerson(numberOfCandidates, 0.88, office);
                    personList.push(person);
                    numberOfCandidates += 0.05;
                }
                startTaskTimer(0.7, 0.1, 0.22, 0.16, txt.smallOfficeStage.taskDescription, 140, 5);
                const cvViewer = new CVViewer(0.8, 0.62, 0.13, 0.32, cvCollection.cvFeatures, cvCollection.smallOfficeStage);
                //const resumeViewer = new ResumeViewerUI();
            },

            retryStage: function () {
                const retryMsg = new TextBox(uv2px(0.5, 'w'), uv2px(0.5, 'h'), txt.smallOfficeStage.retryMessage);
                // TODO - clear/reset office drawing
                this.handle('setupOffice');
            },

            nextStage: 'mediumOfficeStage',

            _onExit: function () {

            },
        },

        /* ///////////////////
        // Big office, city level view
        */// /////////////////
        mediumOfficeStage: {
            _onEnter: function () {
                const mediumOfficeStageText = new TextBoxUI({content: txt.mediumOfficeStage.messageFromVc, show: true});
                
                eventEmitter.on('instructionAcked', () => {
                    this.handle('setupOffice');
                });
                
                eventEmitter.on('time-up', () => {
                    this.handle('retryStage');
                });
            },
            
            setupOffice: function () {
                office.growOffice(getUnassignedPeople());
                startTaskTimer(0.7, 0.1, 0.22, 0.16, txt.mediumOfficeStage.taskDescription, 140, 10);
            },

            retryStage: function () {
                const retryMsg = new TextBoxUI({content: txt.mediumOfficeStage.retryMessage, show: true});
                this.handle('setupOffice');
            },

            nextStage: 'bigOfficeStage',

            _onExit: function () {

            },
        },

        /* ///////////////////
        // Huge office, ccountry level view
        */// /////////////////
        bigOfficeStage: {
            _onEnter: function () {
                office.growOffice(getUnassignedPeople());
            },

            nextStage: 'mlTransitionStage',

            _onExit: function () {

            },
        },

        mlTransitionStage: {
            _onEnter: function () {

            },

            nextStage: 'mlLabStage',

            _onExit: function () {

            },
        },

        mlLabStage: {

            _onEnter: function () {
                createMlOffice();
            }

        },


    },


    startGame: function () {
        this.handle('startGame');
    },
    nextStage: function () {
        this.handle('nextStage');
    },
});

const getUnassignedPeople = () => {
    const unassignedPeople = [];
    for (let i = 0; i < personList.length; i++) {
        if (!personList[i].controller.isSeated()) {
            unassignedPeople.push(personList[i]);
        }
    }
    return unassignedPeople;
};


export { gameFSM };
