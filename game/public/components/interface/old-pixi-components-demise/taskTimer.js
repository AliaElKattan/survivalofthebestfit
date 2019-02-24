import { pixiApp, eventEmitter } from '../../../controllers/game/gameSetup.js';
import { spacingUtils, uv2px } from '../../../controllers/common/utils.js';

// var taskTimerContainer = new PIXI.Container();
// let ticker = PIXI.Ticker.shared;

class TaskTimer {
    constructor(x, y, width, height, text, totalLife, toHireNum) {
        this.taskTimerContainer = new PIXI.Container();
        this.x = uv2px(x, 'w');
        this.y = uv2px(y, 'h');
        this.width = uv2px(width, 'w');
        this.height = uv2px(height, 'h');
        this.text = text;
        this.totalLife = totalLife;

        this.barHeight = 10;
        this.barY = spacingUtils.getOneThirdChildY(this.y, this.height, this.barHeight);

        this.widthLife = 0;
        this.timerStartX = spacingUtils.getCenteredChildX(this.x, this.width, totalLife);
        this.timeUp = false;

        this.box = new PIXI.Graphics();

        this.box.beginFill(0xffffff);
        this.box.lineStyle(4, 0xFFADA3, 1);
        this.box.drawRect(0, 0, this.width, this.height);
        this.box.endFill();
        this.box.x = this.x;
        this.box.y = this.y;
        this.taskTimerContainer.addChild(this.box);

        this.timerBackground = new PIXI.Graphics();
        this.timerBackground.beginFill(0xFECCC7);
        this.timerBackground.drawRect(0, 0, this.totalLife, this.barHeight);
        this.timerBackground.endFill();
        this.timerBackground.x = this.timerStartX;
        this.timerBackground.y = this.barY;
        this.taskTimerContainer.addChild(this.timerBackground);

        // timer bar
        this.timer = new PIXI.Graphics();
        this.taskTimerContainer.addChild(this.timer);

        const style = new PIXI.TextStyle({
            fontFamily: '"Lucida Console", Monaco, monospace',
            fontSize: 12,
            fontWeight: 700,
            fill: 'black',
            stroke: '#ff3300',
            wordWrap: true,
            wordWrapWidth: this.width - 10,
        });

        const taskDesc = new PIXI.Text(this.text, style);
        this.taskTimerContainer.addChild(taskDesc);
        taskDesc.position.set(this.x + 10, this.y + 10);

        this.style2 = new PIXI.TextStyle({
            fontFamily: '"Lucida Console", Monaco, monospace',
            fontSize: 24,
            fontWeight: 700,
            fill: 'black',
            stroke: '#ff3300',
            wordWrap: true,
            wordWrapWidth: this.width - 10,
        });

        this.listenerSetup();

        this.hiredNum = 0;
        this.toHireNum = toHireNum;
        this.writeCounter();
    }

    writeCounter() {
        if (this.taskTimerContainer.children.length > 0) {
            this.taskTimerContainer.removeChild(this.counter);
        }
        this.hiredCountStr = this.hiredNum.toString() + '/' + this.toHireNum.toString();
        this.counter = new PIXI.Text(this.hiredCountStr, this.style2);
        this.taskTimerContainer.addChild(this.counter);
        this.counter.position.set(spacingUtils.getCenteredChildX(this.x, this.width, 50), spacingUtils.getTwoThirdsChildY(this.y, this.height, 20));
    }

    listenerSetup() {
        eventEmitter.on('assigned-desk', (data) => {
            this.hiredNum += 1;
            this.writeCounter();
        });

        eventEmitter.on('task-complete', (data) => {
            this.hideTimer();
        });
    }

    hideTimer() {
        this.taskTimerContainer.parent.removeChild(this.taskTimerContainer);
    }
}

function updateTimerLength(taskTimer) {
    if (taskTimer.widthLife >= taskTimer.totalLife) {
        taskTimer.widthLife = 0;
        taskTimer.timeUp = true;
        taskTimer.hideTimer();
        eventEmitter.emit('time-up', {});
    } else {
        taskTimer.widthLife += 0.1;
    }
    taskTimer.timer.beginFill(0xFFADA3);
    taskTimer.timer.drawRect(0, 0, taskTimer.widthLife, taskTimer.barHeight);
    taskTimer.timer.endFill();
    taskTimer.timer.x = taskTimer.timerStartX;
    taskTimer.timer.y = taskTimer.barY;
}

function startTaskTimer(x, y, width, height, text, totalLife, toHireNum) {
    const taskTimer = new TaskTimer(x, y, width, height, text, totalLife, toHireNum);
    pixiApp.stage.addChild(taskTimer.taskTimerContainer);

    pixiApp.ticker.add(function (delta) {
        updateTimerLength(taskTimer);
    });
}

export { startTaskTimer };
