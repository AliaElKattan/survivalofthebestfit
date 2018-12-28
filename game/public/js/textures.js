//module to load textures
var personTexture = PIXI.Texture.fromImage('assets/img/character.png');
personTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var deskTexture = PIXI.Texture.fromImage('assets/img/desk.png');
personTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

var incubator = PIXI.Texture.fromImage('assets/img/incubator-winners.jpeg');

export { personTexture, deskTexture, incubator }
