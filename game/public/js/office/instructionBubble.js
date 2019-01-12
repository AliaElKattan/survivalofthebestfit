// import { bubbleContainer} from '../shared.js';
import { pixiApp, eventEmitter } from '../shared.js';

class Bubble {

constructor() {
  this.width = 200;
  this.height = 70;
}

drawBubble(messagex,messagey,messagetext) {
  // var messagex = 300;
  // var messagey = 100;

  this.x = messagex;
  this.y = messagey;
  let roundBox = new PIXI.Graphics();
  roundBox.lineStyle(4,0x99CCFF, 1);
  roundBox.beginFill(0xFFFFFF);
  roundBox.drawRoundedRect(this.x, this.y, this.width, this.height, 10)
  roundBox.endFill();
  roundBox.x = 48;
  roundBox.y = 190;
  pixiApp.stage.addChild(roundBox);

  let style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 12,
  fill: "black",
  stroke: '#ff3300',
  wordWrap: true,
  wordWrapWidth: this.width - 10,
  });

  let message = new PIXI.Text(messagetext, style);
  pixiApp.stage.addChild(message);
  message.position.set(this.x+60,this.y+200);
}

}

class TextBox {

constructor() {
  this.width = 200;
  this.height = 70;
}

drawBox(messagex,messagey,messagetext) {
  // var messagex = 300;
  // var messagey = 100;

  this.x = messagex;
  this.y = messagey;
  let rectangle = new PIXI.Graphics();
  rectangle.lineStyle(4,0x99CCFF, 1);
  rectangle.beginFill(0xFFFFFF);
  rectangle.drawRect(this.x, this.y, this.width, this.height, 10)
  rectangle.endFill();
  rectangle.x = 48;
rectangle.y = 190;
  pixiApp.stage.addChild(rectangle);

  let style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 12,
  fill: "black",
  stroke: '#ff3300',
  wordWrap: true,
  wordWrapWidth: this.width - 10,
  });

  let message = new PIXI.Text(messagetext, style);
  pixiApp.stage.addChild(message);
  message.position.set(this.x+60,this.y+200);
}

}

export {Bubble};
export{TextBox};

// function createBubble(){
//   //function createBubble(x, y, scale, text){
//   //var bubble = new PIXI.RoundedRectangle(x,y,width,height, radius);
//   var bubble = new PIXI.RoundedRectangle(10,10,50,50,5);
//   //var text = new Text(text);
//   //app.stage.addChild(text);
//   // bubble.x = x
//   // bubble.y = y
//   // desk.scale.set(scale);
//   // desk.interactive = true;
//   bubble.controller = new Bubble(bubble);
//
//   bubbleContainer.addChild(bubble);
// }
//
// export { createBubble };
