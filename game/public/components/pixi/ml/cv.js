import * as PIXI from 'pixi.js';
import {pixiApp} from '../../../controllers/game/gameSetup';
import {cvTexture} from '../../../controllers/common/textures.js';
import {animateTo} from '../../../controllers/common/utils.js';


export default class {
    constructor(options) {
        this.xAnchor = options.x;
        this.yAnchor = options.y;
        this.parent = options.parent || pixiApp.stage;
        this.scale = 0.4;
        this.texture = cvTexture;
        this.cv = null;
        this.draw();
    }

    draw() {
        this.cv = new PIXI.Sprite(cvTexture);
        this.cv.scale.set(this.scale);
        this.cv.y = this.yAnchor;
        this.cv.x = this.xAnchor;
        this.parent.addChild(this.cv);
        // pixiApp.stage.addChild(this.cv);
    }

    animate() {
        console.log('animate pixi!');
        const tween = PIXI.tweenManager.createTween(this.cv);
        tween.from({x: this.cv.x}).to({x: this.cv.x+300});
        tween.time = 500;
        // tween.repeat = 20;
        setTimeout(tween.start(), 1000);
        // animateTo({target: this.cv, x: 100, y: 0, easing: PIXI.tween.Easing.inExpo()});
    }
}
