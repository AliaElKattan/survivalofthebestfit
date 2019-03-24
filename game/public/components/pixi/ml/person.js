import {mlLabStageContainer} from '~/public/controllers/game/gameSetup.js';
import {bluePersonTexture} from '~/public/controllers/common/textures.js';
import {yellowPersonTexture} from '~/public/controllers/common/textures.js';

export default class {
    constructor({x, parent, personData, id}) {
        this.personData = personData;
        this.person = this.personData.color === 'yellow' ? new PIXI.Sprite(yellowPersonTexture) : new PIXI.Sprite(bluePersonTexture);
        this.x = x;
        this.parentContainer = parent;
        this.id = id;
        this.personData.id = this.id;
    }

    draw() {
        this.person.scale.set(0.2);
        this.person.x = this.x;
        this.person.y = - this.person.height/2;
        this.person.id = this.id;
        this.person.anchor.set(0.5);
        // this.person.on('mouseover', onPersonHover);
        this.parentContainer.addChild(this.person);
    }

    getData() {
        return this.personData;
    }

    removeFromLine() {
        // this.person.setParent(mlLabStageContainer);
        const {x, y} = this.person.getGlobalPosition();
        mlLabStageContainer.addChild(this.person);
        this.person.x = x;
        this.person.y = y;
        const door = mlLabStageContainer.getChildByName('doorAccepted');
        // console.log(door.x);
        const tween = PIXI.tweenManager.createTween(this.person);
        tween.to({x: door.x});
        tween.time = 700;
        tween.on('end', () => {
            mlLabStageContainer.removeChild(this.person);
        });
        tween.start();

        // console.log(this.person.x);
    }
}
// function onPersonHover(event) {
//     eventEmitter.emit('ml-person-hovered', {});
//     candidateInScope = this.id;
//     console.log('Current Candidate ID: ' + candidateInScope);
// }
