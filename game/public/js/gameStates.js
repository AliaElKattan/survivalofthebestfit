import { pixiApp, eventEmitter, animateTo, beltContainer } from './shared.js';
import { createPerson } from './office/person.js';
import { Office } from './office/office.js';
import { incubator } from './textures.js';
import { TextBox }  from './common/instructionBubble.js';
import { startTaskTimer } from './common/taskTimer.js';
import { CVViewer } from './common/cvViewer.js';
import { cvCollection } from '../assets/cvCollection.js';

import {xIcon} from './textures.js';
import {beltTexture, doorTexture} from './textures.js';

var office;
var personList, personList2;

var gameFSM = new machina.Fsm( {

    namespace: "game-fsm",
    initialState: "stageFour",

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
                office = new Office();
                personList = []

                //create People in the office
                var x = 100;
                var y = pixiApp.screen.height - 60;
                for (var i = 0; i < 12; i++) {
                    var person = createPerson(x, y, office);
                    personList.push(person);
                    x += 50
                }

                // var messagebox2 = new TextBox();
                // messagebox2.drawBox(70,-150,"sample text sample text sample text ");

                // var messagebox2 = new TextBox();
                // messagebox2.drawBox(300,-150,"sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text sample text ");

                startTaskTimer(150, 50, 210, 100, txt.stageOne.taskDescription, 140);
                var cvViewer = new CVViewer(550, 100, 160, 200, cvCollection.cvFeatures, cvCollection.stageOne);
            },

            nextStage: "stageTwo",

            _onExit: function() {

            }
        },

        /*///////////////////
        // Big office, city level view
        *////////////////////
        stageTwo: {
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

            nextStage: "stageFour",

            _onExit: function() {

            }
        },

        stageFour: {

          _onEnter: function(){

              var messagebox2 = new TextBox();
              messagebox2.drawBox(70,-150,"machine learning stage");


              //conveyorBelt


              //create People in the office

              personList2 = []

              var x = 350;
              var y = pixiApp.screen.height - 90;


              for (var i = 0; i < 12; i++) {
                  var person = createPerson(x, y, office);
                  personList2.push(person);
                  x += 50
              }



              var belt_y =  (pixiApp.screen.height)/2 - (pixiApp.screen.height/8);
              var belt_x = (pixiApp.screen.height)/2;

              for (var j = 0; j<4;j++) {
                  var belt = new PIXI.Sprite(beltTexture);
                  belt.scale.set(.3);
                  belt.y = belt_y;
                  belt.x = belt_x + (160* j)  ;

                  //beltList.push(belt);
                  pixiApp.stage.addChild(belt);
              }


          },



        }




    },




    startGame: function(){
        this.handle('startGame')
    },
    nextStage: function(){
        this.handle('nextStage')
    }
} );

export { gameFSM };
