const english = {
    // texts displayed in the html
    header: {
        title: 'Survival of the Best Fit',
        subtitle: 'How AI hires like humans',
    },
    about: {
        aboutBody: 'Survival of the Best Fit is a game to demonstrates how careless use of AI in hiring further perpetuates existing human bias. In this simulation, the users will play the role of recruiters at a fast-growth company. To reduce costs and maximize output, they would use a new, obscure AI system to replace human recruiters, only to realize that this creates a snowball of problems.\nThis is a project by Gabor Csapo, Jihyun Kim, Miha Klasinc, and Alia ElKattan',
    },
    // texts displayed during the game
    welcomeStage: {
        welcome: 'The winner of the 2 million dollar funding is... You!',
    },
    smallOfficeStage: {
        messageFromVc: 'Hi,\n\nCongrats again on your seed round. Very impressive.\nNow time to execute the idea. Hire the best people, fast. Hiring good talent is a war these days...\n\nKeep us updated.\n\nThanks,\n\nTim\nPartner, Linear Ventures\n\n\t\t\t(click to acknowledge)',
        taskDescription: 'Task: Hire 5 new employees',
        retryMessage: 'You are too slow at hiring. How are you going to meet 100% monthly growth targets at this pace? Try again.'
    },
    mediumOfficeStage: {
        messageFromVc: 'Hi,\n\nGood progress but you are just not growing fast enough. You need to hire more aggressively to get all the talent and outgrow your competitors.\n\nQuadraple your headcount by next week and you can raise one more million in funding...\n\nThanks,\n\nTim\nPartner, Linear Ventures\n\n\t\t\t(click to acknowledge)',
        taskDescription: 'Task: Hire 10 new employees',
        retryMessage: 'Your competitors are catching up. There\'s a board meeting next month - try again and meet your hiring targets by then. Try again.'
    },
    conversation: [
        {
            dialogue_step: 1,
            text: 'Hey, could you send me the CVs of all the current employees? The algorithm cannot do anything without the raw data...',
            answer_choice: [
                {
                    text: 'How will the algorithm work?',
                    response: 'The algorithm will analyze a lot of CV samples (the CVs of all the people working at this company!) and try to figure out how a successful employee looks like - in numbers! ',
                },
                {
                    text: 'Sure, makes sense.',
                    response: 'Great! ',
                },
            ],
        },
        {
            dialogue_step: 2,
            text: 'And here’s the cool part: most of the CVs fed to the algorithm are of the people you hired - so the program I wrote will essentially try to replicate your hiring strategy!',
            answer_choice: [
                {
                    text: 'The program will think the way I do??',
                    response: 'Thinking is a strong word, the program is not even close to thinking, it’s just really good at finding patterns in the data I give to it.',
                },
                {
                    text: 'Sounds too good to be true.',
                    response: 'That’s why machine learning is getting so much hype these days!',
                },
            ],
        },
        {
            dialogue_step: 3,
            text: 'What matters is that the hiring algorithm will hire people just like you would, but at a much faster pace! Your role now is to sit back and supervise the algorithm.',
            answer_choice: [
                {
                    text: 'OK',
                },
            ],
        },
    ],
};

const language = 'hungarian';

// exporting whatever is determined as the language.
// module.export is for pug, while the txt variable is just a global shatred variable holding all the texts and can be used in JS
// when loading in the ES6 application, there is no module provided so it is undefined
let txt;

// defining a global variable candidateInScope to access the ID globally without having to emit a value
let candidateInScope = 0;

function setLang(dictionary) {
    if (typeof module !== 'undefined') {
        module.exports = dictionary;
    } else {
        txt = dictionary;
    }
}

switch (language) {
    case 'english':
        setLang(english);
        break;
    case 'arabic':
        setLang(null);
        break;
    default:
        setLang(english);
}
