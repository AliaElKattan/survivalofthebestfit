const textFile = require('../public/assets/text/textTemplate.js');
const ml_conversation = require('../public/assets/text/demo-conversation-text.js');

// home page
const HOME = (req, res) => {
    res.render('pages/home', textFile.header);
};

// about page
const ABOUT = (req, res) => {
    res.render('pages/about', textFile.about);
};

// game view page

const GAME = (req, res) => {
    res.render('pages/game', ml_conversation);
};

module.exports = {
    HOME,
    ABOUT,
    GAME,
};
