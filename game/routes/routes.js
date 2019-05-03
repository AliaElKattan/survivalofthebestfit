const textFile = require('../public/assets/text/textTemplate.js');
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
    res.render('pages/game', textFile);
};

// resources page

const RESOURCES = (req, res) => {
    res.render('pages/resources', textFile.resources);
};

module.exports = {
    HOME,
    ABOUT,
    GAME,
    RESOURCES,
};
