import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
import {pixiApp} from '../../controllers/game/gameSetup';
import {officeContainer, eventEmitter} from '../../controllers/game/gameSetup.js';
import {gameFSM} from '../../controllers/game/stateManager.js';
import {uv2px, spacingUtils as space, animateTo} from '../../controllers/common/utils.js';
import {beltTexture, doorTexture, cvTexture} from '../../controllers/common/textures.js';
import {createPerson} from './person.js';
import {cvCollection} from '../../assets/text/cvCollection.js';
import ResumeUI from '../interface/ui-resume/ui-resume';



class MlOffice {
    constructor() {
        // this.sizeConfig = [
        //     {row: 1, col: 5, width: uv2px(0.8,'w'), height: 300, offsetX: 30, offsetY: 50, scale: 1},
        //     {row: 1, col: 15, width: uv2px(0.8,'w'), height: 300, offsetX: 30, offsetY: 30, scale: 0.7},
        //     {row: 2, col: 15, width: uv2px(0.8,'w'), height: 300, offsetX: 30, offsetY: 20, scale: 0.5},
        //     //{row: 8, col: 12, width: 300, height: 300, offsetX: 50, offsetY: 50, scale: 0.7}
        // ]
        // this.takenDesks = 0;

        this.size = 0;
        this.scale = 1;

        const coorObj = uv2px({x: 1, y: 0.5}); // if you prefer objects

        // first office floor
        this.drawFloor(uv2px(0.5, 'h'));

        // ground floor/
        this.drawFloor(space.absMinusSize(40, 'h'));

        // this.growOffice();
        // this.listenerSetup();
    }

    // drawBelt() {
    //               //door
    //               var door = new PIXI.Sprite(doorTexture);
    //               door.x = uv2px(0.18, 'w');
    //               door.y = uv2px(0.65, 'h');
    //               door.scale.set(.55);
    //               officeContainer.addChild(door);
    //
    //
    //               var beltY =  (PIXI.pixiApp.screen.height)/2 - (this.pixiApp.screen.height/8);
    //             //  var beltX = (pixiApp.screen.width)/4);
    //               var beltX = uv2px(0.175,'w');
    //               var beltXOffset = uv2px(0.12,'w');
    //
    //
    //               for (var j = 0; j<5;j++) {
    //                   var belt = new PIXI.Sprite(beltTexture);
    //                   belt.scale.set(.3);
    //                   belt.y = beltY;
    //                   belt.x = beltX + (beltXOffset* j)  ;
    //
    //                   //beltList.push(belt);
    //                   officeContainer.addChild(belt);
    //               }
    //
    //               //cvs on belt
    //               for (var x = 0; x<10;x++) {
    //                   var cv = new PIXI.Sprite(cvTexture);
    //                   cv.scale.set(.4);
    //                   cv.y = beltY;
    //                   cv.x = beltX + (beltXOffset* x)/2 ;
    //
    //                   //beltList.push(belt);
    //                   officeContainer.addChild(cv);
    //               }
    //
    //
    //             }

    drawFloor(y) {
        // main floor
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(0xffd9d9);
        this.surface.drawRect(0, 0, uv2px(1, 'w'), 40);
        this.surface.endFill();
        this.surface.x = 0;
        this.surface.y = y;

        // dark pink side of the floor
        this.side = new PIXI.Graphics();
        this.side.beginFill(0xef807f);
        this.side.drawRect(0, 0, uv2px(1, 'w'), 20);
        this.side.endFill();
        this.side.x = 0;
        this.side.y = y+40;

        officeContainer.addChild(this.surface);
        officeContainer.addChild(this.side);
    }
}

function createMlOffice() {
    // var messagebox2 = new TextBox();
    // messagebox2.drawBox(70,-150,"machine learning stage",false);

    // conveyorBelt

    // ////
    // will organize this code later


    // create People in the office


    const office2 = new MlOffice();

    const personList2 = [];

    // create People in the office
    let x = uv2px(0.12, 'w');
    const xOffset = uv2px(0.05, 'w');
    const y = uv2px(0.85, 'h');

    for (let i = 0; i < 16; i++) {
        const person = createPerson(x, y, office2);
        person.interactive = false;
        person.button = false;
        personList2.push(person);
        x += xOffset;
    }

    // door
    const door = new PIXI.Sprite(doorTexture);
    door.x = uv2px(0.03, 'w');
    door.y = uv2px(0.69, 'h');
    door.scale.set(.55);
    pixiApp.stage.addChild(door);


    //  var beltY =  (pixiApp.screen.height)/2 - (pixiApp.screen.height/8);
    const beltY = uv2px(.38, 'h');
    //  var beltX = (pixiApp.screen.width)/4);

    const beltX = uv2px(0., 'w');
    const beltXOffset = uv2px(0.165, 'w');


    for (let j = 0; j<6; j++) {
        const belt = new PIXI.Sprite(beltTexture);
        belt.scale.set(.4);
        belt.y = beltY;
        belt.x = beltX + (beltXOffset* j);
        // beltList.push(belt);
        pixiApp.stage.addChild(belt);
    }

    let cvList = [];

    const cvXOffset = uv2px(0.165, 'w');

    // cvs on belt
    for (let x = 0; x<12; x++) {
        const cv = new PIXI.Sprite(cvTexture);
        cv.scale.set(.4);
        cv.y = beltY;
        cv.x = beltX + (cvXOffset* x)/2;

        cvList[x] = cv;

        // beltList.push(belt);
        pixiApp.stage.addChild(cv);
    }
    const resumeUI_ml = new ResumeUI({show: true, features: cvCollection.cvFeatures, scores: cvCollection.smallOfficeStage});
}


export {createMlOffice};
