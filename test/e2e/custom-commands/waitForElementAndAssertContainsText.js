module.exports.command = function(element, text, callback) {
  var self = this;

  this
  .waitForElementVisible(element,4000)
  .assert.containsText(element,text)
  .perform(function(){
  	// console.info('waitForElementVisible and ContainsText', element,text);
  });

  return this;
};
