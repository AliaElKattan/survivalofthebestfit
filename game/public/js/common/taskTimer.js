import { pixiApp, timerContainer, eventEmitter } from '../shared.js';
import { spacingUtils } from './utils.js'
class TaskTimer {
  constructor(x, y, width, height, text, totalLife) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.totalLife = totalLife;

    this.barHeight = 10;
    this.barY = spacingUtils.getOneThirdChildY(y, height, this.barHeight);
    
    this.widthLife = 0; 
    this.timerStartX = spacingUtils.getCenteredChildX(x, width, totalLife);
    this.timeUp = false;

    this.box = new PIXI.Graphics();

    this.box.beginFill(0xffffff);
    this.box.lineStyle(4, 0xFFADA3, 1);
    this.box.drawRect(0, 0, this.width, this.height);
    this.box.endFill();
    this.box.x = this.x;
    this.box.y = this.y;
    timerContainer.addChild(this.box);

    this.timerBackground = new PIXI.Graphics();
    this.timerBackground.beginFill(0xFECCC7);
    this.timerBackground.drawRect(0, 0, this.totalLife, this.barHeight);
    this.timerBackground.endFill();
    this.timerBackground.x = this.timerStartX;
    this.timerBackground.y = this.barY;
    timerContainer.addChild(this.timerBackground);

    //timer bar
    this.timer = new PIXI.Graphics();
    timerContainer.addChild(this.timer);

    var style = new PIXI.TextStyle({
      fontFamily: "\"Lucida Console\", Monaco, monospace",
      fontSize: 12,
      fontWeight: 700,
      fill: "black",
      stroke: '#ff3300',
      wordWrap: true,
      wordWrapWidth: this.width - 10,
    });

    let taskDesc = new PIXI.Text(this.text, style);
    timerContainer.addChild(taskDesc);
    taskDesc.position.set(this.x+10,this.y+10);

    var style2 = new PIXI.TextStyle({
      fontFamily: "\"Lucida Console\", Monaco, monospace",
      fontSize: 24,
      fontWeight: 700,
      fill: "black",
      stroke: '#ff3300',
      wordWrap: true,
      wordWrapWidth: this.width - 10,
    });

    this.hiredNum = 0;
    this.toHireNum = 10;
    this.hiredCountStr = this.hiredNum.toString() + "/" + this.toHireNum.toString();
    let counter = new PIXI.Text(this.hiredCountStr, style2);
    timerContainer.addChild(counter);
    counter.position.set(spacingUtils.getCenteredChildX(x, width, 50), spacingUtils.getTwoThirdsChildY(y, height, 20))
  }
}

function updateCounterString(taskTimer) {
  if (taskTimer.hiredNum < taskTimer.toHireNum) {
    taskTimer.hiredNum += 1;
  }
  taskTimer.hiredCountStr = taskTimer.hiredNum.toString() + "/" + taskTimer.toHireNum.toString();
}

function updateTimerLength(taskTimer) {
  if (taskTimer.widthLife >= taskTimer.totalLife) {
    taskTimer.widthLife = 0;
    taskTimer.timeUp = true;
    pixiApp.ticker.destroy();
  }
  else {
    taskTimer.widthLife += 0.5;
  }

  console.log(taskTimer.widthLife);

  taskTimer.timer.beginFill(0xFFADA3);
  taskTimer.timer.drawRect(0, 0, taskTimer.widthLife, taskTimer.barHeight);
  taskTimer.timer.endFill();
  taskTimer.timer.x = taskTimer.timerStartX;
  taskTimer.timer.y = taskTimer.barY;
}

function startTaskTimer(x, y, width, height, text, totalLife) {
  let taskTimer = new TaskTimer(x, y, width, height, text, totalLife);

  pixiApp.ticker.add(function(delta) {
    updateTimerLength(taskTimer);
  })

  //change to handle event when someone is hired
  if (false) {
    taskTimer.updateCounterString();
  }
  
}

export { startTaskTimer };
