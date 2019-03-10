import {pixiApp} from '../../../controllers/game/gameSetup.js';
import {spacingUtils as space} from '../../../controllers/common/utils.js';
import {SPRITES} from '../../../controllers/common/textures.js';

export default class {
    constructor({machineConfig, side}) {
        this.dataServer = side === 'left' ? SPRITES.dataServerRejected : SPRITES.dataServerAccepted;
        console.log(side);
        this.dataServerScale = 0.22;
        this.directionVector = side === 'left' ? -1 : 1;
        console.log(this.directionVector);
        this.machineConfig = machineConfig;

        this.centerX = space.getCenteredChildX(this.machineConfig.x, this.machineConfig.width, this.dataServer.width*this.dataServerScale);

        this.serverConfig = {
            x: this.centerX + this.directionVector*1.6*(this.dataServer.width*this.dataServerScale),
            y: this.machineConfig.y - 10,
        };
        console.log(this.serverConfig.x);
    }

    draw() {
        this.dataServer.scale.set(this.dataServerScale);
        this.dataServer.y = this.serverConfig.y;
        this.dataServer.x = this.serverConfig.x;
        this.dataServer.loop = false;
        this.dataServer.animationSpeed = 0.17;
        this.dataServer.gotoAndStop(0);
        pixiApp.stage.addChild(this.dataServer);
    }

    getSprite() {
        return this.dataServer;
    }
}
