const textFile = require('../public/assets/textTemplate.js');

exports.index = (req, res) => {
  res.render('home', textFile.header);
};
