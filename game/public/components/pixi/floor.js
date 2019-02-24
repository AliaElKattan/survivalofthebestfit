import {deskTexture} from '../../controllers/common/textures.js';
import {uv2px, px2uv, animateTo} from '../../controllers/common/utils.js';
import {officeContainer, floorContainer, deskContainer, eventEmitter} from '../../controllers/game/gameSetup.js';


function createDesk(scale, x, y) {
    const desk = new PIXI.Sprite(deskTexture);
    desk.x = uv2px(x, 'w');
    desk.y = uv2px(y, 'h');
    desk.type = 'desk';
    desk.taken = false;
    desk.scale.set(0.1*scale);
    desk.interactive = true;
    desk.isTaken = false;
    return desk;
}

function createFloor(x, y, office) {
    const floor = new PIXI.Graphics();
    floor.beginFill(0xffd9d9);
    floor.drawRect(0, 0, uv2px(office.getWidth(), 'w'), uv2px(0.05, 'w')*office.getScale());
    floor.endFill();
    floor.beginFill(0xef807f);
    floor.drawRect(0, uv2px(0.05, 'w')*office.getScale(), uv2px(office.getWidth(), 'w'), uv2px(0.02, 'w')*office.getScale());
    floor.endFill();

    const sprite = new PIXI.Sprite();
    sprite.x = uv2px(x, 'w');
    sprite.y = uv2px(y, 'h');
    sprite.addChild(floor);

    const deskOffsetY = -0.05;
    const colSpace = office.getWidth() / (office.getColumns() + 1);

    for (let i = 0; i < office.getColumns(); i++) {
        const newDesk = createDesk(office.getScale(), i * colSpace, deskOffsetY);
        sprite.addChild(newDesk);
    }

    floorContainer.addChild(sprite);
    return sprite;
}

export {createFloor};
