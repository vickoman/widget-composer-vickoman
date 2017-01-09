/**
 * Simple example of custom command. This command will
 * check if there's a onbeforeunload handler in the target web page
 * and return the result
 */
/* global window */

module.exports.command = function(source, dest, callback) {
  var self = this;

  this.moveToElement(source,  10,  10)
  // .pause(800)
  // .moveTo(1,  1)
  .mouseButtonDown(0)
  .pause(500)
  // .moveTo('div.widget-container.ui-sortable',10,  1)
  .moveToElement(dest,  10,  10)
  // .pause(800)
  .mouseButtonUp(0)

  return this;
};

// .moveToElement('[data-widget-name="Advanced Flashcards"]',  10,  10)
      // .mouseButtonDown(0)
      // .moveToElement('div.widget-container.ui-sortable',  10,  10) // Move to offset position of 200(x) 600(y)
      // .mouseButtonUp(0)
      // .pause(5000)
      // .waitForElementVisible('.widget-container.ui-sortable', 15000)
      // .injectScript('http://rawgit.com/rcorreia/2362544/raw/3319e506e204af262d27f7ff9fca311e693dc342/drag_and_drop_helper.js', function(sc) {
      //   // we're all done here.
      //   // console.log(sc)
      // })
      // .execute(function(){
      //   $('[data-widget-name="Advanced Flashcards"]').simulateDragDrop({ dropTarget: '.widget-container.ui-sortable'});
      // })
