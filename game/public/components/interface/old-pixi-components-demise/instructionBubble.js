// import { bubbleContainer} from '../shared.js';
import {pixiApp, eventEmitter} from '../../../controllers/game/gameSetup.js';
import {xIcon} from '../../../controllers/common/textures.js';
import {uv2px, spacingUtils as space} from '../../../controllers/common/utils.js';

let instructionContainer;
class TextBox {
    constructor(width, height, messageText, overlay=true) {
        instructionContainer = new PIXI.Container();
        this.width = width;
        this.height = height;
        this.text = messageText;
        this.alive = true;
        if (overlay) this.drawFullScreenOverlay();
        this.drawBox();
        pixiApp.stage.addChild(instructionContainer);
    }

    drawBox() {
        this.x = space.screenCenterX(this.width);
        this.y = space.screenCenterY(this.height);

        const style = new PIXI.TextStyle({
            fontFamily: 'Lucida Console',
            fontSize: 14,
            fill: 'black',
            stroke: '#ff3300',
            wordWrap: true,
            wordWrapWidth: this.width - 10,
            lineHeight: 20,
        });

        const message = new PIXI.Text(this.text, style);

        this.height2 = message.height;

        const rectangle = new PIXI.Graphics();
        rectangle.lineStyle(4, 0x99CCFF, 1);
        rectangle.beginFill(0xFFFFFF);
        rectangle.drawRect(this.x, this.y, this.width, this.height, 10);
        rectangle.endFill();
        instructionContainer.addChild(rectangle);

        rectangle.buttonMode = true;
        rectangle.interactive = true;
        rectangle.on('pointertap', onPress);

        rectangle.addChild(message);
        message.position.set(this.x + 5, this.y + 5);

        const icon = new PIXI.Sprite(xIcon);
        icon.interactive = true;
        icon.buttonMode = true;

        rectangle.addChild(icon);
        icon.scale.set(.04);
        icon.x = this.x + message.width + 15;
        icon.y = this.y;
    }

    drawFullScreenOverlay() {
        const bg = new PIXI.Container();
        bg.alpha = 0.5;

        const overlay = new PIXI.Graphics();
        overlay.beginFill(0xFFFFFF);
        overlay.drawRect(0, 0, uv2px(1, 'w'), uv2px(1, 'h'));
        overlay.endFill();

        bg.addChild(overlay);
        instructionContainer.addChild(bg);
    }
}

function onPress(event) {
    eventEmitter.emit('instructionAcked', {});
    this.data = event.data;
    this.visible = false;
    hideInstruction();
}

function hideInstruction() {
    instructionContainer.removeChildren();
    instructionContainer.parent.removeChild(instructionContainer);
    instructionContainer.destroy();
}

export {TextBox};
