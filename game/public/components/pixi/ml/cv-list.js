import * as PIXI from 'pixi.js';
import Resume from './cv';
import {uv2px} from '../../../controllers/common/utils.js';
import {mlLabStageContainer} from '../../../controllers/game/gameSetup';

export default class {
    constructor(options) {
        this.xAnchor = options.x || 20;
        this.yAnchor = options.y;
        this.numOfResumes = options.num || 15; // TODO fix that
        this.resumeXOffset = uv2px(1/this.numOfResumes, 'w');
        this.resumeList = [];
        this._resumeContainer = new PIXI.Container();
        this._initalizeResumes();
    }

    draw() {
        this._resumeContainer.x = this.xAnchor;
        this._resumeContainer.y = this.yAnchor;
        mlLabStageContainer.addChild(this._resumeContainer);
    }

    createTween() {
        const tween = PIXI.tweenManager.createTween(this._resumeContainer);
        tween.from({x: this._resumeContainer.x}).to({x: this._resumeContainer.x+this.resumeXOffset});
        tween.delay = 300;
        tween.time = 700;
        return tween;
    }

    _initalizeResumes() {
        for (let i = 0; i < this.numOfResumes; i++) {
            const resume = new Resume({
                parent: this._resumeContainer,
                x: i*this.resumeXOffset,
                y: 0,
            });
            this.resumeList.push(resume);
        }
    }
}

