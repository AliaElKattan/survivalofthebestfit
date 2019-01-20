var english = {
	// texts displayed in the html
	header: {
		title: "Survival of the Best Fit",
		subtitle: "How AI hires like humans"
	},
	about: {
		aboutBody: "Survival of the Best Fit is a game to demonstrates how careless use of AI in hiring further perpetuates existing human bias. In this simulation, the users will play the role of recruiters at a fast-growth company. To reduce costs and maximize output, they would use a new, obscure AI system to replace human recruiters, only to realize that this creates a snowball of problems.\nThis is a project by Gabor Csapo, Jihyun Kim, Miha Klasinc, and Alia ElKattan"
	},

	// texts displayed during the game
	stageZero: {
		welcome: "The winner of the 2 million dollar funding is... You!",
	},
	stageOne: {
		taskDescription: "Task: Hire 5 new employees",
	}
}



var language = "hungarian";

// exporting whatever is determined as the language.
// module.export is for pug, while the txt variable is just a global shatred variable holding all the texts and can be used in JS
// when loading in the ES6 application, there is no module provided so it is undefined
var txt;

function setLang(dictionary){
	if (typeof module !== 'undefined'){
		module.exports = dictionary;
	} else {
		txt = dictionary;
	}
}

switch(language) {
  case "english":
		setLang(english);
    break;
  case "arabic":
		setLang(null);
    break;
  default:
		setLang(english);
}
