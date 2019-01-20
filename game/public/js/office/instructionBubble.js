// import { bubbleContainer} from '../shared.js';
import { pixiApp, eventEmitter } from '../shared.js';
import {xIcon} from '../textures.js';

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
  // this.height = 70;
  this.alive = true;


}

drawBox(messagex,messagey,messagetext) {
  // var messagex = 300;
  // var messagey = 100;

  this.x = messagex;
  this.y = messagey;

  let style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 12,
  fill: "black",
  stroke: '#ff3300',
  wordWrap: true,
  wordWrapWidth: this.width - 10,
  });

  let message = new PIXI.Text(messagetext, style);

  this.height2= messagetext.height;

  let rectangle = new PIXI.Graphics();
  rectangle.lineStyle(4,0x99CCFF, 1);
  rectangle.beginFill(0xFFFFFF);
  rectangle.drawRect(this.x, this.y, this.width, message.height + 15, 10)
  rectangle.endFill();
  rectangle.x = 48;
rectangle.y = 190;
  pixiApp.stage.addChild(rectangle);

  rectangle.buttonMode = true;
  rectangle.interactive = true;
  rectangle.on('pointertap', onPress);

  rectangle.addChild(message);
  message.position.set(this.x+5,this.y+5);


  var icon = new PIXI.Sprite(xIcon);
  icon.interactive = true;
  icon.buttonMode = true;

  rectangle.addChild(icon);
  icon.scale.set(.04);
  icon.x = this.x + message.width + 15;
  icon.y = this.y;
  // icon.x= message.x+ message.width;
  // icon.y= message.y - 8;


// icon.on('pointertap',this.alive = false);
}


}

function onPress(event) {
  this.data = event.data;
  this.visible = false;
  console.log("text pressed");
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
