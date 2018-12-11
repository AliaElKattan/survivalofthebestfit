import { deskTexture } from './textures.js'
import { pixiApp } from './shared.js';
import { createDesk } from './desk.js';

class Office {
  constructor() {
    this.deskList = [];
    this.listenAssign();
  }

  addDesk(x, y){
      this.deskList.push(createDesk(x, y));
  }

  listenAssign(){
    var subscription = postal.subscribe({
  		channel: "desks",
  		topic: "assign",
  		callback: function(data, envelope) {
  		    console.log("desk assigned")
  		}
  	});
  }
}

export { Office };
