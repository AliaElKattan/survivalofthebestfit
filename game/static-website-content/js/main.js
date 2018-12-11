import { createPerson } from './person.js';
import { Office } from './office.js';
import { pixiApp, deskContainer } from './shared.js';

document.getElementById("gameCanvas").appendChild(pixiApp.view);

var office = new Office();
var personList = []

//create desks in the office
var x = 0;
var y = 50;
for (var i = 0; i < 4; i++) {
  x += 200;
  y = 50
  for (var k = 0; k < 4; k++) {
    office.addDesk(x,y);
    y += 80;
  }
}

//create People in the office
var x = 10;
var y = pixiApp.screen.height - 100;
for (var i = 0; i < 10; i++) {
    var person = createPerson(x, y, office);
    personList.push(person);
    x += 80
}

//reminder hwo to delete sprites
function removePeople(){
  for (var i = 0; i < personList.length; i++) {
    personList[i].parent.removeChild(personList[i])
  }
}
