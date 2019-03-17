import {bluePersonTexture} from '../../../controllers/common/textures.js';
import {yellowPersonTexture} from '../../../controllers/common/textures.js';

export default class {
    constructor({x, parent, personData}) {
        this.personData = personData;
        this.person = this.personData.color === 'yellow' ? new PIXI.Sprite(yellowPersonTexture) : new PIXI.Sprite(bluePersonTexture);
        this.x = x;
        this.parentContainer = parent;
    }

    draw() {
        this.person.scale.set(0.2);
        this.person.x = this.x;
        this.person.y = - this.person.height/2;
        this.person.anchor.set(0.5);
        this.parentContainer.addChild(this.person);
    }

    getData() {
        return this.personData;
    }
}


