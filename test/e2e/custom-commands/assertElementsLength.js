module.exports.command = function(element, findStrategy, length, callback) {
	var self = this;
  	this
	.waitForElementVisible(element, 4000)
	.elements(findStrategy, element, 
	function (result) {
		self
		.perform(function(){
			console.log('length',result.value.length);
		})
		.assert.ok(result.value.length === length);
  	});

  return this;
};
