
import EVENTS from '~/public/game/controllers/constants/events';
import CLASSES from '~/public/game/controllers/constants/classes';
import MlOnboardingUI from '~/public/game/components/interface/ml/onboarding-instructions/onboarding-instructions.js';
import {waitForSeconds, clamp} from '~/public/game/controllers/common/utils';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class MlLabOnboarding {
    constructor() {
        this.instructions = txt.mlLabStage.onboarding;
        this.instructionIndex = 0;
        this.pixiInstructionGroups = [
            ['machine', 'scanray', 'conveyorBelt'],
            ['machine', 'scanray', 'conveyorBelt'],
            ['machine', 'scanray', 'conveyorBelt'],
            ['machine', 'scanray', 'conveyorBelt'],
            ['machine', 'scanray', 'conveyorBelt'],
        ];
        this.instructionsUI = new MlOnboardingUI();
        this._addEventListeners();
        this.init();
    }

    init() {
        // if (Array.isArray(this.instructions) || (this.instructions.length !== this.pixiInstructionGroups.length)) {
        //     throw new Error(`MlLabOnboarding setup is not valid, check text template and pixi instruction groups`);
        // };
        this.onboarding().then(() => {
            console.log('we are done!');
        });
    }

    onboarding() {
        console.log('launch onboarding!');

        const displayInstructions = (index) => {
            return new Promise((resolve, reject) => {
                this.instructionsUI.show({text: this.instructions[index].text}).then(() => {
                    this.instructionIndex++;
                    console.log(`${this.instructionIndex}:${this.instructions.length}`);
                    if (this.instructionIndex < this.instructions.length) {
                        console.log('display new instruction!');
                        return displayInstructions(this.instructionIndex);
                    } else {
                        console.log('we are done, resolve the matters!');
                        this.moveOn();
                    }
                });
            });
        };

        return displayInstructions(this.instructionIndex);
    };

    moveOn() {
        console.log('lets move on1');
    }

    stop() {
    }

    getPixiModes() {
        const modes = [
            ['machine', 'scanray', 'conveyorBelt'],

        ];
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
    }

    destroy() {
    }
}
