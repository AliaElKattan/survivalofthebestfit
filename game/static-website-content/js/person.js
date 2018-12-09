import { personTexture } from './textures.js'

class personController {
  constructor(parent, office) {
    this.parent = parent;
    this.office = office;
  }

  assignDesk(){
    return this.office.assignDesk(this.parent.x, this.parent.y);
  }

  leaveDesk(){
    this.office.leaveDesk(this.parent.x, this.parent.y);
  }
}

function onPersonDragStart(event) {
  this.data = event.data;
  this.orig_pos = this.data.getLocalPosition(this.parent);
  this.alpha = 0.5;
  this.dragging = true;
}

function onPersonDragEnd() {
  if (this.dragging){
    var desk = this.controller.assignDesk();
    if (desk == null){
      this.x = this.orig_pos.x;
      this.y = this.orig_pos.y;
    } else {
      this.x = desk.x+50;
      this.y = desk.y+50;
    }
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }
}

function onPersonDragMove() {
  if (this.dragging) {
    this.x += this.data.originalEvent.movementX;
    this.y += this.data.originalEvent.movementY;
  }
}

function createPerson(x, y, office){
  var person = new PIXI.Sprite(personTexture);
  person.controller = new personController(person, office);
  person.interactive = true;
  person.buttonMode = true;
  person.anchor.set(0.5);
  person.scale.set(0.5);
  person.x = x;
  person.y = y;
  person
      .on('pointerdown', onPersonDragStart)
      .on('pointerup', onPersonDragEnd)
      .on('pointerupoutside', onPersonDragEnd)
      .on('pointermove', onPersonDragMove);
  return person
}

export { createPerson };
