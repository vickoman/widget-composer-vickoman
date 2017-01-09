
module.exports.command = function(selector, text, callback) {
	var self = this;
	console.log('here', selector, text)
	this
	.waitForElementAndClick(selector)
	.keys(text)

	return this;
};
