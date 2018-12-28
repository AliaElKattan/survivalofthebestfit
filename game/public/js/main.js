import { pixiApp, startTweenManager } from './shared.js';
import { gameFSM } from './gameStates.js';

document.getElementById("gameCanvas").appendChild(pixiApp.view);

gameFSM.startGame();

startTweenManager();


// //reminder hwo to delete sprites
// function removePeople(){
//   for (var i = 0; i < personList.length; i++) {
//     personList[i].parent.removeChild(personList[i])
//   }
// }
