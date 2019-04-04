import * as PIXI from 'pixi.js';
import $ from 'jquery';
import {officeStageContainer, eventEmitter} from '../../controllers/game/gameSetup.js';
import {bluePersonTexture, yellowPersonTexture} from '../../controllers/common/textures.js';
import {gameFSM} from '../../controllers/game/stateManager.js';
import {createPerson, animateThisCandidate} from '../../components/pixi/person.js';
import Floor from './ml/floor.js';
import {cvCollection} from '../../assets/text/cvCollection.js';
import {uv2px, spacingUtils as space} from '../../controllers/common/utils.js';
import Door from './door.js';
import ResumeUI from '../../components/interface/ui-resume/ui-resume';
import YesNo from '../../components/interface/yes-no/yes-no';
import PeopleTalkManager from '~/public/components/interface/ml/people-talk-manager/people-talk-manager';
import ANCHORS from '~/public/controllers/constants/pixi-anchors';
import EVENTS from '../../controllers/constants/events';

const spotlight = {
    x: uv2px(0.4, 'w'),
    y: uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y - 0.15, 'h'),
};

const config = [
    {row: 1, col: 5, scale: 1, newPeople: 10},
    {row: 2, col: 8, scale: 0.8, newPeople: 15},
];

class Office {
    constructor() {
        this.uniqueCandidateIndex = 0;
        this.currentStage = 0;
        this.scale = 1;
        this.deskList = [];
        this.floorList = [];
        this.takenDesks = 0;
        this.interiorContainer = new PIXI.Container();
        this.personContainer = new PIXI.Container();
        this.entryDoorX = 0.1;
        this.exitDoorX = 0.6;
        this.personStartX = 0.22;
        this.personStartY = 0.85;
        this.xOffset = 0.05;
        // IMPORTANT: people are stored by index so can't delete array
        this.allPeople = [];
        this.hiredPeople = [];

        this.floors = {
            ground_floor: new Floor({type: 'ground_floor'}),
            first_floor: new Floor({type: 'first_floor'}),
        };

        this.peopleTalkManager = new PeopleTalkManager({parent: this.personContainer, stage: 'manual'});

        this.doors = [
            new Door({
                type: 'doorAccepted',
                floor: 'first_floor',
                floorParent: this.floors.first_floor,
                xAnchor: uv2px(this.entryDoorX, 'w'),
            }),
            new Door({
                type: 'doorRejected',
                floor: 'first_floor',
                floorParent: this.floors.first_floor,
                xAnchor: uv2px(this.exitDoorX, 'w'),
            }),
            new Door({
                type: 'doorEntry',
                floor: 'ground_floor',
                floorParent: this.floors.ground_floor,
                xAnchor: uv2px(this.entryDoorX, 'w'),
            }),
        ];
        this.listenerSetup();
    }

    draw(stageNum) {
        if (stageNum == 0) {
            // SMALL STAGE - INITIAL SET UP
            for (const floor in this.floors) {
                if (Object.prototype.hasOwnProperty.call(this.floors, floor)) {
                    this.floors[floor].addToPixi(this.interiorContainer);
                }
            };

            this.doors.forEach((door) => door.addToPixi(this.interiorContainer));
            this.yesno = new YesNo({show: true});

            if (this.personContainer.children.length > 0) {
                // in case small stage was repeated, clear the office
                officeStageContainer.removeChild(this.personContainer);
                this.personContainer = new PIXI.Container();
            }

            candidateInSpot = null;
            this.takenDesks = 0;

            // Adding people for small stage
            this.addPeople(0, config[this.currentStage].newPeople);
            this.peopleTalkManager.startTimeline();
        } else if (stageNum == 1) {
            // MEDIUM STAGE - REDRAW PEOPLE
            officeStageContainer.removeChild(this.personContainer);
            this.personContainer = new PIXI.Container();
            candidateInSpot = null;
            this.takenDesks = 0;

            // empty the people line
            this.currentStage++;
            this.addPeople(config[this.currentStage-1].newPeople, config[this.currentStage].newPeople);
        }
        officeStageContainer.addChild(this.interiorContainer);
        officeStageContainer.addChild(this.personContainer);
    }

