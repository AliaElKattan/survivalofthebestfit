import {bluePersonTexture} from '../../../controllers/common/textures.js';

export default class {
    constructor({x, parent, id}) {
        this.person = new PIXI.Sprite(bluePersonTexture);
        this.x = x;
        this.parentContainer = parent;
        this.id = id;
    }

    draw() {
        this.person.scale.set(0.2);
        this.person.x = this.x;
        this.person.y = - this.person.height/2;
        this.person.id = this.id;
        this.person.anchor.set(0.5);
        this.person.on('mouseover', onPersonHover);
        this.parentContainer.addChild(this.person);
    }
}

function onPersonHover(event) {
    eventEmitter.emit('ml-person-hovered', {});
    candidateInScope = this.id;
    console.log("Current Candidate ID: " + candidateInScope);
}