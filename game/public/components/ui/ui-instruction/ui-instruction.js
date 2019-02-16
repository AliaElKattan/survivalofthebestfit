import $ from 'jquery';
import CLASSES from '../../../js/constants/classes';
import EVENTS from '../../../js/constants/events';

import UIBase from '../../../js/common/ui-base';
import { eventEmitter } from '../../../js/shared.js';


export default class extends UIBase {
  
  constructor (options) {
    super();
    this.$el = $('.js-instruction'); // This should be a single element
    this.$textEl = this.$el.find('.Instruction__content');
    this.$button = this.$el.find('.button');
    this._addEventListeners();
    this.setContent = this.setContent.bind(this);
    this._content = options ? options.content : 'dummy text'; // TODO: change this to null
    this.overlay = options ? options.overlay : null; // TODO think about the overlay
    this.setContent(); // set content

  }
  
  setContent() {
    console.log('set content!');
    this.$textEl.html('new text lala');
  }
  
  _testLog() {
    console.log("test emitter works!");
  }
  
  _buttonIsClicked(e) {
    this.$button.addClass(CLASSES.BUTTON_CLICKED);
    eventEmitter.emit('instructionAcked', {});
    this.hide();
  }
  
  _addEventListeners() {
    eventEmitter.on(EVENTS.EMITTER_TEST, this._testLog());
    this.$button.click(this._buttonIsClicked.bind(this));
  }
  
  _removeEventListeners() {
    eventEmitter.off(EVENTS.EMITTER_TEST, this._testLog());
    this.$button.off(this._buttonIsClicked.bind(this));
  }
  
  show () {
    this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
  }
  
  hide () {
    this.$el.removeClass(CLASSES.FADE_IN)
            .addClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.IS_INACTIVE);
            
            // TODO you might need a delayed call for this
  }

  destroy () {
    super.dispose();
    this.hide();
    this._removeEventListeners();
    // this.$el.destroy();
  }
}

// let instructionContainer;
// class TextBoxUI {
//   constructor() {
//     console.log('added test UI!');
//     // this._addEventListener();
//     // instructionContainer = new PIXI.Container();
//     // this.width = width;
//     // this.height = height;
//     // this.text = messageText;
//     // this.alive = true;
//     // if (overlay) this.drawFullScreenOverlay();
//     // this.drawBox();
//     // pixiApp.stage.addChild(instructionContainer);
//   }
// 
//   _addEventListener() {
//     eventEmitter.on('emitter-test', () => console.log('test emitter works!'));
//   }
// 
// //   drawBox() {
// // 
// //     this.x = space.screenCenterX(this.width);
// //     this.y = space.screenCenterY(this.height);
// // 
// //     let style = new PIXI.TextStyle({
// //       fontFamily: "Lucida Console",
// //       fontSize: 14,
// //       fill: "black",
// //       stroke: '#ff3300',
// //       wordWrap: true,
// //       wordWrapWidth: this.width - 10,
// //       lineHeight: 20
// //     });
// // 
// //     let message = new PIXI.Text(this.text, style);
// // 
// //     this.height2 = message.height;
// // 
// //     let rectangle = new PIXI.Graphics();
// //     rectangle.lineStyle(4, 0x99CCFF, 1);
// //     rectangle.beginFill(0xFFFFFF);
// //     rectangle.drawRect(this.x, this.y, this.width, this.height, 10)
// //     rectangle.endFill();
// //     instructionContainer.addChild(rectangle)
// // 
// //     rectangle.buttonMode = true;
// //     rectangle.interactive = true;
// //     rectangle.on('pointertap', onPress);
// // 
// //     rectangle.addChild(message);
// //     message.position.set(this.x + 5, this.y + 5);
// // 
// //     var icon = new PIXI.Sprite(xIcon);
// //     icon.interactive = true;
// //     icon.buttonMode = true;
// // 
// //     rectangle.addChild(icon);
// //     icon.scale.set(.04);
// //     icon.x = this.x + message.width + 15;
// //     icon.y = this.y;
// //   }
// // 
// //   drawFullScreenOverlay() {
// //     let bg = new PIXI.Container();
// //     bg.alpha = 0.5
// // 
// //     let overlay = new PIXI.Graphics();
// //     overlay.beginFill(0xFFFFFF);
// //     overlay.drawRect(0, 0, uv2px(1, 'w'), uv2px(1, 'h'))
// //     overlay.endFill();
// // 
// //     bg.addChild(overlay);
// //     instructionContainer.addChild(bg);
// //   }
// // }
// // 
// // function onPress(event) {
// //   eventEmitter.emit('instructionAcked', {});
// //   this.data = event.data;
// //   this.visible = false;
// //   hideInstruction();
// // }
// // 
// // function hideInstruction() {
// //   instructionContainer.removeChildren();
// //   instructionContainer.parent.removeChild(instructionContainer);
// //   instructionContainer.destroy()
// }
// 
// export { TextBoxUI };
