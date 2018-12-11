import { personTexture } from './textures.js'
import { pixiApp, personContainer, deskContainer } from './shared.js';

class personController {
  constructor(parent, office) {
    this.parent = parent;
    this.office = office;
  }
}

function onPersonDragStart(event) {
  this.data = event.data;
  this.origX = this.x;
  this.origY = this.y;
  this.alpha = 0.5;
  this.dragging = true;

  //ToDo: person leaving a desk

}

//BUG: double click outside the app on text and click on character and drag it around. This can cause a lot of issues.
function onPersonDragEnd() {
  var hitDesk = pixiApp.renderer.plugins.interaction.hitTest(new PIXI.Point(this.x, this.y), deskContainer);
  if (hitDesk == null || hitDesk.taken){
    this.x = this.origX;
    this.y = this.origY;
  } else {
    this.x = hitDesk.x+hitDesk.height/2;
    this.y = hitDesk.y+hitDesk.width/2;
    hitDesk.taken = true;
    sendAssigned();
  }
  this.alpha = 1;
  this.dragging = false;
  this.data = null;
}

function onPersonDragMove() {
  if (this.dragging) {
    this.x += this.data.originalEvent.movementX;
    this.y += this.data.originalEvent.movementY;
  }
}

function sendAssigned(){
  postal.publish({
	    channel: "desks",
	    topic: "assign",
	    data: {
	        x: "nothing",
	        y: "nothing"
	    }
	});
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
