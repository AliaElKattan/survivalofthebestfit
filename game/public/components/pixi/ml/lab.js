import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
import {pixiApp} from '../../../controllers/game/gameSetup';
import {mlLabStageContainer, eventEmitter} from '../../../controllers/game/gameSetup.js';
import COLORS from '../../../controllers/constants/pixi-colors.js';
import {gameFSM} from '../../../controllers/game/stateManager.js';
import {uv2px, clamp, spacingUtils as space, animateTo} from '../../../controllers/common/utils.js';
import {createPerson} from '../person.js';
import {cvCollection} from '../../../assets/text/cvCollection.js';
import Machine from './machine';
import Resumes from './cv-list';
import ConveyorBelt from './conveyor-belt';
import Door from '../door';
import ResumeUI from '../../interface/ui-resume/ui-resume';
import NewsFeedUI from '../../interface/ml/news-feed/news-feed.js';
import AlgorithmInspectorUI from '../../interface/ml/algorithm-inspector/algorithm-inspector.js';
import ResumeViewerUI from '../../interface/ml/resume-viewer/resume-viewer.js';


export default class MLLab {
    constructor() {
        this.size = 0;
        this.scale = 1;

        this.newsFeed = new NewsFeedUI({show: true});

        this.algorithmInspector = new AlgorithmInspectorUI({});

        this.resumeViewers = [
            new ResumeViewerUI({show: true, type: 'accepted'}),
            new ResumeViewerUI({show: true, type: 'rejected'}),
        ];

        this.doors = [
            new Door({
                x: uv2px(0.03, 'w'),
                y: uv2px(0.7, 'h'),
            }), // ground floor door
        ];

        this.belt = new ConveyorBelt({
            y: uv2px(.43, 'h'),
        });

        this.resumeList = new Resumes({
            y: uv2px(.43, 'h'),
            xOffset: uv2px(0.1, 'w'),
        });

        this.machine = new Machine({});

        this.personList = [];

        this.personContainer = new PIXI.Container();

        this.resumeUI = new ResumeUI({show: true, type: 'ml', features: cvCollection.cvFeatures, scores: cvCollection.smallOfficeStage});

        this.tweens = {};

        this.animLoopCount = 0;

        this._setupTweens();
        this.draw();
    }

    _setupTweens() {
        this.tweens.resumesTween = this.resumeList.createTween();
        this.tweens.rayAnim = this.machine.getSprite();
        this.tweens.resumeUI = this.resumeUI.createTween();

        // once the conveyor belt animation is done ...
        this.tweens.resumesTween.on('end', () => {
            // reset conveyor belt animation
            this.tweens.resumesTween.reset();
            // play machine ray animation
            this.tweens.rayAnim.visible = true;
            this.tweens.rayAnim.play();
            // play resume scanline animation
            this.resumeUI.showScanline();
            this.animLoopCount === 0 ? this.tweens.resumeUI.resume() : this.tweens.resumeUI.restart();
        });

        // once the scanline animation is done ...
        this.tweens.resumeUI.eventCallback('onComplete', () => {
            // hide the scaneline and reset its position
            this.resumeUI.hideScanline();
            // hide the ray animation and reset its animation
            this.tweens.rayAnim.visible = false;
            this.tweens.rayAnim.gotoAndStop(5);
            // start a new conveyor belt animation
            this.tweens.resumesTween.start();
            this.animLoopCount++;
        });
    }

    _removeTweens() {
        this.tweens.resumesTween.clear(); // PIXI TWEEN
        this.tweens.resumesTween.remove();
        this.tweens.rayAnim.destroy(); // PIXI spritesheet - destroy
        this.tweens.resumeUI.kill(); // GSAP tween - kill
    };

    draw() {
        this.doors.forEach((door) => door.draw());
        this.belt.draw();
        this.resumeList.draw();
        this.machine.draw();
        // first office floor
        this._drawFloor(uv2px(0.6, 'h'));
        // ground floor/
        this._drawFloor(space.absMinusSize(0, 'h'));
        this.animate();
    }

    animate() {
        this.tweens.resumesTween.start();
    }

    _drawFloor(yAnchor) {
        const heightMain = clamp(uv2px(0.1, 'w'), 40, 50);
        const heightShadow = clamp(heightMain/5, 20, 30);
        // main floor - pink
        const surface = new PIXI.Graphics();
        surface.beginFill(COLORS.ROSE_MAIN);
        surface.drawRect(0, 0, uv2px(1, 'w'), heightMain);
        surface.endFill();
        surface.x = 0;
        surface.y = yAnchor-heightMain;
        // dark pink shadow
        const side = new PIXI.Graphics();
        side.beginFill(COLORS.ROSE_SHADOW);
        side.drawRect(0, 0, uv2px(1, 'w'), heightShadow);
        side.endFill();
        side.x = 0;
        side.y = yAnchor;
        // add the floor to the container
        mlLabStageContainer.addChild(surface);
        mlLabStageContainer.addChild(side);
    }

    _drawPeople() {
        // create People in the office
        // let x = uv2px(0.12, 'w');
        // const xOffset = uv2px(0.05, 'w');
        // const y = uv2px(0.85, 'h');
        //
        // for (let i = 0; i < 16; i++) {
        //     const person = createPerson(x, y, office2);
        //     person.interactive = false;
        //     person.button = false;
        //     personList2.push(person);
        //     x += xOffset;
        // }
    }
}
