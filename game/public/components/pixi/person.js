import {pixiApp, eventEmitter} from '../../controllers/game/gameSetup.js';
import {bluePersonTexture} from '../../controllers/common/textures.js';
import {uv2px} from '../../controllers/common/utils.js';
import {Office, spotlight} from './office';

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

function onPersonHover(event) {
    eventEmitter.emit('person-hovered', {});
    candidateHovered = this.id;
}
/*eslint-disable */
function onPersonDragStart(event) {
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

function moveCandidate() {
    if (!this.inSpotlight && spotOpen) {
        this.position.x = spotlight.x;
        this.position.y = spotlight.y;
        spotOpen = false;
        this.inSpotlight = true;
        candidateInSpot = this.id;
    }
    else if (this.inSpotlight) {
        this.position.x = this.originalX;
        this.position.y = this.originalY;
        spotOpen = true;
        this.inSpotlight = false;
        candidateInSpot = null;
    }
}

function createPerson(x, y, office, id, texture) {
    const person = new PIXI.Sprite(texture);
    person.controller = new PersonController(person, office);
    person.scale.set(0.2);
    person.interactive = true;
    person.buttonMode = true;
    person.inSpotlight = false;
    person.id = id;
    person.x = uv2px(x, 'w');
    person.y = uv2px(y, 'h');
    person.originalX = person.x;
    person.originalY = person.y;
    person.type = 'person';
    person.anchor.set(0.5);
    person.tween = PIXI.tweenManager.createTween(person);
    person
        .on('mouseover', onPersonHover)
        // .on('pointerupoutside', onPersonDragEnd)
        .on('pointerdown', moveCandidate)
        // .on('pointermove', onPersonDragMove)
        // .on('pointerup', onPersonDragEnd);

    office.personContainer.addChild(person);
    return person;
}

export {createPerson};
