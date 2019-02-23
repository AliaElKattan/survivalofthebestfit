import * as machina from 'machina';
import {pixiApp, eventEmitter, beltContainer} from './gameSetup.js';
import {createPerson} from '../../components/pixi/person.js';
import {Office} from '../../components/pixi/office.js';
import {createMlOffice} from '../../components/pixi/mlLab.js';

import {incubator} from '../common/textures.js';
import {TextBox} from '../../components/interface/old-pixi-components-demise/instructionBubble.js';
import TextBoxUI from '../../components/interface/ui-instruction/ui-instruction';
import {startTaskTimer} from '../../components/interface/old-pixi-components-demise/taskTimer.js';
import {CVViewer} from '../../components/interface/old-pixi-components-demise/cvViewer.js';
import {cvCollection} from '../../assets/text/cvCollection.js';
import {uv2px, animateTo} from '../common/utils.js';

import {xIcon} from '../common/textures.js';
import {beltTexture, doorTexture, cvTexture} from '../common/textures.js';

let office;
let personList;
let cvViewerML;

let cvList;

/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm( {

    namespace: 'game-fsm',
    initialState: 'welcomeStage',

    states: {
        uninitialized: {
            startGame: function() {
                this.transition( 'welcomeStage' );
            },
        },

        /* ///////////////////
        // Welcome image
        */// /////////////////
        welcomeStage: {
            _onEnter: function() {
                this.timer = setTimeout(() => {
                    this.handle( 'timeout' );
                }, 300 );

                this.image = new PIXI.Sprite(incubator);
                pixiApp.stage.addChild(this.image);
                this.image.scale.set(0.7);
            },

            timeout: 'smallOfficeStage',

            _onExit: function() {
                clearTimeout( this.timer );
                this.image.parent.removeChild(this.image);
            },
        },

        /* ///////////////////
        // Small office, hiring from the street
        */// /////////////////
        smallOfficeStage: {
            _onEnter: function() {
                const smallOfficeStageText = new TextBoxUI({content: txt.smallOfficeStage.messageFromVc, show: true});
                eventEmitter.on('instructionAcked', () => {
                    this.handle('setupOffice');
                });
            },

            setupOffice: function() {
                office = new Office();
                personList = [];
                // create People in the office
                
                for (let i = 0; i < 12; i++) {
                    const person = createPerson(0.12, 0,88, office);
                    personList.push(person);
                    x += 0.05;
                }
                startTaskTimer(uv2px(0.7, 'w'), uv2px(0.1, 'h'), uv2px(0.22, 'w'), uv2px(0.16, 'h'), txt.smallOfficeStage.taskDescription, 140, 5);
                const cvViewer = new CVViewer(uv2px(0.8, 'w'), uv2px(0.62, 'h'), uv2px(0.13, 'w'), uv2px(0.32, 'h'), cvCollection.cvFeatures, cvCollection.smallOfficeStage);
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
                const smallOfficeStageOver = new TextBox(uv2px(0.5, 'w'), uv2px(0.5, 'h'), txt.mediumOfficeStage.messageFromVc);
                // const mediumOfficeStageText = new TextBoxUI({content: txt.mediumOfficeStage.messageFromVc, show: true});
                eventEmitter.on('instructionAcked', () => {
                    this.handle('setupOffice');
                });
            },

            setupOffice: function() {
                office.growOffice(getUnassignedPeople());

                startTaskTimer(uv2px(0.7, 'w'), uv2px(0.1, 'h'), uv2px(0.22, 'w'), uv2px(0.16, 'h'), txt.mediumOfficeStage.taskDescription, 140, 10);
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
                office.growOffice(getUnassignedPeople());
            },

            nextStage: 'mlTransitionStage',

            _onExit: function() {

            },
        },

        mlTransitionStage: {
            _onEnter: function() {
                
            },

            nextStage: 'mlLabStage',

            _onExit: function() {

            },
        },

        mlLabStage: {

            _onEnter: function() {
                createMlOffice();
            }

        },


    },


    startGame: function() {
        this.handle('startGame');
    },
    nextStage: function() {
        this.handle('nextStage');
    },
} );

const getUnassignedPeople = () => {
    for (let i = 0; i < personList.length; i++) {
        if (!personList[i].controller.isSeated()) {
            unassignedPeople.push(personList[i]);
        }
    }
}


export {gameFSM};
