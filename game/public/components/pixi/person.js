import {pixiApp, eventEmitter} from '../../controllers/game/gameSetup.js';
import {bluePersonTexture} from '../../controllers/common/textures.js';
import {uv2px} from '../../controllers/common/utils.js';
import {Office, spotlight} from './office';

function onPersonHover(event) {
    eventEmitter.emit('person-hovered', {});
    candidateHovered = this.id;
}

function moveCandidate() {
    if (!this.inSpotlight && candidateInSpot == null) {
        //move candidate to spotlight
        this.tween.stop().clear();
        this.tween.to({
            x: spotlight.x, 
            y: spotlight.y
        });
        this.tween.easing=PIXI.tween.Easing.inQuart();
        this.tween.time = 600;
        this.tween.start();

        spotOpen = false;
        this.inSpotlight = true;
        candidateInSpot = this.id;
    }
    else if (this.inSpotlight) {
        //move candidate back to line
        this.tween.stop().clear();
        this.tween.to({
            x: this.originalX, 
            y: this.originalY
        });
        this.tween.easing=PIXI.tween.Easing.inQuart();
        this.tween.time = 600;
        this.tween.start();

        spotOpen = true;
        this.inSpotlight = false;
        candidateInSpot = null;
    }
    else {
        console.log("some condition not satisfied")
        console.log("inspotlight " + this.inSpotlight)
        console.log("spotOpen " + spotOpen)

    }
}

function createPerson(x, y, id, texture) {
    const person = new PIXI.Sprite(texture);
    person.scale.set(0.2);
    person.interactive = true;
    person.buttonMode = true;
    person.inSpotlight = false;
    person.id = id;
    person.x = uv2px(x, 'w');
    person.y = uv2px(y, 'h');
    person.originalX = person.x;
    person.originalY = person.y;
    person.type = 'person';
    person.anchor.set(0.5);
    person.tween = PIXI.tweenManager.createTween(person);
    person
        .on('mouseover', onPersonHover)
        .on('pointerdown', moveCandidate)

    return person;
}

export {createPerson};
