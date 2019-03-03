import {deskTexture} from '../../controllers/common/textures.js';
import {uv2px, px2uv, animateTo} from '../../controllers/common/utils.js';
import {officeContainer, floorContainer, deskContainer, eventEmitter} from '../../controllers/game/gameSetup.js';
const deskScale = 0.1;
const deskOffsetY = -0.05;
class Floor {
    constructor(x, y, office) {
        this.texture = new PIXI.Graphics();
        this.texture.beginFill(0xffd9d9);
        this.texture.drawRect(0, 0, uv2px(office.getWidth(), 'w'), uv2px(0.05, 'w')*office.getScale());
        this.texture.endFill();
        this.texture.beginFill(0xef807f);
        this.texture.drawRect(0, uv2px(0.05, 'w')*office.getScale(), uv2px(office.getWidth(), 'w'), uv2px(0.02, 'w')*office.getScale());
        this.texture.endFill();

        this.sprite = new PIXI.Sprite();
        this.sprite.x = uv2px(x, 'w');
        this.sprite.y = uv2px(y, 'h');
        this.sprite.addChild(this.texture);
        this.sprite.controller = this;

        this.deskList = [];
        let colSpace = office.getWidth() / (office.getColumns() + 1);

        for (let i = office.getColumns(); i > 0; i--) {
            this.createDesk(office.getScale(), i * colSpace, deskOffsetY);
        }

        floorContainer.addChild(this.sprite);
    }

    createDesk(scale, x, y) {
        const desk = new PIXI.Sprite(deskTexture);
        desk.x = uv2px(x, 'w');
        desk.y = uv2px(y, 'h');
        desk.type = 'desk';
        desk.taken = false;
        desk.scale.set(deskScale*scale);
        desk.interactive = true;
        desk.isTaken = false;
        this.sprite.addChild(desk);
        this.deskList.push(desk);
        return desk;
    }


    resizeFloor(office, y) {
        let tweenList = [];

        tweenList.push(animateTo({'target': this.texture, 'scaleY': office.getScale()}));

        let colSpace = office.getWidth() / (office.getColumns() + 1);
        let indx = 0;
        for (let i = office.getColumns(); i > 0; i--) {
            if (this.deskList.length > indx) {
                tweenList.push(animateTo({'target': this.deskList[indx], 'scale': office.getScale(), 'x': i*colSpace}));
            } else {
                this.createDesk(1, i * colSpace, deskOffsetY);
                // tweenList.push(animateTo({'target': newDesk, 'x': i*colSpace}));
                
            }
            indx++;
        }

        tweenList.push(animateTo({'target': this.sprite, 'y': y}));
        return tweenList;
    }
}


export {Floor};
