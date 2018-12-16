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
