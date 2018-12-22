const textFile = require('../public/assets/textFile.js');

exports.index = (req, res) => {
  res.render('home', textFile.header);
};