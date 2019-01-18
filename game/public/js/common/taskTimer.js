import { pixiApp, timerContainer, eventEmitter } from '../shared.js';

class TaskTimer {
  constructor() {
    this.width = 160;
    this.height = 100;
    this.x = 600;
    this.y = 50;

    this.box = new PIXI.Graphics();

    this.timerStartX = 610;

    this.timeUp = false;

    this.box.beginFill(0x888888);
    this.box.drawRoundedRect(0, 0, this.width, this.height, 12);
    this.box.endFill();
    this.box.x = this.x;
    this.box.y = this.y;
    pixiApp.stage.addChild(this.box);

    //timer bar
    this.timer = new PIXI.Graphics();
    this.totalLife = 130;
    this.widthLife = 0; 

    pixiApp.stage.addChild(this.timer);

    let style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 18,
      fill: "white",
      stroke: '#ff3300',
      wordWrap: true,
      wordWrapWidth: this.width - 10,
    });

    let message = new PIXI.Text("Timer", style);
    pixiApp.stage.addChild(message);
    message.position.set(this.x+55,this.y+10);
  }
}

function updateTimerLength(taskTimer) {
  if (taskTimer.widthLife >= taskTimer.totalLife) {
    taskTimer.widthLife = 0;
    taskTimer.timeUp = true;
  }
  else {
    taskTimer.widthLife += 0.5;
  }

  console.log(taskTimer.widthLife);

  taskTimer.timer.beginFill(0xFECCC7);
  taskTimer.timer.drawRect(0, 0, taskTimer.widthLife, 20, 12);
  taskTimer.timer.endFill();
  taskTimer.timer.x = taskTimer.timerStartX;
  taskTimer.timer.y = 90;
}

function startTaskTimer() {
  let taskTimer = new TaskTimer();

  pixiApp.ticker.add(function(delta) {
    updateTimerLength(taskTimer);
  })
}

export { startTaskTimer };
