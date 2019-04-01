import {mlLabStageContainer} from '../../../controllers/game/gameSetup.js';
import {cvCollection} from '../../../assets/text/cvCollection.js';
import {uv2px, px2uv} from '../../../controllers/common/utils.js';
import EVENTS from '../../../controllers/constants/events';
import {eventEmitter} from '../../../controllers/game/gameSetup.js';
import MLPerson from './person';

export default class {
    constructor() {
        this.container = new PIXI.Container();
        this.numOfPeople = Math.floor(uv2px(0.85, 'w')/70);
        console.log(this.numOfPeople);
        this.personCount = 0;
        this.peopleLine = [];
        this.personXoffset = 70;
        this._createPeople();
    }

    draw() {
        this.container.x = uv2px(0.15, 'w');
        this.container.y = uv2px(0.96, 'h');
        mlLabStageContainer.addChild(this.container);
    }

    _createPeople() {
        for (let i = 0; i < this.numOfPeople; i++) {
            this._addNewPerson();
        }
    }

    _addNewPerson() {
        const person = new MLPerson({
            parent: this.container,
            x: this.personCount*this.personXoffset,
            personData: cvCollection.smallOfficeStage[this.personCount],
            id: this.personCount,
        });
        person.draw();
        this.peopleLine.push(person);
        this.personCount++;
    }

    createTween() {
        const tween = PIXI.tweenManager.createTween(this.container);
        tween.from({x: this.container.x}).to({x: this.container.x-this.personXoffset});
        tween.delay = 200;
        tween.time = 700;
        return tween;
    }

    recalibrateTween(tween) {
        tween.from({x: this.container.x}).to({x: this.container.x-this.personXoffset});
    }

    getFirstPerson() {
        return this.peopleLine.length > 0 ? this.peopleLine[0] : undefined;
    }

    getCount() {
        return this.peopleLine.length;
    }

    evaluateFirstPerson() {
        const status = Math.random() < 0.5 ? 'accepted' : 'rejected';
        eventEmitter.emit(EVENTS.DATASET_VIEW_NEW_CV, {
            status: status,
            data: this.peopleLine[0].getData(),
        });
        this.removeFirstPerson();
        this._addNewPerson();
        return status;
    }

    removeFirstPerson() {
        this.peopleLine[0].removeFromLine();
        this.peopleLine = this.peopleLine.slice(1);
    }
}
