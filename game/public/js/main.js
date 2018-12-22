import { createPerson } from './person.js';
import { Office } from './office.js';
import { pixiApp, deskContainer, officeContainer, startTweenManager } from './shared.js';

document.getElementById("gameCanvas").appendChild(pixiApp.view);

var office = new Office(4, 4, 300, 300, 50, 50, 0.10);
var personList = []


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

startTweenManager();
