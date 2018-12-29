import { deskTexture } from '../textures.js'
import { deskContainer } from '../shared.js';

class deskController {
  constructor(parent) {
    this.parent = parent;
    this.person = null;
  }

  setPerson(person){
    this.person = person;
  }

  removePerson(){
    return;
  }

  getPerson(){
    return this.person
  }

  isTaken(){
    return this.person != null;
  }

  animateTo(scale, x, y){
    var tween = PIXI.tweenManager.createTween(this.parent);
      tween.easing = PIXI.tween.Easing.inElastic();
      tween.time = 2000;
      tween.expire = true;
      tween.from({
        'x' : this.parent.x,
        'y' : this.parent.y,
        'scale' : {'x': this.parent.scale.x, 'y': this.parent.scale.y}
      })
      tween.to({
        'x' : x,
        'y' : y,
        'scale' : {'x': this.parent.scale.x*scale, 'y': this.parent.scale.y*scale}
      }).start();

    //if a person sits at the desk, it has to go with the desk
    if (this.isTaken()){
      this.getPerson().controller.animateTo(scale, x, y);
    }
  }
}

function createDesk(scale, x, y){
  var desk = new PIXI.Sprite(deskTexture);
  desk.x = x
  desk.y = y
  desk.type = "desk";
  desk.taken = false;
  desk.scale.set(0.1*scale);
  desk.interactive = true;
  desk.controller = new deskController(desk)

  deskContainer.addChild(desk);
  return desk
}

export { createDesk };
