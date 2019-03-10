import {pixiApp, eventEmitter} from '../../controllers/game/gameSetup.js';
import {bluePersonTexture} from '../../controllers/common/textures.js';
import {uv2px} from '../../controllers/common/utils.js';
import {Office} from './office';

class PersonController {
    constructor(parent, office) {
        this.parent = parent;
        this.office = office;
        this.desk = null;
    }

    setDesk(desk) {
        this.desk = desk;
    }

    isSeated() {
        return this.desk != null;
    }
}

/*eslint-disable */
function onPersonDragStart(event) {
    /* 
    first block executed when person is clicked
    */
    eventEmitter.emit('person-clicked', {});
    candidateInScope = this.id;
    console.log("GLOBAL Candidate id: " + candidateInScope);

    /* 
    second block executed when person is dragged
    */
    if (this.controller.isSeated()) {
        this.dragging = false;
        return;
    }
    this.data = event.data;
    this.origX = this.x;
    this.origY = this.y;
    this.alpha = 0.5;
    this.dragging = true;
}


function onPersonDragEnd() {
    if (this.dragging) {
        let hitDesk = null;
        // going through each floor and checking if the person overlaps with any of the desks
        this.controller.office.container.children.some((floor) => {
            hitDesk = pixiApp.renderer.plugins.interaction.hitTest(new PIXI.Point(this.x, this.y), floor);
            if (hitDesk !== null && hitDesk.type === 'desk' && !hitDesk.isTaken) {
                this.scale.set(this.scale.x*(1/hitDesk.scale.x));
                this.controller.setDesk(hitDesk);
                this.x = 0;
                this.y = 0;

                hitDesk.addChild(this);
                sendAssigned();
                
                return true;
            }
        });

        if (hitDesk === null) {
            this.x = this.origX;
            this.y = this.origY;
        }
        this.dragging = false;
        this.data = null;
        this.alpha = 1;
    }
}
function onPersonDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}
/* eslint-enable */

function sendAssigned() {
    eventEmitter.emit('assigned-desk', {});
}

function createPerson(x, y, office, id, texture) {
    const person = new PIXI.Sprite(texture);
    person.controller = new PersonController(person, office);
    const scale = office instanceof Office ? office.getScale() : 1;
    person.scale.set(0.15 * scale);
    person.interactive = true;
    person.buttonMode = true;
    person.id = id;
    person.x = uv2px(x, 'w');
    person.y = uv2px(y, 'h');
    person.type = 'person';
    person.anchor.set(0.5);
    person
        .on('pointerupoutside', onPersonDragEnd)
        .on('pointerdown', onPersonDragStart)
        .on('pointermove', onPersonDragMove)
        .on('pointerup', onPersonDragEnd);

    office.personContainer.addChild(person);
    return person;
}

export {createPerson};
