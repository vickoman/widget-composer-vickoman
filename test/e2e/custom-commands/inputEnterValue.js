
module.exports.command = function(source, dest, callback) {
	var self = this;
	console.log('here', source.input, source.value)
	this
	.useXpath()
	.waitForElementAndClick(selectElementParentBySiblingText(source.input))
	.useCss()
	.perform(function(){
		numbers = source.value.split('');
		numbers.forEach(function(number){
			this
			.pause(200)
			.click('.keypad [data-value="'+number+'"]');
		})
	})
	.click('.keypad button[data-ng-click*="numKeySent"]');

	return this;
};
