import { createPerson } from './person.js';
import { Office } from './office.js';

var globalApp = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.getElementById("gameCanvas").appendChild(globalApp.view);

var office = new Office();
var desks = office.getDesks();
for (var i = 0; i < desks.length; i++) {
  globalApp.stage.addChild(desks[i]);
}

var personList = []

var x = 10;
var y = globalApp.screen.height - 100;
for (var i = 0; i < 10; i++) {
    var person = createPerson(x, y, office);
    globalApp.stage.addChild(person)
    personList.push(person);
    x += 100
}


function removePeople(){
  for (var i = 0; i < personList.length; i++) {
    personList[i].parent.removeChild(personList[i])
  }
}
