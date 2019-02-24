import {pixiApp, cvViewerContainer, eventEmitter} from '../../../controllers/game/gameSetup.js';
import {spacingUtils, uv2px} from '../../../controllers/common/utils.js';

class CVViewer {
    constructor(x, y, width, height, cvFeatureList, cvObjByStage) {
        this.x = uv2px(x, 'w');
        this.y = uv2px(y, 'h');
        this.width = uv2px(width, 'w');
        this.height = uv2px(height, 'h');
        this.cvObj = cvObjByStage;

        this.featureList = cvFeatureList;

        this.barHeight = 5;
        this.barStartX = this.x + 10;
        this.barWidth = this.width - 20;
        this.barY = spacingUtils.getOneThirdChildY(this.y, this.height, this.barHeight);

        this.box = new PIXI.Graphics();

        this.box.beginFill(0xffffff);
        this.box.lineStyle(4, 0x7ba6bf, 1);
        this.box.drawRect(0, 0, this.width, this.height);
        this.box.endFill();
        this.box.x = this.x;
        this.box.y = this.y;
        cvViewerContainer.addChild(this.box);

        const style = new PIXI.TextStyle({
            fontFamily: '"Lucida Console", Monaco, monospace',
            fontSize: 12,
            fontWeight: 700,
            fill: 'black',
            stroke: '#ff3300',
            wordWrap: true,
            wordWrapWidth: this.width - 10,
        });

        this.style2 = new PIXI.TextStyle({
            fontFamily: '"Lucida Console", Monaco, monospace',
            fontSize: 24,
            fontWeight: 700,
            fill: 'black',
            stroke: '#ff3300',
            wordWrap: true,
            wordWrapWidth: this.width - 10,
        });

        this.createNewCV(this.cvObj[0]);
    }

    createNewBar(skillName, skillLevel, barY) {
        const skillLevelWidth = (skillLevel / 10) * this.barWidth;

        const style = new PIXI.TextStyle({
            fontFamily: '"Lucida Console", Monaco, monospace',
            fontSize: 8,
            fontWeight: 700,
            fill: 'black',
            stroke: '#ff3300',
            wordWrap: true,
            wordWrapWidth: this.width - 10,
        });

        // add skill name as text
        var skillName = new PIXI.Text(skillName, style);
        cvViewerContainer.addChild(skillName);
        skillName.position.set(this.x + 10, barY - 10);

        // add skill bar background
        const skillBarBg = new PIXI.Graphics();
        skillBarBg.beginFill(0x7ba6bf);
        skillBarBg.drawRect(0, 0, this.barWidth, this.barHeight);
        skillBarBg.endFill();
        skillBarBg.x = this.barStartX;
        skillBarBg.y = barY;
        cvViewerContainer.addChild(skillBarBg);

        // add skill bar
        const skillBar = new PIXI.Graphics();
        skillBar.beginFill(0x2d4654);
        skillBar.drawRect(0, 0, skillLevelWidth, this.barHeight);
        skillBar.endFill();
        skillBar.x = this.barStartX;
        skillBar.y = barY;
        cvViewerContainer.addChild(skillBar);
    }

    createNewCV(cv) {
        // add Name as text
        const candidateName = new PIXI.Text(cv.name, this.style);
        cvViewerContainer.addChild(candidateName);
        candidateName.position.set(this.x + 10, this.y + 10);

        let barY = this.y + 60;

        this.featureList.forEach(function(feature, index) {
            console.log(index); // index
            console.log(feature); // value

            this.createNewBar(feature, cv.qualifications[index], barY);
            barY += 30;
        }.bind(this));
    }
}

export {CVViewer};
