import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
import { officeContainer, eventEmitter, animateTo } from '../../controllers/game/gameSetup.js';
import { gameFSM } from '../../controllers/game/stateManager.js';
import { uv2px, spacingUtils as space} from '../../controllers/common/utils.js';
import {beltTexture, doorTexture, cvTexture} from '../../controllers/common/textures.js';


class MLOffice {
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

        var coorObj = uv2px({x: 1, y: 0.5}); // if you prefer objects

        //first office floor
        this.drawFloor(uv2px(0.5,'h'));

        //ground floor/
        this.drawFloor(space.absMinusSize(40,'h'));

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
    //               var belt_y =  (PIXI.pixiApp.screen.height)/2 - (this.pixiApp.screen.height/8);
    //             //  var belt_x = (pixiApp.screen.width)/4);
    //               var belt_x = uv2px(0.175,'w');
    //               var belt_xOffset = uv2px(0.12,'w');
    //
    //
    //               for (var j = 0; j<5;j++) {
    //                   var belt = new PIXI.Sprite(beltTexture);
    //                   belt.scale.set(.3);
    //                   belt.y = belt_y;
    //                   belt.x = belt_x + (belt_xOffset* j)  ;
    //
    //                   //beltList.push(belt);
    //                   officeContainer.addChild(belt);
    //               }
    //
    //               //cvs on belt
    //               for (var x = 0; x<10;x++) {
    //                   var cv = new PIXI.Sprite(cvTexture);
    //                   cv.scale.set(.4);
    //                   cv.y = belt_y;
    //                   cv.x = belt_x + (belt_xOffset* x)/2 ;
    //
    //                   //beltList.push(belt);
    //                   officeContainer.addChild(cv);
    //               }
    //
    //
    //             }

    drawFloor(y) {
        //main floor
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(0xffd9d9);
        this.surface.drawRect(0, 0, uv2px(1,'w'), 40);
        this.surface.endFill();
        this.surface.x = 0;
        this.surface.y = y;

        //dark pink side of the floor
        this.side = new PIXI.Graphics();
        this.side.beginFill(0xef807f);
        this.side.drawRect(0, 0, uv2px(1,'w'), 20);
        this.side.endFill();
        this.side.x = 0;
        this.side.y = y+40;

        officeContainer.addChild(this.surface);
        officeContainer.addChild(this.side);
    }


}

export { MLOffice };
