import { deskTexture } from './textures.js'
import { pixiApp, officeContainer, eventEmitter } from './shared.js';
import { createDesk } from './desk.js';

class Office {
  constructor(row, col, width, height, offsetX, offsetY, scale) {
    this.deskList = [];
    this.newDeskGrid(row, col, width, height, offsetX, offsetY, scale);
    this.index = 0
    this.listenerSetup();
    this.takenDesks = 0;

  }

  newDeskGrid(row, col, width, height, offsetX, offsetY, scale){
    var x = offsetX;
    var y = offsetY;
    var indx = 0
    for (var i = 0; i < row; i++) {
      var x = offsetX;
      for (var k = 0; k < col; k++) {
        if (this.deskList.length > indx){
          this.deskList[indx].controller.animateTo(x,y,scale);
        } else {
          this.deskList.push(createDesk(x, y, scale));
        }
        x += width/(row-1)
        indx += 1;
      }
      y += height/(col-1)
    }
  }

  listenerSetup(){
    eventEmitter.on('assigned-desk', (data)=>{
      this.takenDesks += 1
      if (this.takenDesks == 3){
        this.newDeskGrid(4,4,100,100,50,50,0.5);
    }})
  }

}

export { Office };
