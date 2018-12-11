var pixiApp = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
var deskContainer = new PIXI.Container();
var personContainer = new PIXI.Container();

pixiApp.stage.addChild(deskContainer);
pixiApp.stage.addChild(personContainer);

export { pixiApp,  personContainer, deskContainer};
