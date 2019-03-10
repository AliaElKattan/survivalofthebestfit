import {bluePersonTexture} from '../../../controllers/common/textures.js';

export default class {
    constructor({x, parent}) {
        this.person = new PIXI.Sprite(bluePersonTexture);
        this.x = x;
        this.parentContainer = parent;
        // console.log(parentContainer);
    }

    draw() {
        this.person.scale.set(0.2);
        this.person.x = this.x;
        this.person.y = - this.person.height/2;
        this.person.anchor.set(0.5);
        this.parentContainer.addChild(this.person);
    }
}


