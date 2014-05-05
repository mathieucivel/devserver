require('colors');

module.exports = function(prefix) {
    prefix = prefix ? prefix + ' - ' : '';
  return function(message, color) {
    color = color || 'white'
    console.log('[devserver] '.grey + prefix + message[color]);
  }

};
