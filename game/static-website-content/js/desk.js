import { deskTexture } from './textures.js'
import { deskContainer } from './shared.js';

class deskController {
  constructor(parent) {
    this.parent = parent;
  }
}

function createDesk(x, y){
  var desk = new PIXI.Sprite(deskTexture);
  desk.x = x
  desk.y = y
  desk.type = "desk";
  desk.taken = false;
  desk.scale.set(0.12);
  desk.interactive = true;
  desk.controller = new deskController(desk)

  deskContainer.addChild(desk);
  return desk
}

export { createDesk };
