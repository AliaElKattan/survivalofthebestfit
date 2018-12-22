const textFile = require('../public/assets/textFile.js');

exports.index = (req, res) => {
  res.render('about', textFile.about);
};