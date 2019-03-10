import {pixiApp, eventEmitter} from '../../../controllers/game/gameSetup.js';
import {bluePersonTexture} from '../../../controllers/common/textures.js';
import {uv2px} from '../../../controllers/common/utils.js';
import MLPerson from './person';

export default class {
    constructor() {
        this.container = new PIXI.Container();
        this.numOfPeople = 15;
        this.peopleLine = [];
        this.personXoffset = 70;
        this._createPeople();
    }

    draw() {
        this.container.x = uv2px(0.15, 'w');
        this.container.y = uv2px(0.96, 'h');
        console.log(this.container);
        pixiApp.stage.addChild(this.container);
    }

    _createPeople() {
        for (let i = 0; i < this.numOfPeople; i++) {
            const person = new MLPerson({
                parent: this.container,
                x: i*this.personXoffset,
            });
            person.draw();
            this.peopleLine.push(person);
        }
    }
}
