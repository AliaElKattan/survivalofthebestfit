import {uv2px, waitForSeconds, pacingUtils as space} from '~/public/controllers/common/utils.js';
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
        this.door = new Door({
            type: 'doorAccepted',
            floor: 'ground_floor',
            floorParent: this.floors.ground_floor,
            xAnchor: uv2px(0.08, 'w'),
        });
        this.resumeList = new Resumes();
        this.belt = new ConveyorBelt();
        this.machine = new Machine({});
        this.dataServers = [
            new DataServer({
                machine: this.machine,
                type: 'rejected',
            }),
            new DataServer({
                machine: this.machine,
                type: 'accepted',
            }),
        ];
        this.scanRay = new ScanRay({machine: this.machine});
        // TODO change the scores and candidateId logic -> we can handle with event emitter
        // is the cv shown based on the person clicked?
        this.resumeUI = new ResumeUI({
            show: true, type: 'ml',
            features: cvCollection.cvFeatures,
            scores: cvCollection.smallOfficeStage,
            candidateId: candidateClicked,
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
        this.door.addToPixi();
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
        // constructor
        this.tweens.resumesTween = this.resumeList.createTween();
        this.tweens.rayAnim = this.scanRay.getSprite();
        this.tweens.doorAnim = this.door.getSprite();
        this.tweens.resumeScanline = this.resumeUI.createScanTween();
        this.tweens.resumeMask = this.resumeUI.createMaskTween();
        this.tweens.serverAcceptedAnim = this.dataServers[0].getSprite(); // TODO refactor this to object based approach
        this.tweens.serverRejectedAnim = this.dataServers[1].getSprite();
        this.tweens.peopleLine = this.people.createTween();
        let serverAnim;

        // once the conveyor belt (resume tween) animation is done:
        // 1. reset the conveyor belt animation
        // 2. show the resume of the first person in line
        // 3. play the conveyor belt scanline animation
        // 4. play resume scanline animation

        this.tweens.resumesTween.on('end', () => {
            // #1: reset conveyor belt animation
            this.tweens.resumesTween.reset();
            waitForSeconds(0.1)
                .then(() => {
                    // #2: show the resume of the first person in line
                    const person = this.people.getFirstPerson();
                    if (person !== undefined) this.resumeUI.showCV(person.getData());
                    // #3 play the conveyor belt scanline animation
                    this.tweens.rayAnim.visible = true;
                    this.tweens.rayAnim.animationSpeed = 0.5;
                    this.tweens.rayAnim.play();
                    return waitForSeconds(0.4);
                })
                .then(() => {
                    // #4 play resume scanline animation
                    this.resumeUI.showScanline();
                    if (this.animLoopCount === 0) {
                        this.tweens.resumeScanline.resume();
                        this.tweens.resumeMask.resume();
                    } else {
                        this.tweens.resumeScanline.restart();
                        this.tweens.resumeMask.restart();
                    }
                });
        });

        // once the scanline animation is done:
        // 1. evaluate a new candidate
        // 2. based on the evaluation, set up door and data server animations
        // 3. animate the line of people
        // 4. animate servers
        // 5. hide the resume
        // 6. play the scan ray animation backwards
        // 7. start a new conveyor belt animation

        this.tweens.resumeScanline.eventCallback('onComplete', () => {
            if (this.people.getCount() > 0) {
                // #1: evaluate new candidate
                const candidateEval = this.people.evaluateFirstPerson();
                // #2: set up server/door animations
                if (candidateEval === 'accepted') {
                    serverAnim = this.tweens.serverAcceptedAnim;
                    this.door.playAnimation({direction: 'forward'});
                } else {
                    serverAnim = this.tweens.serverRejectedAnim;
                };
                // #3: play the people line animation
                this.people.recalibrateTween(this.tweens.peopleLine);
                this.tweens.peopleLine.start();
                // #4: play the server animation
                waitForSeconds(0.2)
                    .then(() => {
                        serverAnim.gotoAndStop(0);
                        serverAnim.play();
                        return waitForSeconds(1.5);
                    })
                    .then(() => {
                        serverAnim.gotoAndStop(0);
                    });
            };

            // #5: hide the scanline and reset its position
            this.resumeUI.hideScanline();
            this.resumeUI.hide();
            // #6: play the scan ray animation backwards
            this.tweens.rayAnim.animationSpeed = -0.7;
            this.tweens.rayAnim.play();
            // #7: start a new conveyor belt animation
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
    // scanray: it's coupled with the machine
    _resize() {
        this.resumeList.draw();
        this.tweens.resumesTween.from({x: this.resumeList.resumeContainer.x}).to({x: this.resumeList.resumeContainer.x - 2*this.resumeList.resumeXOffset});
        this.machine.draw();
        this.dataServers.forEach((server) => server.draw());
        this.scanRay.draw();
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
        this.door.destroy(); // unimplemented
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
