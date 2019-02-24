import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
import {officeContainer, deskContainer, eventEmitter} from '../../controllers/game/gameSetup.js';
import {gameFSM} from '../../controllers/game/stateManager.js';
import {createDesk} from './desk.js';
import {uv2px, px2uv, spacingUtils as space, animateTo} from '../../controllers/common/utils.js';

class Office {
    constructor() {
        this.sizeConfig = [
            {row: 1, col: 5, width: 0.8, height: 0.25, offsetX: 0.1, offsetY: 0.08, scale: 1},
            {row: 1, col: 10, width: 0.8, height: 0.25, offsetX: 0.1, offsetY: 0.06, scale: 0.8},
            {row: 2, col: 10, width: 0.8, height: 0.25, offsetX: 0.1, offsetY: 0.08, scale: 1},
            // {row: 8, col: 12, width: 300, height: 300, offsetX: 50, offsetY: 50, scale: 0.7}
        ];
        this.takenDesks = 0;
        this.deskList = [];
        this.size = 0;
        this.scale = 1;

        const coorObj = uv2px({x: 1, y: 0.5}); // if you prefer objects

        // first (top floor) office floor Y
        this.topFloor = 1;
        this.topFloorY = 0.5;
        this.drawFloor(this.topFloorY);

        // ground floor
        this.drawFloor(space.absMinusSize(40, 'h'));
        this.growOffice();
        this.listenerSetup();
    }

    drawFloor(y) {
        // main floor
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(0xffd9d9);
        this.surface.drawRect(0, 0, uv2px(1, 'w'), 40);
        this.surface.endFill();
        this.surface.x = 0;
        this.surface.y = uv2px(y, 'h');

        // dark pink side of the floor
        this.side = new PIXI.Graphics();
        this.side.beginFill(0xef807f);
        this.side.drawRect(0, 0, uv2px(1, 'w'), 20);
        this.side.endFill();
        this.side.x = 0;
        this.side.y = uv2px(y, 'h') + 40;

        deskContainer.addChild(this.surface);
        deskContainer.addChild(this.side);
    }

    growOffice(objectToResize=[]) {
        // getting config according to office size
        const row = this.sizeConfig[this.size].row;
        const col = this.sizeConfig[this.size].col;
        const scale = this.sizeConfig[this.size].scale;
        const width = this.sizeConfig[this.size].width;
        const height = this.sizeConfig[this.size].height;
        const offsetY = this.sizeConfig[this.size].offsetY;
        const offsetX = this.sizeConfig[this.size].offsetX;

        this.scale = scale;

        // creating office floor background
        const oldOfficeBackground = this.texture;

        // adding/moving desks and people at them
        const newOfficeTween = this.createNewOfficeTween(offsetX, offsetY);
        const [newDeskTweens, moveDeskTweens] = this.createDeskPeopleTweens(row, col, width, height, offsetX, offsetY);
        this.sequenceTweens(newOfficeTween, objectToResize, oldOfficeBackground, moveDeskTweens, newDeskTweens);

        this.size++;
    }

    createNewOfficeTween(offsetX, offsetY) {
        this.texture = new PIXI.Sprite(this.sizeConfig[this.size].texture);
        this.texture.type = 'office';
        this.texture.scale.set(0.7);
        officeContainer.addChild(this.texture);
        this.texture.parent.setChildIndex(this.texture, 0);
        if (this.size > 0) {
            this.texture.parent.setChildIndex(this.texture, 1);
        }
        this.texture.x = uv2px(offsetX, 'w');
        this.texture.y = uv2px(-1, 'h');

        return animateTo({target: this.texture, x: offsetX, y: offsetY, easing: PIXI.tween.Easing.inExpo()});
    }

    createDeskPeopleTweens(row, col, width, height, offsetX, offsetY) {
        let indx = 0;
        let y = 0.5 - offsetY;
        const newDeskTweens = [];
        const moveDeskTweens = [];

        for (let i = 0; i < row; i++) {
            let x = (1 - width)/2;

            if (i > 0 && this.topFloor < i+1) {
                this.topFloorY -= height;
                this.drawFloor(this.topFloorY);
                this.topFloor++;
            }

            for (let k = 0; k < col; k++) {
                if (this.deskList.length > indx) {
                    moveDeskTweens.push(animateTo({target: this.deskList[indx], scale: this.getScale(), x: x, y: y}));

                    // if a person sits at the desk, it has to go with the desk
                    if (this.deskList[indx].controller.isTaken()) {
                        const middleOfDeskX = x + px2uv(this.deskList[indx].width, 'w')/2;
                        const middleOfDeskY = y + px2uv(this.deskList[indx].height, 'h')/2;
                        moveDeskTweens.push(animateTo({target: this.deskList[indx].controller.getPerson(), scale: this.getScale(), x: middleOfDeskX, y: middleOfDeskY}));
                    }
                } else {
                    const newDesk = createDesk(this.scale, x, -1);
                    newDeskTweens.push(animateTo({target: newDesk, y: y}));
                    this.deskList.push(newDesk);
                }
                x += width/(col);
                indx++;
            }
            y -= height;
        }
        return [newDeskTweens, moveDeskTweens];
    }

    sequenceTweens(newOfficeTween, objectToResize, oldOfficeBackground, moveDeskTweens, newDeskTweens) {
        newOfficeTween.start();
        newOfficeTween.on('end', ()=>{
            // office is grows. First rescale outside people, delete old background, move existing desks and ppl, THEN add new desks
            objectToResize.forEach((obj)=>{
                animateTo({target: obj, scale: this.getScale()}).start();
            });
            if (this.size > 1) {
                oldOfficeBackground.parent.removeChild(oldOfficeBackground);
                moveDeskTweens.forEach((mytween)=>{
                    mytween.start();
                });

                moveDeskTweens[moveDeskTweens.length-1].on('end', ()=>{
                    newDeskTweens.forEach((mytween)=>{
                        mytween.start();
                    });
                });
            } else {
                // initial office creation. Just add new desks.
                newDeskTweens.forEach((mytween)=>{
                    mytween.start();
                });
            }
        });
    }

    listenerSetup() {
        eventEmitter.on('assigned-desk', (data)=>{
            this.takenDesks += 1;
            if (this.takenDesks == 5) {
                eventEmitter.emit('task-complete', {});
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
}

export {Office};
