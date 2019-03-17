import * as PIXI from 'pixi.js';
import {mlLabStageContainer} from '../../../controllers/game/gameSetup.js';
import {uv2px, clamp} from '../../../controllers/common/utils.js';
import COLORS from '../../../controllers/constants/pixi-colors.js';


export default class {
    constructor(options) {
        this.heightMain = clamp(uv2px(0.1, 'w'), 40, 50);
        this.heightShadow = clamp(this.heightMain/5, 20, 30);
        this.yAnchor = options.y;
    }

    draw() {
        // main floor
        const surface = new PIXI.Graphics();
        surface.beginFill(COLORS.ROSE_MAIN);
        surface.drawRect(0, 0, uv2px(1, 'w'), this.heightMain);
        surface.endFill();
        surface.x = 0;
        surface.y = this.yAnchor-this.heightMain;
        // dark pink shadow
        const side = new PIXI.Graphics();
        side.beginFill(COLORS.ROSE_SHADOW);
        side.drawRect(0, 0, uv2px(1, 'w'), this.heightShadow);
        side.endFill();
        side.x = 0;
        side.y = this.yAnchor;
        // add the floor to the container
        // TODO change this to mlLabStageContainer
        mlLabStageContainer.addChild(surface);
        mlLabStageContainer.addChild(side);
    }
}
