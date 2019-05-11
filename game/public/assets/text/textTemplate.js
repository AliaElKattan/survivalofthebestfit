const english = {
    // texts displayed in the html
    header: {
        title: 'Survival of the Best Fit',
        subtitle: 'How AI hires like humans',
    },

    about: {
        aboutBody: 'Survival of the Best Fit is a game to demonstrates how careless use of AI in hiring further perpetuates existing human bias. In this simulation, the users will play the role of recruiters at a fast-growth company. To reduce costs and maximize output, they would use a new, obscure AI system to replace human recruiters, only to realize that this creates a snowball of problems.\nThis is a project by Gabor Csapo, Jihyun Kim, Miha Klasinc, and Alia ElKattan',
    },

    resources: {
      title: 'Machines, Bias, and Fairness',
      aboutBias: '<b> How does \'machine bias\' work? </b> <p> Bias has long been a problem in recruiting. Research has shown that ref1, ref2, and ref3. One might think that computers can help us eliminate this human bias, but automation is not always the answer. There are several ways bias can be propagate through computer code. Since ‘machine learning’ algorithms work by learning from previous trends, bias could exist if the learning data we give our program is already biased. For example, if you teach a computer to learn from the past century of successful CVs, it can pick on trends that reflect historical and societal biases.</p> <p> As a matter of fact, sometimes the data isn’t biased because it represents a historical reality, it’s also inaccurate. According to research on gender bias in natural language processing (i.e. computers understanding text), ref. </p>',
      fixingBias: '<b> How do we we fix it? </b> <p> One of the main problems with using software to make important decisions is that you often can’t track down why a decision was made. In machine learning, this is what we call the “black box problem”. A software would learn from data and try to replicate it, but it does not let you know specifically what that decision-making process looks like. In cases where software solutions could provide corporations and governments from accountability, it may be a better option to refrain from using them at all. </p> <p> The solution to bias is not straightforward. It might be easy to think that to fix bias in the dataset, all we need to do is to gather a representational dataset. Since machine learning works on mass data, however, this may still not help minorities. Navigating bias and representation is a complex topic, and so is fairness. If we want to build equitable software systems that do not discriminate against or disadvantage any members of our society, we must open up this conversation to people who are not software engineers, or in the tech industry. </p>',
      futureSteps: '<b>Taking steps forward </b> <ol> <li> <b> Education and Awareness </b> </li> We believe that the first step to achieving real progress is to engage in research and conversation beyond both within and outside the technical field, such as policy-makers, lawyers, social scientists, and advocacy groups. We need to gain a better understanding of how to navigate fairness, bias, and equity in the digital world. For that to be possible, we must work on bridging the technical gap. We want issues in tech ethics to be accessible to those who may have not taken a computer science class before, but still have a lot to add to the conversation. <p> <li> <b> Ethical Frameworks </b> </li> While we think people outside of tech should be involved, we want tech companies and software developers to make an effort too. This means making discussions about ethics be a conscious part of the software development process. </p> <p> Institute for the Future and Omidyar Network worked on Ethical OS, “a guide to anticipating the future impact of today’s technology”. </p> <p> AI Now Institute, based at NYU, have also worked on an Algorithmic Impact Assessment guide aimed at public agencies, with the aim of providing a practical framework to assess automated decision systems.</p> <li><b> Supporting Organizations </b></li> xxxxx Fight bias with AJL',
    },

    // texts displayed during the game
    titleStage: {
        header: 'Survival of the Best Fit',
        instruction: 'Congratulations! You just secured 2 million dollar funding to turn your startup idea into reality. Are you ready to grow your new company, Bestfit Technologies?',
        responses: [
            'Start Game',
        ],
    },
    tutorialStage: {
        header: 'Tutorial',
        instruction: 'As the CEO, your goal is to hire the best and the brightest talent that will help your startup grow. You can hover over each candidate to view their CV and drag to the desk to hire. Try to meet your hiring goals for each stage and make your investors happy!',
        responses: [
            'Got it',
        ],
    },
    instructions: {
        manual: {
            click: 'Click the candidates to see their CVs',
            eval: 'Hire or reject candidates based on their profiles',
        },
        ml: {

        },
    },
    smallOfficeStage: {
        messageFromVc: 'Congrats again on your latest investment. Now’s time to execute the idea. Hire the best people, fast. Hiring good talent is a war these days... keep us updated.',
        responses: ['Let\'s do this'],
        hiringGoal: 3,
        taskDescription: 'Task: Hire 3 new employees',
        retryMessage: 'You are not hiring. How are you going to meet 100% monthly growth targets at this pace? Try again.',
        retryResponses: ['I will do better this time.'],

    },
    mediumOfficeStage: {
        messageFromVc: 'Hi, \ngood progress, but you are just not growing quickly enough. You need to hire more aggressively to get top talent and outgrow your competitors. Try to quadruple your headcount by next week if you want better funding... ',
        responses: [
            'I\'ll do my best',
            'Are you sure?',
        ],
        hiringGoal: 10,
        taskDescription: 'Task: Hire 10 new employees',
        retryMessage: 'Your competitors are catching up. There\'s a board meeting next month - try again and meet your hiring targets by then. Try again.',
        retryResponses: ['I will do better this time.'],
    },

    // add transition here. e-mail from INVESTOR says:  We’ve made good progress, but the faster we grow, the more profit we’ll make. I suggest you use an automated program to help with hiring. Check with the software development team?

    // email from SOFTWARE ENGINEER
    conversation: [
        {
            dialogue_step: 1,
            text: 'We’re working on a new hiring program, and the software team wants to use machine learning. It’s a great solution, because it allows us to teach the automated software to hire just as our HR team would, but at a much faster pace!',
            answer_choice: [
                {
                    text: 'How does that work?',
                    response: '',
                },
                {
                    text: 'Sure, that\'s fine.',
                    response: 'Great! ',
                    //  response: 'The algorithm will analyze a lot of CV samples (the CVs of all the people working at this company!) and try to figure out how a successful employee looks like - in numbers! ',

                },
            ],
        },
        {
            dialogue_step: 2,
            text: 'The algorithm will analyze a lot of CV samples, like those of people already working here and in other big tech companies, and use that to figure out what a successful employee looks like - in numbers. Basically, it can replicate your hiring strategy!',
            answer_choice: [
                {
                    text: 'What do you need to get started?',
                    response: 'Thinking is a strong word; it’s just really good at finding patterns in the data I give to it, and copying that.\n',
                },
                {
                    text: 'Sounds great, we should use that!',
                    response: 'That’s why machine learning is getting so much hype these days!\n',
                },
            ],
        },
        {
            dialogue_step: 3,
            text: 'First, we need something to build off of. Can you send me the CVs of all current employees?\n',
            answer_choice: [
                {
                    text: 'OK, will do',
                },
            ],
        },
    ],

    // conversation: [ { dialogue_step: 1, text: 'We’re working on a new hiring
    // program, and the software team wants to use machine learning. It’s a
    // great solution, because it allows us to teach the automated software to
    // hire just as our HR team would, but at a much faster pace...',
    // answer_choice: [ { text: 'How does that work?', response: 'The algorithm
    // will analyze a lot of CV samples (the CVs of all the people working at
    // this company!) and try to figure out how a successful employee looks like
    // - in numbers! ', }, { text: 'Sure, that\'s fine.', //  response: 'Great!
    // ', response: 'The algorithm will analyze a lot of CV samples (the CVs of
    // all the people working at this company!) and try to figure out how a
    // successful employee looks like - in numbers! ', // }, ], }, {
    // dialogue_step: 2, text: 'And here’s the cool part: most of the CVs fed to
    // the algorithm are of the people you hired - so the program I wrote will
    // essentially try to replicate your hiring strategy!', answer_choice: [ {
    // text: 'The program will think the way I do??', response: 'Thinking is a
    // strong word, the program is not even close to thinking, it’s just really
    // good at finding patterns in the data I give to it.', }, { text: 'Sounds
    // too good to be true.', response: 'That’s why machine learning is getting
    // so much hype these days!', }, ], }, { dialogue_step: 3, text: 'What
    // matters is that the hiring algorithm will hire people just like you
    // would, but at a much faster pace! Your role now is to sit back and
    // supervise the algorithm.', answer_choice: [ { text: 'OK', }, ], }, ],
    mlLabStage: {
        conversation: [
            {
                // delay: 12,
                delay: 3,
                messageFromVc: 'We’ve been able to both hire at 10x our past rate and cut down costs! Great job, this seems to be working!',
                responses: [
                    'Great to hear!',
                ],
                news: [
                    'Yellowville Review: Does the future of hiring lie in algorithms?',
                    'Tech Junkies: Hiring algorithms are the next big thing',
                ],
            },
            {
                delay: 7,
                messageFromVc: 'Hello, I just got a complaint from a past applicant who’s looking for feedback on why she was rejected. Can you look into it and let me know?',
                responses: [
                    'I\'m on it!',
                    'Ok, but where should I look?',
                ],
                tooltip: {
                    parent: 'machine',
                    text: 'Decisions have been made in a “black box”. Machine is unable to track back specific reasons.',
                },
            },
            {
                delay: 8,
                messageFromVc: 'Hello, just checking in on the hiring process so far. Can you look into the decisions it’s made?',
                responses: [
                    'Sure, I can do that!',
                ],
            },
            {
                delay: 7,
                messageFromVc: 'Hey, some reporters have been talking about bias in recruitment, but I guess we’re off the hook since we’ve switched to automated hiring anyway! Is that right?',
                responses: [
                    'Yes, we dodged that bullet.',
                    'Not sure, I’ll look into it.',
                ],
                tooltip: {
                    parent: 'scanray',
                    text: 'The algorithm doesn’t work in a vacuum. Incoming CVs are judged in context of previous CVs, replicating historical trends',
                },
                news: [
                    'Techountability: Research shows hiring algorithms may be biased towards minorities',
                    'Tech Junkies: How do hiring algorithms work?',
                ],
            },
            {
                delay: 10,
                messageFromVc: 'I’m hearing that we may be involved with this bias story, and reporters are asking us to make our process more transparent. Could you double check our evaluation metrics to see if we can go public?',
                responses: [
                    'I\'ll give it a shot!',
                ],
                tooltip: {
                    parent: 'scanray',
                    text: 'Bias could originate with the metrics we use to evaluate applicants. They often fit within gendered stereotypes and historical biases.',
                },
                news: [
                    'Blueville Gazette: Blueville residents treated unfairly by an algorithm?',
                    'The justice: Yellow privilege in the tech industry',
                ],
            },
            {
                delay: 8,
                messageFromVc: 'Hey, we are all over the news for biased hiring, all the investors are pulling out! We have to turn this story around, so I\'m sending you to AI debiasing seminar in Blueville. Think of it as paid vacation.',
                responses: [
                    'Start learning about bias',
                ],
                news: [
                    'Blueville Daily: Hiring algorithm scandal blows out of proportions',
                    'The Justice: Tech companies need to be held accountable',

                ],
            },
        ],
    },
};

const language = 'hungarian';

// exporting whatever is determined as the language.
// module.export is for pug, while the txt variable is just a global shatred variable holding all the texts and can be used in JS
// when loading in the ES6 application, there is no module provided so it is undefined
let txt;

// defining a global variable candidateClicked to access the ID globally without having to emit a value
let candidateClicked = 0;
let candidateHovered = null;

let candidateInSpot = null;
const hiringGoals = {'smallStage': 3, 'mediumStage': 10};

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
