import { officeContainer, deskContainer, eventEmitter, animateTo } from '../shared.js';
import { gameFSM } from '../gameStates.js';
import { createDesk } from './desk.js';

class Office {
    constructor() {
        this.sizeConfig = [
            {row: 4, col: 4, width: 300, height: 300, offsetX: 50, offsetY: 50, scale: 1},
            {row: 6, col: 8, width: 300, height: 300, offsetX: 50, offsetY: 50, scale: 0.5},
            {row: 8, col: 12, width: 300, height: 300, offsetX: 50, offsetY: 50, scale: 0.7}
        ]
        this.takenDesks = 0;
        this.deskList = [];
        this.size = 0;
        this.scale = 1;

        this.drawFloor(560);
        this.drawFloor(300);

        this.growOffice();
        this.listenerSetup();

    }

    drawFloor(y) {
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(0xffd9d9);
        this.surface.drawRect(0, 0, 800, 40);
        this.surface.endFill();
        this.surface.x = 0;
        this.surface.y = y;

        this.side = new PIXI.Graphics();
        this.side.beginFill(0xef807f);
        this.side.drawRect(0, 0, 800, 20);
        this.side.endFill();
        this.side.x = 0;
        this.side.y = y+40;

        deskContainer.addChild(this.surface);
        deskContainer.addChild(this.side);

    }

    growOffice(objectToResize=[]){
        // getting config according to office size
        var row = this.sizeConfig[this.size].row,
        col = this.sizeConfig[this.size].col,
        scale = this.sizeConfig[this.size].scale,
        width = this.sizeConfig[this.size].width,
        height = this.sizeConfig[this.size].height,
        offsetY = this.sizeConfig[this.size].offsetY,
        offsetX = this.sizeConfig[this.size].offsetX;

        this.scale *= scale;

        //creating office floor background
        var oldOfficeBackground = this.texture;
        this.texture = new PIXI.Sprite(this.sizeConfig[this.size].texture);
        this.texture.type = "office";
        this.texture.scale.set(0.7);
        officeContainer.addChild(this.texture);
        this.texture.parent.setChildIndex(this.texture, 0);
        if (this.size > 0){
            this.texture.parent.setChildIndex(this.texture, 1);
        }
        this.texture.x = offsetX;
        this.texture.y = -300;
        var newOfficeTween = animateTo({target:this.texture, x:offsetX, y:offsetY, easing:PIXI.tween.Easing.inExpo()});


        //adding/moving desks and people at them
        var indx = 0;
        var y = offsetY;
        var newDeskTweens = [];
        var moveDeskTweens = [];
        for (var i = 0; i < row; i++) {
            var x = offsetX;
            for (var k = 0; k < col; k++) {
                if (this.deskList.length > indx){
                    moveDeskTweens.push(animateTo({target:this.deskList[indx], scale:scale, x:x, y:y}));

                    //if a person sits at the desk, it has to go with the desk
                    if (this.deskList[indx].controller.isTaken()){
                        moveDeskTweens.push(animateTo({target:this.deskList[indx].controller.getPerson(), scale:scale, x:x, y:y}));
                    }
                } else {
                    var newDesk = createDesk(this.scale, x, -100);
                    newDeskTweens.push(animateTo({target:newDesk, y:y}));
                    this.deskList.push(newDesk);
                }
                x += width/(row-1);
                indx++;
            }
            y += height/(col-1);
        }

        newOfficeTween.start();
        newOfficeTween.on('end', ()=>{
            //office is grows. First rescale outside people, delete old background, move existing desks and ppl, THEN add new desks
            objectToResize.forEach((obj)=>{
                animateTo({target:obj, scale:scale}).start();
            })
            if (this.size > 1){
                oldOfficeBackground.parent.removeChild(oldOfficeBackground);
                moveDeskTweens.forEach((mytween)=>{
                    mytween.start();
                });

                moveDeskTweens[moveDeskTweens.length-1].on('end', ()=>{
                    newDeskTweens.forEach((mytween)=>{
                        mytween.start();
                    });
                });
            }
            //initial office creation. Just add new desks.
            else {
                newDeskTweens.forEach((mytween)=>{
                    mytween.start();
                });
            }
        });

        this.size++;
    }

    listenerSetup(){
        eventEmitter.on('assigned-desk', (data)=>{
            this.takenDesks += 1
            if (this.takenDesks == 3){
                gameFSM.nextStage();
            }
            if (this.takenDesks == 6){
                gameFSM.nextStage();
            }
        });
    }
}

export { Office };
