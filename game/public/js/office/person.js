import { personTexture } from '../textures.js'
import { pixiApp, officeContainer, personContainer, deskContainer, eventEmitter } from '../shared.js';

class personController {
  constructor(parent, office) {
    this.parent = parent;
    this.office = office;
    this.desk = null;
  }

  setDesk(desk){
    this.desk = desk;
  }

  isSeated(){
    return this.desk != null;
  }

  animateTo(scale=1, x=this.parent.x, y=this.parent.y){
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
    }

}

function onPersonDragStart(event) {
  if (this.controller.isSeated()){
    //ToDo: replace this with person leaving a desk. Remove from desk object, and decrease office fullness counter
    this.dragging = false;
    return
  }
  this.data = event.data;
  this.origX = this.x;
  this.origY = this.y;
  this.alpha = 0.5;
  this.dragging = true;
}

//BUG: double click outside the app on text and click on character and drag it around. This can cause a lot of issues.
//BUG: sometimes if people are overlapping, it thinks the bottom one was dropped and it pops the guy back to the original position

function onPersonDragEnd() {
  if (this.dragging) {
    var hitDesk = pixiApp.renderer.plugins.interaction.hitTest(new PIXI.Point(this.x, this.y), deskContainer);
    if (hitDesk == null || hitDesk.controller.isTaken()){
      this.x = this.origX;
      this.y = this.origY;
    } else {
      this.x = hitDesk.x+hitDesk.height/2;
      this.y = hitDesk.y+hitDesk.width/2;
      hitDesk.controller.setPerson(this);
      this.controller.setDesk(hitDesk);
      sendAssigned();
    }
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }
}

function onPersonDragMove() {
  if (this.dragging) {
    this.x += this.data.originalEvent.movementX/officeContainer.scale.x;
    this.y += this.data.originalEvent.movementY/officeContainer.scale.y;
  }
}

function sendAssigned(){
  eventEmitter.emit('assigned-desk', {});
}

function createPerson(x, y, office){
  var person = new PIXI.Sprite(personTexture);
  person.controller = new personController(person, office);
  person.interactive = true;
  person.buttonMode = true;
  person.type = "person";
  person.anchor.set(0.5);
  person.scale.set(0.5);
  person.x = x;
  person.y = y;
  person
      .on('pointerdown', onPersonDragStart)
      .on('pointerup', onPersonDragEnd)
      .on('pointerupoutside', onPersonDragEnd)
      .on('pointermove', onPersonDragMove);

  personContainer.addChild(person);
  return person
}

export { createPerson };
