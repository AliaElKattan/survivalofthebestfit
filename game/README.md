# Getting started
Commands to get you started:
`npm install -g --save nodemon`

`npm install`

`nodemon`

Head over to localhost:3000 to view website

Please keep in mind that this will be a static page, so don't rely on node packages, and don't make server-side logic, etc... The reason for the node server is that Chrome doesn't allow loading content straight from the disk, there has to be a server in between.


# Components

PIXI js     - general animations, sprites and graphics. Read documentation and google "Learning Pixi js Github"

PIXI-tween  - abstraction of the fairly low level animations in pixi. Has the typical tween APIs.

Machina js  - finite state machines. It's important the manage the large number of states our game can be in. Motivation and explanation of state machines [here](https://codeincomplete.com/posts/javascript-game-foundations-state-management/)

PIXI.utils.EventEmitter - you can send events between completely independent components (i.e. when person is dragged to a desk, it can emit an event, which the office object listens to and increases counter for the number of people in office if event comes in)

ES6 style modules       - to manage the diff files just makes sure to import and export whatever you need, no need to put them in script tags. Libraries included in script tags are still in the global name space.

[Dumb object diagram](https://docs.google.com/drawings/d/1150vTQ1k2IRiph14dX6WhjQmsuUhx7Sej9fgFJ7gKIg/edit?usp=sharing)

# Responsive design
### UV Space
The first step towards a responsive pixi.js application is to cast coordinates and measurements in relative terms. A useful way to think of this is a metaphor of a UV space. UV coordinates are normalized and range between `0` and `1`. 
<br />

![UV Space](https://learn.foundry.com/nuke/8.0/content/resources/images/ug_images/uv_coordinates.png)
<br />
<br />
If we think of a full-screen canvas in terms of UV coordinates, then:
- `UV(0,0)` is the origin of the canvas, i.e. top left corner
- `UV(0.5,0.5)` is the center of the screen
- `UV(1,1)` is the bottom right of the screen

Similarly, UV coordinates can be used for measurements:
- `UV(1)` means an element spans the full width of the canvas
- `UV(0.5)` means the element's width is 1/2 of the canvas width etc.

### Converting UV coordinates to screen pixels
In the javascript utilities file (`js/common/utils.js`), there is a function `uv2px`, which accepts uv coordinates ([0-1]), and outputs the corresponding values in screen pixels based on Pixi app dimensions. <br />
Function inputs:
- object (`{x: 0.2, y: 0.1}`)
- value and axis `'w' for width, 'h' for height: e.g. (0.5, 'w')`)
```js
import { uv2px } from '../common/utils.js';

// rectangle is full width of the screen
this.drawRect(0, 0, uv2px(1,'w'), 40);

// start drawing at the center of the screen
var coor = u2px({x: 0.5, y: 0.5});
this.drawRect(coor.x, coor.y, 50, 50); // one way
this.drawRect(uv2px(0.5,'w'), uv2px(0.5,'h'), 50, 50); // another way
```
