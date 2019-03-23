import * as PIXI from 'pixi.js';
import Resume from './cv';
import {uv2px} from '../../../controllers/common/utils.js';
import {mlLabStageContainer} from '../../../controllers/game/gameSetup';
import {getScale} from '../../../controllers/common/utils.js';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';
import EVENTS from '~/public/controllers/constants/events.js';


export default class {
    constructor(options) {
        this.numOfResumes = options.num || 15; // TODO fix that
        this.resumeXOffset = uv2px(1/this.numOfResumes, 'w');
        this.resumeList = [];
        this.resumeContainer = new PIXI.Container();
        this.resumeContainer.type = 'resumeContainer';
        this.resumeContainer.x = options.x || 20;
        this.resumeContainer.y = options.y;
        eventEmitter.on(EVENTS.RESIZE, this.draw.bind(this));
    }

    draw() {
        mlLabStageContainer.removeChild(this.resumeContainer);
        for (let j = this.resumeList.length - 1; j >= 0; j--) {
            this.resumeList[j].destroy();
        }

        for (let i = 0; i < this.numOfResumes; i++) {
            const resume = new Resume({
                parent: this.resumeContainer,
                x: i*this.resumeXOffset + uv2px(.02, 'w'),
                y: 0,
                scale: getScale('RESUME'),
            });
            this.resumeList.push(resume);
        }
        mlLabStageContainer.addChild(this.resumeContainer);
    }

    createTween() {
        const tween = PIXI.tweenManager.createTween(this.resumeContainer);
        tween.from({x: this.resumeContainer.x}).to({x: this.resumeContainer.x+this.resumeXOffset});
        tween.delay = 300;
        tween.time = 700;
        return tween;
    }

    destroy() {
        for (let i = this.resumeList.length - 1; i >= 0; i--) {
            this.resumeList[i].destroy();
        }
        mlLabStageContainer.removeChild(this.resumeContainer);
    }
}
