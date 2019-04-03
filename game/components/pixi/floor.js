import {deskTexture} from '../../controllers/common/textures.js';
import {uv2px, animateTo} from '../../controllers/common/utils.js';

const deskScale = 0.1;
const deskOffsetY = -0.01;
const deskOffsetX = -0.01;

class Floor {
    constructor(x, y, office) {
        this.texture = new PIXI.Graphics();
        this.texture.beginFill(0xffd9d9);
        this.texture.drawRect(0, 0, uv2px(office.getWidth(), 'w'), uv2px(0.05, 'h') * office.getScale());
        this.texture.endFill();
        this.texture.beginFill(0xef807f);
        this.texture.drawRect(0, uv2px(0.05, 'h') * office.getScale(), uv2px(office.getWidth(), 'w'), uv2px(0.02, 'h') * office.getScale());
        this.texture.endFill();
        this.texture.type = 'FloorTexture';

        this.sprite = new PIXI.Sprite();
        this.sprite.x = uv2px(x, 'w');
        this.sprite.y = uv2px(y, 'h');
        this.sprite.type = 'FloorSprite';
        this.sprite.addChild(this.texture);
        this.sprite.controller = this;

        this.deskList = [];
        const columnWidth = office.getWidth() / (office.getColumns() + 1);
        for (let i = office.getColumns(); i > 0; i--) {
            this.createDesk(office.getScale(), i * columnWidth + deskOffsetX, deskOffsetY * office.getScale());
        }

        office.container.addChild(this.sprite);
    }

    createDesk(scale, x, y) {
        const desk = new PIXI.Sprite(deskTexture);
        desk.type = 'desk';
        desk.isTaken = false;
        desk.anchor.set(0.5);
        desk.x = uv2px(x, 'w');
        desk.y = uv2px(y, 'h');
        desk.interactive = true;
        desk.scale.set(deskScale*scale);

        this.sprite.addChild(desk);
        this.deskList.push(desk);

        return desk;
    }


    resizeFloor(office, y) {
        const tweenList = [];

        const columnWidth = office.getWidth() / (office.getColumns() + 1);
        let indx = 0;
        for (let i = office.getColumns(); i > 0; i--) {
            if (this.deskList.length > indx) { // first move existing desks to their new positions
                tweenList.push(animateTo({
                    'target': this.deskList[indx],
                    'scale': office.getExpansionScale(),
                    'x': i*columnWidth + deskOffsetX,
                    'y': deskOffsetY * office.getScale(),
                }));
            } else { // then create any new desks and animate them into new position
                const newDesk = this.createDesk(office.getScale(), i * columnWidth - 1, deskOffsetY * office.getScale());
                tweenList.push(animateTo({
                    'target': newDesk,
                    'x': i*columnWidth + deskOffsetX,
                }));
            }
            indx++;
        }
        // scale floorTexture vertically so that it looks like we are going further
        tweenList.push(animateTo({
            'target': this.texture,
            'scaleY': office.getExpansionScale(),
        }));
        // move the whole floor with all the children to the new y coordinate
        tweenList.push(animateTo({
            'target': this.sprite,
            'y': y,
        }));
        return tweenList;
    }
}

export {Floor};
