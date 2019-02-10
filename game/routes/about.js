const textFile = require('../public/assets/textTemplate.js');

exports.index = (req, res) => {
  res.render('about', textFile.about);
};
