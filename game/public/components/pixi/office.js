import * as PIXI from 'pixi.js';
import {officeStageContainer, eventEmitter} from '../../controllers/game/gameSetup.js';
import {bluePersonTexture, yellowPersonTexture} from '../../controllers/common/textures.js';
import {gameFSM} from '../../controllers/game/stateManager.js';
import {createPerson} from '../../components/pixi/person.js';
import {animateTo} from '../../controllers/common/utils.js';
import Floor from './ml/floor.js';
import {cvCollection} from '../../assets/text/cvCollection.js';
import {uv2px, spacingUtils as space} from '../../controllers/common/utils.js';
import Door from './door.js';
import TaskUI from '../../components/interface/ui-task/ui-task';
import ResumeUI from '../../components/interface/ui-resume/ui-resume';
import {deskTexture} from '../../controllers/common/textures.js';
import ANCHORS from '~/public/controllers/constants/pixi-anchors';

const officeHeight = 0.6;
const officeWidth = 0.6;
const officeOffsetY = 0.1;

const config = [
    {row: 1, col: 5, scale: 1, newPeople: 10},
    {row: 2, col: 8, scale: 0.8, newPeople: 15},
    {row: 4, col: 10, scale: 0.7, newPeople: 15},
];

class Office {
    constructor() {
        this.uniqueCandidateIndex = 0;
        this.size = 0;
        this.scale = 1;
        this.deskList = [];
        this.floorList = [];
        this.takenDesks = 0;
        this.container = new PIXI.Container();
        this.personContainer = new PIXI.Container();
        this.entryDoorX = 0.1;
        this.exitDoorX = 0.6;
        this.personStartX = 0.22;
        this.personStartY = 0.85;
        this.xOffset = 0.05;
        this.peopleLine = [];

        this.floors = {
            ground_floor: new Floor({type: 'ground_floor'}),
            first_floor: new Floor({type: 'first_floor'}),
        };

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
            })
        ];

        new TaskUI({show: true, hires: 5, duration: 30, content: txt.smallOfficeStage.taskDescription});

        eventEmitter.on('person-hovered', () => {
            new ResumeUI({
                show: true,
                features: cvCollection.cvFeatures,
                scores: cvCollection.smallOfficeStage,
                candidateId: candidateInScope,
            });
        });

        this.listenerSetup();
        //this._setupTweens();
        this.draw(officeStageContainer);
                
        officeStageContainer.addChild(this.container);
        officeStageContainer.addChild(this.personContainer);
        // this.expandOffice();
    }

    draw(parentContainer) {
        for (const floor in this.floors) {
            if (Object.prototype.hasOwnProperty.call(this.floors, floor)) {
                this.floors[floor].addToPixi(parentContainer);
            }
        };
        this.doors.forEach((door) => door.addToPixi(parentContainer));
        this.addPeople(config[this.size].newPeople);
        const desk = this.createInterviewDesk(0.4, ANCHORS.FLOORS.FIRST_FLOOR.y);
    }
    _setupTweens() {
        this.tweens.peopleLine = this.createTween();

        this.tweens.peopleLine.on('end', () => {
            this.tweens.peopleLine.reset();
        });
    }

    createPeopleLineTween() {
        const tween = PIXI.tweenManager.createTween(this.personContainer);
        tween.from({x: this.personStartX}).to({x: this.personStartX-this.xOffset});
        
        return tween;
    }

    animate() {
        this.tweens.peopleLine.start();
    }

    moveTweenHorizontally(tween, oldX, newX) {
        tween.from(
            {x: oldX})
            .to({x: newX});
    }

    movePersonToSpotlight(tween) {
        tween.from(
            {x: this.personStartX})
            .to({x: this.spotlightX, y: this.spotlightY});
    }

    evaluateFirstPerson() {
        const status = Math.random() < 0.5 ? 'accepted' : 'rejected';
        eventEmitter.emit(EVENTS.DATASET_VIEW_NEW_CV, {
            status: status,
            data: this.peopleLine[0].getData(),
        });
        this.removeFirstPerson();
        this._addNewPerson();
    }

    createInterviewDesk(x, y) {
        const desk = new PIXI.Sprite(deskTexture);
        desk.type = 'desk';
        desk.isTaken = false;
        desk.anchor.set(0.5);
        desk.x = uv2px(x, 'w');
        desk.y = uv2px(y - 0.12, 'h');
        desk.interactive = true;
        desk.scale.set(0.25);
        officeStageContainer.addChild(desk);

        return desk;
    }

    expandOffice() {
        this.cols = config[this.size].col;
        this.rows = config[this.size].row;

        // expansionScale will be applied to existing children
        this.expansionScale = config[this.size].scale;
        // while new children will have to be scaled to the previous scale level times the new scale so that they catch up on previous transitions
        this.scale *= this.expansionScale;

        const objectsToResize = this.resizePeople();
        const [moveFloorTweens, newFloorTweens] = this.expandFloors(this.rows, this.cols);
        this.sequenceTweens(moveFloorTweens, newFloorTweens, objectsToResize);
        this.addPeople(config[this.size].newPeople);
        this.size++;
    }

    expandFloors(desiredFloorNumber) {
        let moveTweenList = [];
        const newTweenList = [];
        const floorHeight = officeHeight / (desiredFloorNumber + 1);

        let currentY = floorHeight + officeOffsetY;
        for (let i = 0; i < desiredFloorNumber; i++) {
            if (this.floorList.length > i) {
                moveTweenList = moveTweenList.concat(this.floorList[i].resizeFloor(this, currentY));
            } else {
                //const newFloor = new Floor(-officeWidth, currentY, this);
                newTweenList.push(animateTo({target: newFloor.sprite, x: 0}));
                this.floorList.push(newFloor);
            }
            currentY += floorHeight;
        }
        return [moveTweenList, newTweenList];
    }

    sequenceTweens(moveFloorTweens, newFloorTweens, objectToResize) {
        moveFloorTweens.forEach((mytween1)=>{
            mytween1.start();
        });
        newFloorTweens.forEach((mytween4)=>{
            mytween4.start();
        });
        objectToResize.forEach((mytween2)=>{
            mytween2.start();
        });
    }

    listenerSetup() {
        eventEmitter.on('assigned-desk', (data)=>{
            this.takenDesks += 1;
            if (this.takenDesks == 3) {
                eventEmitter.emit('task-complete', {});
                gameFSM.nextStage();
            }
            if (this.takenDesks == 6) {
                gameFSM.nextStage();
            }
            if (this.takenDesks == 9) {
                gameFSM.nextStage();
            }
        });
    }

    addPeople(count) {
        let texture = bluePersonTexture;

        for (let i = 0; i < count; i++) {
            const color = cvCollection.smallOfficeStage[this.uniqueCandidateIndex].color;
            const name = cvCollection.smallOfficeStage[this.uniqueCandidateIndex].name;
            console.log(`${name}: ${color}`);
            texture = (color === 'yellow') ? yellowPersonTexture : bluePersonTexture;
            const person = createPerson(this.personStartX + this.xOffset*i, this.personStartY, this, this.uniqueCandidateIndex, texture);
            this.peopleLine.push(person);
            this.uniqueCandidateIndex++;
        }

        console.log("first person id is: " + this.peopleLine[0].id);
    }

    getFirstPerson() {
        return this.peopleLine.length > 0 ? this.peopleLine[0] : undefined;
    }

    resizePeople() {
        const tweenList = [];
        for (let i = 0; i < this.personContainer.children.length; i++) {
            tweenList.push(animateTo({'target': this.personContainer.children[i], 'scale': this.expansionScale}));
        }
        return tweenList;
    }

    delete() {
        officeStageContainer.removeChild(this.container);
        officeStageContainer.removeChild(this.personContainer);
    }

    getExpansionScale() {
        return this.expansionScale;
    }

    getScale() {
        return this.scale;
    }

    getWidth() {
        return officeWidth;
    }

    getColumns() {
        return this.cols;
    }
}

export {Office};