module.exports.command = function(source, dest, callback) {
  var self = this;

  this
  .waitForElementVisible(source,4000)
  .click(source);

  return this;
};
