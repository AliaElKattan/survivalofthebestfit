import * as PIXI from 'pixi.js';
import Resume from './cv';
import {uv2px} from '../../../controllers/common/utils.js';
import {pixiApp} from '../../../controllers/game/gameSetup';

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
        // console.log(this._resumeContainer);
        pixiApp.stage.addChild(this._resumeContainer);
        this.animate();
        // this.resumeList.forEach((resume) => {
        //     resume.draw();
        //     resume.animate();
        //     // setTimeout(resume.animate(), 2000);
        // });
    }

    animate() {
        console.log('animate cv container!');
        const tween = PIXI.tweenManager.createTween(this._resumeContainer);
        tween.from({x: this._resumeContainer.x}).to({x: this._resumeContainer.x+this.resumeXOffset});
        tween.time = 500;
        tween.on('start', () => {
            // console.log('tween started');
        });
        tween.on('end', () => {
            // console.log('tween stopped');
            console.log(this._resumeContainer.x);
            tween.reset();
            // tween.start();
        });
        tween.start();
        // tween.repeat = 20;
        // setTimeout(tween.start(), 1000);
        // setTimeout(tween.start(), 3000);
        // animateTo({target: this.cv, x: 100, y: 0, easing: PIXI.tween.Easing.inExpo()});
    }

    _initalizeResumes() {
        for (let i = 0; i < this.numOfResumes; i++) {
            const resume = new Resume({
                parent: this._resumeContainer,
                // x: this.xAnchor + i*this.resumeXOffset,
                // y: this.yAnchor,
                x: i*this.resumeXOffset,
                y: 0,
            });
            // this._resumeContainer.addChild(resume);
            this.resumeList.push(resume);
        }
    }
}

