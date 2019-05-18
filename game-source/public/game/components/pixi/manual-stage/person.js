import {pixiApp, eventEmitter} from '../../../controllers/game/gameSetup.js';
import {uv2px, screenSizeDetector} from '../../../controllers/common/utils.js';
import {spotlight} from './office';
import EVENTS from '../../../controllers/constants/events';
import SCALES from '../../../controllers/constants/pixi-scales.js';

let showedInstructions = false;

function onPersonHover(event) {
    // PLACEHOLDER FUNCTION FOR HOVER EVENT
    // eventEmitter.emit(EVENTS.PERSON_HOVERED, {});
}

function animateThisCandidate(person, newX, newY) {
    person.tween.stop().clear();
    person.tween.to({
        x: newX,
        y: newY,
    });
    person.tween.easing=PIXI.tween.Easing.inOutSine();
    person.tween.time = 500;
    person.tween.start();
}

function moveCandidate() {
    if (!showedInstructions) {
        eventEmitter.emit(EVENTS.UPDATE_INSTRUCTIONS, {type: 'manual-eval-show'});
        showedInstructions = true;
    }
    // display clicked person's CV
    candidateClicked = this.id;
    eventEmitter.emit(EVENTS.DISPLAY_THIS_CV, {});

    // empty spotlight
    if (!this.inSpotlight && candidateInSpot == null) {
        // move candidate to spotlight
        animateThisCandidate(this, spotlight.x, spotlight.y);
        eventEmitter.emit(EVENTS.CHANGE_SPOTLIGHT_STATUS, {spotlightOccupied: false, spotlightFill: true});

        this.inSpotlight = true;
        candidateInSpot = this.id;
    }
    // candidate in spotlight clicked
    else if (this.inSpotlight) {
        // move candidate back to line
        animateThisCandidate(this, this.originalX, this.originalY);
        eventEmitter.emit(EVENTS.CHANGE_SPOTLIGHT_STATUS, {spotlightOccupied: true, spotlightFill: false});

        this.inSpotlight = false;
        candidateInSpot = null;
    }
    // candidate in line clicked and spotlight is filled
    else if (!this.inSpotlight && candidateInSpot != null) {
        eventEmitter.emit(EVENTS.RETURN_CANDIDATE, {});
        animateThisCandidate(this, spotlight.x, spotlight.y);
        eventEmitter.emit(EVENTS.CHANGE_SPOTLIGHT_STATUS, {spotlightOccupied: true, spotlightFill: true});

        this.inSpotlight = true;
        candidateInSpot = this.id;
    }
}

function createPerson(x, y, id, texture) {
    const person = new PIXI.Sprite(texture);
    person.scale.set(SCALES.PEOPLE[screenSizeDetector()]);
    person.interactive = true;
    person.buttonMode = true;
    person.inSpotlight = false;
    person.id = id;
    person.uvX = x;
    person.x = uv2px(x, 'w');
    person.y = uv2px(y, 'h');
    person.originalX = person.x;
    person.originalY = person.y;
    person.type = 'person';
    person.anchor.set(0.5);
    person.tween = PIXI.tweenManager.createTween(person);
    person
        .on('mouseover', onPersonHover)
        .on('pointerdown', moveCandidate);

    return person;
}

export {createPerson, animateThisCandidate};
