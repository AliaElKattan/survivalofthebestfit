import {mlLabStageContainer} from '~/public/controllers/game/gameSetup.js';
import {bluePersonTexture} from '~/public/controllers/common/textures.js';
import {yellowPersonTexture} from '~/public/controllers/common/textures.js';
import {eventEmitter} from '~/public/controllers/game/gameSetup.js';
import SCALES from '~/public/controllers/constants/pixi-scales.js';
import EVENTS from '~/public/controllers/constants/events.js';
import {screenSizeDetector} from '~/public/controllers/common/utils.js';


export default class {
    constructor({x, parent, personData, id}) {
        this.personData = personData;
        this.person = this.personData.color === 'yellow' ? new PIXI.Sprite(yellowPersonTexture) : new PIXI.Sprite(bluePersonTexture);
        this.x = x;
        this.parentContainer = parent;
        this.id = id;
        this.personData.id = this.id;
        eventEmitter.on(EVENTS.RESIZE, this._draw.bind(this));
    }

    addToPixi() {
        this.person.id = this.id;
        this.person.anchor.set(0.5);
        this.parentContainer.addChild(this.person);
        this._draw();
    }

    _draw() {
        this.person.scale.set(SCALES.PEOPLE[screenSizeDetector()]);
        this.person.x = this.x;
        this.person.y = - this.person.height/2;
    }

    getData() {
        return this.personData;
    }

    removeFromLine() {
        const {x, y} = this.person.getGlobalPosition();
        mlLabStageContainer.addChild(this.person);
        this.person.x = x;
        this.person.y = y;
        const door = mlLabStageContainer.getChildByName('doorEntry');
        // console.log(door);
        const tween = PIXI.tweenManager.createTween(this.person);
        tween.to({x: door.x + 40});
        tween.time = 700;
        tween.on('end', () => {
            mlLabStageContainer.removeChild(this.person);
            eventEmitter.emit(EVENTS.PLAY_DOOR_ANIMATION, {direction: 'reverse'});
        });
        tween.start();
    }
}
