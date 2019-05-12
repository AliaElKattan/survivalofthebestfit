import {uv2px, waitForSeconds} from '~/public/game/controllers/common/utils.js';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {mlLabStageContainer} from '~/public/game/controllers/game/gameSetup';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import EVENTS from '~/public/game/controllers/constants/events.js';
import Machine from '~/public/game/components/pixi/ml-stage/machine';
import ResumeList from '~/public/game/components/pixi/ml-stage/resume-list';
import Floor from '~/public/game/components/pixi/manual-stage/floor';
import ConveyorBelt from '~/public/game/components/pixi/ml-stage/conveyor-belt';
import Door from '~/public/game/components/pixi/manual-stage/door';
import ResumeUI from '~/public/game/components/interface/ui-resume/ui-resume';
import DatasetView from '~/public/game/components/interface/ml/dataset-view/dataset-view';
import ScanRay from '~/public/game/components/pixi/ml-stage/scan-ray.js';
import DataServer from '~/public/game/components/pixi/ml-stage/data-server.js';
import People from '~/public/game/components/pixi/ml-stage/people.js';
import {mlModule} from '~/public/game/controllers/machine-learning/mlModule.js';

export default class MlLabAnimator {
    constructor() {
        this.size = 0;
        this.scale = 1;
        
        this.firstFloor = new Floor({type: 'first_floor'}).addToPixi(mlLabStageContainer);
        this.groundFloor = new Floor({type: 'ground_floor'}).addToPixi(mlLabStageContainer);
        this.door = new Door({
            type: 'doorAccepted',
            floor: 'ground_floor',
            floorParent: this.groundFloor,
            xAnchor: uv2px(0.08, 'w'),
        }).addToPixi();
        
        this.machine = new Machine();        
        this.dataServers = [
            new DataServer({machine: this.machine, type: 'rejected'}),
            new DataServer({machine: this.machine, type: 'accepted'}),
        ];
        
        this.belt = new ConveyorBelt();
        this.resumeLine = new ResumeList();
        this.machineRay = new ScanRay({machine: this.machine});
        this.people = new People();
        
        this.datasetView = new DatasetView({});
        this.resumeUI = new ResumeUI({
            show: true, type: 'ml',
            features: cvCollection.cvFeatures,
            scores: cvCollection.cvData,
            candidateId: candidateClicked,
        });
        
        eventEmitter.on(EVENTS.RESIZE, this._resize.bind(this));

        this._setupTweens();
        this.startAnimation();
    }

    _setupTweens() {
        this.resumeLineTween = this.resumeLine.createTween();
        this.machineRayTween = this.machineRay.getSprite();
        this.doorTween = this.door.getSprite();
        this.resumeScanTween = this.resumeUI.createScanTween();
        this.resumeMaskTween = this.resumeUI.createMaskTween();
        this.peopleTween = this.people.createTween();
        this.activeTween = this.resumeLineTween;
        
        // once the conveyor belt (resume tween) animation is done:
        // 1. reset the conveyor belt animation
        // 2. show the resume of the first person in line
        // 3. play the conveyor belt scanline animation
        // 4. play resume scanline animation

        this.resumeLineTween.on('end', () => {
            // #1: reset conveyor belt animation
            this.resumeLineTween.reset();
            waitForSeconds(0.1)
                .then(() => {
                    // #2: show the resume of the first person in line
                    const person = this.people.getFirstPerson();
                    if (person !== undefined) this.resumeUI.showCV(person.getData());
                    // #3 play the conveyor belt scanline animation
                    this.machineRayTween.visible = true;
                    this.machineRayTween.animationSpeed = 0.5;
                    this.machineRayTween.play();
                    return waitForSeconds(0.4);
                })
                .then(() => {
                    eventEmitter.emit(EVENTS.MAKE_ML_PEOPLE_TALK, {});
                    // #4 play resume scanline animation
                    this.activeTween = this.resumeScanTween;
                    this.resumeUI.showScanline();
                    if (this.animLoopCount === 0) {
                        this.resumeScanTween.resume();
                        this.resumeMaskTween.resume();
                    } else {
                        this.resumeScanTween.restart();
                        this.resumeMaskTween.restart();
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

        this.resumeScanTween.eventCallback('onComplete', () => {
            // #1: evaluate new candidate
            const decision = this.evalFirstPerson();
            // #2: set up server/door animations
            if (decision === 'accepted') {
                eventEmitter.emit(EVENTS.ACCEPTED, {});
                this.dataServers[1].updateServerCounter();
                this.door.playAnimation({direction: 'forward'});
            } else {
                this.dataServers[0].updateServerCounter();
            };
            
            // #3: play the people line animation
            this.people.recalibrateTween(this.peopleTween);
            this.peopleTween.start();
            // #4: play the server animation
            

            // #5: hide & reset the resume scan 
            //     play machine scan backwards
            this.resumeUI.hideScanline();
            this.resumeUI.hide();
            this.machineRayTween.animationSpeed = -0.7;
            this.machineRayTween.play();
            // #6: start a new conveyor belt animation
            this.activeTween = this.resumeLineTween;
            this.resumeLineTween.start();
        });

        this.peopleTween.on('end', () => {
            this.peopleTween.reset();
        });
    }

    startAnimation() {
        this.activeTween.start();
    }

    pauseAnimation() {
        this.activeTween.stop();
    }

    evalFirstPerson() {
        const firstPerson = this.people.getFirstPerson();
        const status = mlModule.predict(firstPerson.getData()) == 1 ? 'accepted' : 'rejected';
        this.people.removeFirstPerson(status);
        this.datasetView.handleNewResume({status: status, data: firstPerson.getData()});

        return status;
    }

    // the properties between componenets are entangled and there are tweens and objects that need to be resized from here
    // resume list: the tween needs to be updated once the conveyor belt expands
    // servers: we need to make sure that the machine is resized before the servers because they get the y position from each other
    // scanray: it's coupled with the machine
    _resize() {
        this.resumeLine.draw();
        this.resumeLineTween.from({x: this.resumeLine.resumeContainer.x}).to({x: this.resumeLine.resumeContainer.x - 2*this.resumeLine.resumeXOffset});
        this.machine.draw();
        this.dataServers.forEach((server) => server.draw());
        this.machineRay.draw();
    }

    destroyTweens() {
        this.resumeLineTween.clear(); // PIXI TWEEN
        this.resumeLineTween.remove();
        this.machineRayTween.destroy(); // PIXI spritesheet - destroy
        this.resumeScanTween.kill(); // GSAP tween - kill
        this.serverDummyAnim.destroy();
    };

    destroy() {
        this.destroyTweens();
        this.conversationManager.destroy(); // unimplemented
        this.newsFeed.destroy();
        this.datasetView.destroy();
        this.firstFloor.destroy();
        this.groundFloor.destroy();
        this.door.destroy(); // unimplemented
        this.resumeLine.destroy();
        this.belt.destroy();
        this.machine.destroy(); // unimplemented
        this.dataServers.destroy(); // unimplemented
        this.machineRay.destroy(); // half implemented
        this.resumeUI.destroy();
        this.people.destroy();
        this.timeline.destroy();
    }
}
