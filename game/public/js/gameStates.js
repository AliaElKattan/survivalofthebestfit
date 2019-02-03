// import txt from '../assets/textTemplate.js'
import { pixiApp, eventEmitter, animateTo } from './shared.js';
import { createPerson } from './office/person.js';
import { Office } from './office/office.js';
import { incubator } from './textures.js';
import { TextBox }  from './common/instructionBubble.js';
import { startTaskTimer } from './common/taskTimer.js';
import { CVViewer } from './common/cvViewer.js';
import { cvCollection } from '../assets/cvCollection.js';
import { uv2px } from './common/utils.js';

import {xIcon} from './textures.js';

var office;
var personList;

var gameFSM = new machina.Fsm( {
    namespace: "game-fsm",
    initialState: "stageOne",

    states: {
        uninitialized: {
            startGame: function() {
                this.transition( "stageZero" );
            }
        },

        /*///////////////////
        // Welcome image
        *////////////////////
        stageZero: {
            _onEnter: function(){
                this.timer = setTimeout( function() {
                    this.handle( "timeout" );
                }.bind( this ), 300 );

                this.image = new PIXI.Sprite(incubator);
                pixiApp.stage.addChild(this.image);
                this.image.scale.set(0.7)
            },

            timeout: "stageOne",

            _onExit: function() {
                clearTimeout( this.timer );
                this.image.parent.removeChild(this.image);
            }
        },

        /*///////////////////
        // Small office, hiring from the street
        *////////////////////
        stageOne: {
            _onEnter: function(){
                var stageOneOver = new TextBox(uv2px(0.5,'w'), uv2px(0.5,'h'), txt.stageOne.messageFromVc);
                
                office = new Office();
                personList = []

                eventEmitter.on('instructionAcked', (data) => {
                    
                    //create People in the office
                    var x = uv2px(0.12,'w');
                    var xOffset = uv2px(0.05,'w')
                    var y = uv2px(0.88,'h');

                    for (var i = 0; i < 12; i++) {
                        var person = createPerson(x, y, office);
                        personList.push(person);
                        x += xOffset
                    }

                    startTaskTimer(uv2px(0.7,'w'), uv2px(0.1,'h'), uv2px(0.22,'w'), uv2px(0.16,'h'), txt.stageOne.taskDescription, 140, 5);
                    var cvViewer = new CVViewer(uv2px(0.8,'w'), uv2px(0.62,'h'), uv2px(0.13,'w'), uv2px(0.32,'h'), cvCollection.cvFeatures, cvCollection.stageOne);
                });
            },

            nextStage: "stageTwo",

            _onExit: function() {

            }
        },

        /*///////////////////
        // Big office, city level view
        *////////////////////
        stageTwo: {
            _onEnter: function () {
                var stageOneOver = new TextBox(uv2px(0.5,'w'), uv2px(0.5,'h'), txt.stageTwo.messageFromVc);

                eventEmitter.on('instructionAcked', (data) => {
                    var unassignedPeople = []
                    for (var i = 0; i < personList.length; i++) {
                        if (!personList[i].controller.isSeated()) {
                            unassignedPeople.push(personList[i]);
                        }
                    }
                    office.growOffice(unassignedPeople);

                    startTaskTimer(uv2px(0.7, 'w'), uv2px(0.1, 'h'), uv2px(0.22, 'w'), uv2px(0.16, 'h'), txt.stageTwo.taskDescription, 140, 10);

                });

            },

            nextStage: "stageThree",

            _onExit: function() {

            }
        },

        /*///////////////////
        // Huge office, ccountry level view
        *////////////////////
        stageThree: {
            _onEnter: function(){
                var unassignedPeople = []
                for (var i = 0; i < personList.length; i++) {
                    if (!personList[i].controller.isSeated()){
                        unassignedPeople.push(personList[i]);
                    }
                }
                office.growOffice(unassignedPeople);
            },

            nextStage: "stageThree",

            _onExit: function() {

            }
        },


    },

    startGame: function(){
        this.handle('startGame')
    },
    nextStage: function(){
        this.handle('nextStage')
    }
} );

export { gameFSM };
