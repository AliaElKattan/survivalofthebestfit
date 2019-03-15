import * as PIXI from 'pixi.js';
import {officeStageContainer, eventEmitter} from '../../controllers/game/gameSetup.js';
import {bluePersonTexture, yellowPersonTexture} from '../../controllers/common/textures.js';
import {gameFSM} from '../../controllers/game/stateManager.js';
import {createPerson} from '../../components/pixi/person.js';
import {animateTo} from '../../controllers/common/utils.js';
import {Floor} from './floor.js';
import {cvCollection} from '../../assets/text/cvCollection.js';

const officeHeight = 0.6;
const officeWidth = 0.6;
const officeOffsetY = 0.1;

const config = [
    {row: 1, col: 5, scale: 1, newPeople: 5},
    {row: 2, col: 8, scale: 0.8, newPeople: 10},
    {row: 4, col: 10, scale: 0.7, newPeople: 10},
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
        officeStageContainer.addChild(this.container);
        officeStageContainer.addChild(this.personContainer);
        this.listenerSetup();
        this.expandOffice();
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
                const newFloor = new Floor(-officeWidth, currentY, this);
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
        let x = (Math.random() * 0.1) + 0.1;
        let texture = bluePersonTexture;

        for (let i = 0; i < count; i++) {
            //TODO handle diff textures
            let color = cvCollection.smallOfficeStage[this.uniqueCandidateIndex].color;
            console.log(color);
            texture = (color === "yellow") ? yellowPersonTexture : bluePersonTexture; 
            createPerson(x, (Math.random() * 0.1) + 0.8, this, this.uniqueCandidateIndex, texture);
            this.uniqueCandidateIndex++;
            x += 0.05;
        }
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