import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
import {officeContainer, floorContainer, eventEmitter} from '../../controllers/game/gameSetup.js';
import {gameFSM} from '../../controllers/game/stateManager.js';
import {uv2px, px2uv, spacingUtils as space, animateTo} from '../../controllers/common/utils.js';
import {Floor} from './floor.js';

const officeHeight = 0.6;
const officeWidth = 0.6;
const tweenStartX = -0.4;

const config = [
    {row: 1, col: 5, width: 0.8, height: 0.25, offsetX: 0.1, offsetY: 0.08, scale: 1},
    {row: 2, col: 8, width: 0.8, height: 0.25, offsetX: 0.1, offsetY: 0.06, scale: 0.8},
    {row: 2, col: 10, width: 0.8, height: 0.25, offsetX: 0.1, offsetY: 0.08, scale: 1},
];

class Office {
    constructor() {
        this.takenDesks = 0;
        this.deskList = [];
        this.floorList = [];
        this.size = 0;
        this.scale = 1;
        this.expandOffice();
        this.listenerSetup();
    }

    expandOffice(objectsToResize=[]) {
        // getting config according to office size
        this. rows = config[this.size].row;
        this.cols = config[this.size].col;
        const scale = config[this.size].scale;
        const width = config[this.size].width;
        const height = config[this.size].height;
        const offsetY = config[this.size].offsetY;
        const offsetX = config[this.size].offsetX;

        this.scale = scale;

        const [moveFloorTweens, newFloorTweens] = this.expandFloors(this.rows, this.cols);
        this.sequenceTweens(moveFloorTweens, newFloorTweens, objectsToResize);
        this.size++;
    }

    expandFloors(rows) {
        let moveTweenList = [];
        const newTweenList = [];
        const floorHeight = officeHeight / (rows + 1);
        let currentY = floorHeight;
        for (let i = 0; i < rows; i++) {
            if (this.floorList.length > i) {
                moveTweenList = moveTweenList.concat(this.floorList[i].resizeFloor(this, currentY));
            } else {
                const newFloor = new Floor(tweenStartX, currentY, this);
                this.floorList.push(newFloor);
                newTweenList.push(animateTo({target: newFloor.sprite, x: 0}));
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
        objectToResize.forEach((obj)=>{
            animateTo({target: obj, scale: this.getScale()}).start();
        });
    }

    listenerSetup() {
        eventEmitter.on('assigned-desk', (data)=>{
            this.takenDesks += 1;
            if (this.takenDesks == 5) {
                eventEmitter.emit('stage-one-task-completed', {});
                gameFSM.nextStage();
            }
            if (this.takenDesks == 10) {
                gameFSM.nextStage();
            }
        });
    }

    getScale() {
        return this.scale;
    }

    getColumns() {
        return this.cols;
    }

    getWidth() {
        return officeWidth;
    }
}

export {Office};
