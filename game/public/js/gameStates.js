import { pixiApp, eventEmitter } from './shared.js';
import { createPerson } from './office/person.js';
import { Office } from './office/office.js';
import { incubator } from './textures.js';

var office;
var personList;

var gameFSM = new machina.Fsm( {
    namespace: "game-fsm",
    //initialState: "uninitialized",
    initialState: "stageOne",

    states: {
        uninitialized: {
          startGame: function() {
            this.transition( "stageZero" );
          }
        },

        stageZero: {
          _onEnter: function(){
            this.timer = setTimeout( function() {
              this.handle( "timeout" );
            }.bind( this ), 3000 );

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

        stageOne: {
          _onEnter: function(){
            office = new Office(4, 4, 300, 300, 50, 50, 0.10);
            personList = []

            //create People in the office
            var x = 10;
            var y = pixiApp.screen.height - 100;
            for (var i = 0; i < 10; i++) {
              var person = createPerson(x, y, office);
              personList.push(person);
              x += 80
            }
          },
          _onExit: function() {

          }
        },

        stageTwo: {
          _onEnter: function(){

          },
          _onExit: function() {

          }
        }
      },

      startGame: function(){
        this.handle('startGame')
      }
} );

export { gameFSM };
