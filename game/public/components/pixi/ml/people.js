import {mlLabStageContainer} from '../../../controllers/game/gameSetup.js';
import {cvCollection} from '../../../assets/text/cvCollection.js';
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
        mlLabStageContainer.addChild(this.container);
    }

    _createPeople() {
        for (let i = 0; i < this.numOfPeople; i++) {
            const person = new MLPerson({
                parent: this.container,
                x: i*this.personXoffset,
                personData: cvCollection.smallOfficeStage[i],
                id: i,
            });
            person.draw();
            this.peopleLine.push(person);
        }
    }

    getFirstPerson() {
        return this.peopleLine.length > 0 ? this.peopleLine[0] : undefined;
    }

    evaluateFirstPerson() {
        this.people[0].status = Math.random() < 0.5 ? 'accepted' : 'rejected';
        this.people.removeFirstPerson();
    }

    removeFirstPerson() {
        this.peopleLine = this.peopleLine.slice(1);
    }
}
