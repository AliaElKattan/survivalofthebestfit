import { floorPlanOne, floorPlanTwo } from '../textures.js';
import { officeContainer, eventEmitter } from '../shared.js';
import { gameFSM } from '../gameStates.js';
import { createDesk } from './desk.js';

class Office {
  constructor() {
    this.sizeConfig = [
      {row: 4, col: 4, width: 300, height: 300, offsetX: 50, offsetY: 50, scale: 1, texture: floorPlanOne},
      {row: 6, col: 8, width: 300, height: 300, offsetX: 50, offsetY: 50, scale: 0.5, texture: floorPlanTwo}
    ]
    this.takenDesks = 0;
    this.deskList = [];
    this.size = 0;
    this.growOffice();
    this.listenerSetup();
  }

  growOffice(){
    // getting config according to office size
    var row = this.sizeConfig[this.size].row,
    col = this.sizeConfig[this.size].col,
    scale = this.sizeConfig[this.size].scale,
    width = this.sizeConfig[this.size].width,
    height = this.sizeConfig[this.size].height,
    offsetY = this.sizeConfig[this.size].offsetY,
    offsetX = this.sizeConfig[this.size].offsetX;

    //creating office floor background
    if (this.size > 0){
      this.texture.parent.removeChild(this.texture);
    }
    this.texture = new PIXI.Sprite(this.sizeConfig[this.size].texture);
    this.texture.type = "office";
    this.texture.scale.set(0.7);
    this.texture.x = offsetX;
    this.texture.y = offsetY;
    officeContainer.addChild(this.texture);
    this.texture.parent.setChildIndex(this.texture, 0);

    //adding/moving desks and people at them
    var indx = 0;
    var y = offsetY;
    for (var i = 0; i < row; i++) {
      var x = offsetX;
      for (var k = 0; k < col; k++) {
        if (this.deskList.length > indx){
          this.deskList[indx].controller.animateTo(scale, x, y);
        } else {
          this.deskList.push(createDesk(scale, x, y));
        }
        x += width/(row-1);
        indx++;
      }
      y += height/(col-1);
    }

    this.size++;
  }

  listenerSetup(){
    eventEmitter.on('assigned-desk', (data)=>{
      this.takenDesks += 1
      if (this.takenDesks == 3){
        gameFSM.nextStage();
    }})
  }
}

export { Office };
