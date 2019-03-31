import {uv2px, spacingUtils as space} from '~/public/controllers/common/utils.js';
import {cvCollection} from '~/public/assets/text/cvCollection.js';
import Machine from '~/public/components/pixi/ml/machine';
import Resumes from '~/public/components/pixi/ml/cv-list';
import Floor from '~/public/components/pixi/ml/floor';
import ConveyorBelt from '~/public/components/pixi/ml/conveyor-belt';
import Door from '~/public/components/pixi/door';
import ResumeUI from '~/public/components/interface/ui-resume/ui-resume';
import ConversationManager from '~/public/components/interface/ml/conversation-manager/conversation-manager.js';
import NewsFeedUI from '../../interface/ml/news-feed/news-feed.js';
import AlgorithmInspectorUI from '../../interface/ml/algorithm-inspector/algorithm-inspector.js';
import DatasetView from '../../interface/ml/dataset-view/dataset-view';
import ScanRay from './scan-ray.js';
import DataServer from './data-server.js';
import MLPeople from './people.js';
import {mlLabStageContainer} from '~/public/controllers/game/gameSetup';
import TimelineManager from '~/public/components/interface/ml/timeline-manager/timeline-manager';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';
import EVENTS from '~/public/controllers/constants/events.js';


export default class MLLab {
    constructor() {
        this.size = 0;
        this.scale = 1;

        this.conversationManager = new ConversationManager();
        this.newsFeed = new NewsFeedUI({show: true});
        this.algorithmInspector = new AlgorithmInspectorUI({});
        this.datasetView = new DatasetView({});
        this.floors = {
            ground_floor: new Floor({type: 'ground_floor'}),
            first_floor: new Floor({type: 'first_floor'}),
        };
        this.doors = [
            new Door({
                type: 'doorEntry',
                floor: 'ground_floor',
                floorParent: this.floors.ground_floor,
                xAnchor: uv2px(0.03, 'w'),
            }),
        ];
        this.resumeList = new Resumes();
        this.belt = new ConveyorBelt();
        this.machine = new Machine({});
        this.dataServers = [
            new DataServer({
                machine: this.machine,
                side: 'left',
            }),
            new DataServer({
                machine: this.machine,
                side: 'right',
            }),
        ];
        this.scanRay = new ScanRay({machine: this.machine});
        // TODO change the scores and candidateId logic -> we can handle with event emitter
        // is the cv shown based on the person clicked?
        this.resumeUI = new ResumeUI({
            show: true, type: 'ml',
            features: cvCollection.cvFeatures,
            scores: cvCollection.smallOfficeStage,
            candidateId: candidateHovered,
        });
        this.people = new MLPeople();
        this.timeline = new TimelineManager();
        this.tweens = {};
        this.animLoopCount = 0;

        eventEmitter.on(EVENTS.RESIZE, this._resize.bind(this));

        this._setupTweens();
        this.draw();
        this.timeline.start();
    }

    draw() {
        for (const floor in this.floors) {
            if (Object.prototype.hasOwnProperty.call(this.floors, floor)) {
                this.floors[floor].addToPixi(mlLabStageContainer);
            }
        };
        this.doors.forEach((door) => door.addToPixi(mlLabStageContainer));
        this.machine.addToPixi();
        this.dataServers.forEach((server) => server.addToPixi());
        this.belt.addToPixi();
        this.resumeList.addToPixi();
        this.scanRay.addToPixi();
        this.people.addToPixi();
        this.animate();
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
        this.tweens.peopleLine = this.people.createTween();

        // once the conveyor belt animation is done ...
        this.tweens.resumesTween.on('end', () => {
            // reset conveyor belt animation
            this.tweens.resumesTween.reset();
            // play machine ray animation
            setTimeout(()=> {
                // show the new CV
                const person = this.people.getFirstPerson();
                if (person !== undefined) this.resumeUI.showCV(person.getData());
                // play the animation
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
            if (this.people.getCount() > 0) {
                this.people.evaluateFirstPerson();
                this.people.recalibrateTween(this.tweens.peopleLine);
                this.tweens.peopleLine.start();
            }
            // hide the scaneline and reset its position
            this.resumeUI.hideScanline();
            this.resumeUI.hide();
            // start animating the data servers
            setTimeout(()=> {
                this.tweens.serverDummyAnim.gotoAndStop(0);
                this.tweens.serverDummyAnim.play();
            }, 200);
            // play the ray animation backwards
            this.tweens.rayAnim.animationSpeed = -0.7;
            this.tweens.rayAnim.play();
            // start a new conveyor belt animation
            this.tweens.resumesTween.start();
            this.animLoopCount++;
        });

        this.tweens.peopleLine.on('end', () => {
            this.tweens.peopleLine.reset();
        });
    }

    // the properties between componenets are entangled and there are tweens and objects that need to be resized from here
    // resume list: the tween needs to be updated once the conveyor belt expands
    // servers: we need to make sure that the machine is resized before the servers because they get the y position from each other
    _resize() {
        this.resumeList.draw();
        this.tweens.resumesTween.from({x: this.resumeList.resumeContainer.x}).to({x: this.resumeList.resumeContainer.x - 2*this.resumeList.resumeXOffset});
        this.machine.draw();
        this.dataServers.forEach((server) => server.draw());

    }

    destroyTweens() {
        this.tweens.resumesTween.clear(); // PIXI TWEEN
        this.tweens.resumesTween.remove();
        this.tweens.rayAnim.destroy(); // PIXI spritesheet - destroy
        this.tweens.resumeScanline.kill(); // GSAP tween - kill
        this.tweens.serverDummyAnim.destroy();
    };

    destroy() {
        this.destroyTweens();
        this.conversationManager.destroy(); // unimplemented
        this.newsFeed.destroy();
        this.algorithmInspector.destroy(); // Is it half implemented?
        this.datasetView.destroy();
        this.floors.destroy();
        this.doors.destroy(); // unimplemented
        this.resumeList.destroy();
        this.belt.destroy();
        this.machine.destroy(); // unimplemented
        this.dataServers.destroy(); // unimplemented
        this.scanRay.destroy(); // half implemented
        this.resumeUI.destroy();
        this.people.destroy();
        this.timeline.destroy();
    }
}
