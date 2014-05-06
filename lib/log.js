require('colors');

module.exports = function(message, color) {
  color = color || 'white'
  console.log('[devserver] '.grey + message[color]);
};
