const ml_conversation = require('../public/assets/demo-conversation-text.js');

exports.index = (req, res) => {
  res.render('demo-conversation', ml_conversation);
};