    moveTweenHorizontally(tween, newX) {
        tween.stop().clear();
        tween.to({x: newX});
        tween.easing = PIXI.tween.Easing.inOutSine();
        tween.time = 1200;
        tween.start();
    }

    listenerSetup() {
        eventEmitter.on(EVENTS.DISPLAY_THIS_CV, () => {
            new ResumeUI({
                show: true,
                features: cvCollection.cvFeatures,
                scores: cvCollection.smallOfficeStage,
                candidateId: candidateClicked,
            });
        });

        this.acceptedHandler = () => {
            this.takenDesks += 1;
            const hiredPerson = this.allPeople[candidateInSpot];
            this.hiredPeople.push(hiredPerson);
            this.moveTweenHorizontally(hiredPerson.tween, uv2px(this.entryDoorX + 0.04, 'w'));
            candidateInSpot = null;
            this.doors[0].playAnimation({direction: 'forward'});

            hiredPerson.tween.on('end', () => {
                this.personContainer.removeChild(hiredPerson);
                this.doors[0].playAnimation({direction: 'reverse'});
            });

            if (this.currentStage == 0 && this.takenDesks == hiringGoals['smallStage']) {
                eventEmitter.emit(EVENTS.STAGE_ONE_COMPLETED, {});
                gameFSM.nextStage();
            }

            if (this.currentStage == 1 && this.takenDesks == hiringGoals['mediumStage']) {
                eventEmitter.emit(EVENTS.STAGE_TWO_COMPLETED, {});
                gameFSM.nextStage();
            }
        };
        eventEmitter.on(EVENTS.ACCEPTED, this.acceptedHandler);

        eventEmitter.on(EVENTS.REJECTED, () => {
            const rejectedPerson = this.allPeople[candidateInSpot];
            this.moveTweenHorizontally(rejectedPerson.tween, uv2px(this.exitDoorX + 0.04, 'w'));

            candidateInSpot = null;
            this.doors[1].playAnimation({direction: 'forward'});

            rejectedPerson.tween.on('end', () => {
                this.personContainer.removeChild(rejectedPerson);
                this.doors[1].playAnimation({direction: 'reverse'});
            });

            if (this.personContainer.children.length <= 1) {
                gameFSM.repeatStage();
            }
        });

        eventEmitter.on(EVENTS.RETURN_CANDIDATE, () => {
            animateThisCandidate(this.allPeople[candidateInSpot], this.allPeople[candidateInSpot].originalX, this.allPeople[candidateInSpot].originalY);
            this.allPeople[candidateInSpot].inSpotlight = false;
        });
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.ACCEPTED, this.acceptedHandler);
    }

    addPeople(startIndex, count) {
        let texture = bluePersonTexture;

        for (let i = startIndex; i < startIndex + count; i++) {
            const orderInLine = i - startIndex;
            const color = cvCollection.smallOfficeStage[this.uniqueCandidateIndex].color;
            const name = cvCollection.smallOfficeStage[this.uniqueCandidateIndex].name;
            texture = (color === 'yellow') ? yellowPersonTexture : bluePersonTexture;
            const person = createPerson(this.personStartX + this.xOffset * orderInLine, this.personStartY, this.uniqueCandidateIndex, texture);
            this.personContainer.addChild(person);
            this.allPeople.push(person);
            this.uniqueCandidateIndex++;
        }
    }

    delete() {
        this.doors.forEach((door) => {
            door.destroy();
        });
        officeStageContainer.removeChild(this.interiorContainer);
        officeStageContainer.removeChild(this.personContainer);
        this._removeEventListeners();
        this.peopleTalkManager.destroy();
        $( '.js-task-timer' ).remove();
    }
}

export {Office, spotlight};
