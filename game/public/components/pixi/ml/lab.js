import * as PIXI from 'pixi.js';
import {uv2px, clamp, spacingUtils as space} from '../../../controllers/common/utils.js';
import {createPerson} from '../person.js';
import {cvCollection} from '../../../assets/text/cvCollection.js';
import Machine from './machine';
import Resumes from './cv-list';
import Floor from './floor';
import ConveyorBelt from './conveyor-belt';
import Door from '../door';
import ResumeUI from '../../interface/ui-resume/ui-resume';
import NewsFeedUI from '../../interface/ml/news-feed/news-feed.js';
import AlgorithmInspectorUI from '../../interface/ml/algorithm-inspector/algorithm-inspector.js';
import ScanRay from './scan-ray.js';
import DataServer from './data-server.js';


// import ResumeViewerUI from '../../interface/ml/resume-viewer/resume-viewer.js';


export default class MLLab {
    constructor() {
        this.size = 0;
        this.scale = 1;

        this.newsFeed = new NewsFeedUI({show: true});
        this.algorithmInspector = new AlgorithmInspectorUI({});
        this.floors = [
            new Floor({y: uv2px(0.6, 'h')}),
            new Floor({y: space.absMinusSize(0, 'h')}),
        ];
        this.doors = [
            new Door({
                x: uv2px(0.03, 'w'),
                y: uv2px(0.7, 'h'),
            }), // ground floor door
        ];
        this.resumeList = new Resumes({
            y: uv2px(.43, 'h'),
            xOffset: uv2px(0.1, 'w'),
        });
        this.machine = new Machine({});
        this.dataServers = [
            new DataServer({
                machineConfig: this.machine.getMachineConfig(),
                side: 'left',
            }),
            new DataServer({
                machineConfig: this.machine.getMachineConfig(),
                side: 'right',
            }),
        ];
        this.scanRay = new ScanRay(this.machine.getMachineConfig());
        this.belt = new ConveyorBelt({
            y: uv2px(.43, 'h'),
        });
        this.personList = [];
        this.personContainer = new PIXI.Container();
        this.resumeUI = new ResumeUI({show: true, type: 'ml', features: cvCollection.cvFeatures, scores: cvCollection.smallOfficeStage});
        this.tweens = {};
        this.animLoopCount = 0;

        this._setupTweens();
        this.draw();
    }

    draw() {
        this.floors.forEach((floor) => floor.draw());
        this.doors.forEach((door) => door.draw());
        this.machine.draw();
        this.dataServers.forEach((server) => server.draw());
        this.belt.draw();
        this.resumeList.draw();
        this.scanRay.draw();
        // this.animate();
    }
    
    animate() {
        this.tweens.resumesTween.start();
    }

    _setupTweens() {
        this.tweens.resumesTween = this.resumeList.createTween();
        this.tweens.rayAnim = this.scanRay.getSprite();
        this.tweens.resumeScanline = this.resumeUI.createScanTween();
        this.tweens.resumeMask = this.resumeUI.createMaskTween();
        this.tweens.serverDummyAnim = this.dataServers[0].getSprite();

        // once the conveyor belt animation is done ...
        this.tweens.resumesTween.on('end', () => {
            // reset conveyor belt animation
            this.tweens.resumesTween.reset();
            // play machine ray animation
            setTimeout(()=> {
                this.tweens.rayAnim.visible = true;
                this.tweens.rayAnim.animationSpeed = 0.5;
                this.tweens.rayAnim.play();
            }, 100);
            // play resume scanline animation
            setTimeout(()=> {
                this.resumeUI.showScanline();
                this.animLoopCount === 0 ? this.tweens.resumeScanline.resume() : this.tweens.resumeScanline.restart();
                this.animLoopCount === 0 ? this.tweens.resumeMask.resume() : this.tweens.resumeMask.restart();
            }, 500);
        });

        // once the scanline animation is done ...
        this.tweens.resumeScanline.eventCallback('onComplete', () => {
            // hide the scaneline and reset its position
            this.resumeUI.hideScanline();
            // start animating the data servers
            setTimeout(()=> {
                this.tweens.serverDummyAnim.gotoAndStop(0);
                this.tweens.serverDummyAnim.play();
            }, 200);
            // hide the ray animation and reset its animation
            // this.tweens.rayAnim.visible = false;
            // this.tweens.rayAnim.gotoAndStop(5);
            // play the ray animation backwards
            this.tweens.rayAnim.animationSpeed = -0.7;
            this.tweens.rayAnim.play();
            // start a new conveyor belt animation
            this.tweens.resumesTween.start();
            this.animLoopCount++;
        });
    }

    destroyTweens() {
        this.tweens.resumesTween.clear(); // PIXI TWEEN
        this.tweens.resumesTween.remove();
        this.tweens.rayAnim.destroy(); // PIXI spritesheet - destroy
        this.tweens.resumeScanline.kill(); // GSAP tween - kill
        this.tweens.serverDummyAnim.destroy();
    };

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

    destroy() {
        this.destroyTweens();
    }
}
