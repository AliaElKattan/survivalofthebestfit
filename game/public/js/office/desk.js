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

  animateTo(x, y, scale){
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
      var tween = PIXI.tweenManager.createTween(this.getPerson());
        tween.easing = PIXI.tween.Easing.inElastic();
        tween.time = 2000;
        tween.expire = true;
        tween.from({
          'x' : this.getPerson().x,
          'y' : this.getPerson().y,
          'scale' : {'x': this.getPerson().scale.x, 'y': this.getPerson().scale.y}
        })
        tween.to({
          'x' : x,
          'y' : y,
          'scale' : {'x': this.getPerson().scale.x*scale, 'y': this.getPerson().scale.y*scale}
        }).start();
    }
  }
}

function createDesk(x, y, scale){
  var desk = new PIXI.Sprite(deskTexture);
  desk.x = x
  desk.y = y
  desk.type = "desk";
  desk.taken = false;
  desk.scale.set(scale);
  desk.interactive = true;
  desk.controller = new deskController(desk)

  deskContainer.addChild(desk);
  return desk
}

export { createDesk };
