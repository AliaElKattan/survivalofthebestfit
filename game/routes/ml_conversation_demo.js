const ml_conversation = require('../public/assets/mlConversation.js');

exports.index = (req, res) => {
  res.render('ml-conversation-demo', ml_conversation);
};
