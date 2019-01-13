import { deskTexture } from '../textures.js'
import { deskContainer, animateTo } from '../shared.js';

class deskController {
    constructor(parent) {
        this.parent = parent;
        this.person = null;
    }

    setPerson(person){
        this.person = person;
    }

    removePerson(){
        return;
    }

    getPerson(){
        return this.person;
    }

    isTaken(){
        return this.person != null;
    }

    moveDesk(scale, x, y, time = 1000){
        animateTo({target:this.parent, x:x, y:y, scale:scale, time:time}).start();

        //if a person sits at the desk, it has to go with the desk
        if (this.isTaken()){
            animateTo({target:this.getPerson(), x:x, y:y, scale:scale, time:time}).start();
        }
    }
}

function createDesk(scale, x, y){
    var desk = new PIXI.Sprite(deskTexture);
    desk.x = x
    desk.y = y
    desk.type = "desk";
    desk.taken = false;
    desk.scale.set(0.1*scale);
    desk.interactive = true;
    desk.controller = new deskController(desk);

    deskContainer.addChild(desk);

    return desk;
}

export { createDesk };
