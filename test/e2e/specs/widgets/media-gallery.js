    // For authoring Nightwatch tests, see
    // http://nightwatchjs.org/guide#usage
var timeout = 1000

module.exports = {    
    'create new gallery': function (browser) {
        // automatically uses dev Server port from /config.index.js
        // default: http://localhost:8080
        // see nightwatch.conf.js
        const devServer = browser.globals.devServerURL

        browser
          .url(devServer)
          // make login
          .waitForElementVisible('div.view', 2000)
          .assert.elementPresent('div.view input[type=text]')
          .setValue('div.view input[type=text]',"Admin")
          .assert.elementPresent('div.view input[type=password]')
          .setValue('div.view input[type=password]',"opensesame")
          .waitForElementAndClick('div.view button')
          .waitForElementVisible('.content-manager', 5000)

          .execute(function(selector){
            // alert('hola')
            return window.testing = true
          }, ['title'], function(result){
            console.log('result', result)
          })
          .waitForElementAndClick('.toolbar-buttons .btn.btn--rounded.btn--green')
          // .waitForElementAndClick("//a[contains(text(),'Gallery')]")
          .waitForElementAndClick('.dropdown__content')
          .waitForElementAndClick('a[data-name="Media Gallery"]')

          .assert.elementPresent('div.input-text .txt-input')
          .pause(800)
          .setValue('input.txt-input',"testing-widget")
          .waitForElementAndClick('.name-widget-container button.button-standard-green')
          // .waitForElementAndClick('#show-modal')
          .waitForElementAndAssertContainsValue('.input-text input[type=text]', 'testing-widget')

    },
    'test text ': function (browser) {
        // automatically uses dev Server port from /config.index.js
        // default: http://localhost:8080
        // see nightwatch.conf.js
            const devServer = browser.globals.devServerURL

            browser
            // .url(devServer)
            .sendKeysToContentEditable('.title','testing Title')
            //   .waitForElementAndAssertContainsText('.title', 'testing Title')
            .moveToElement('.title',  1,10)
            .doubleClick()
            .waitForElementAndClick('[data-cmd="strikeThrough"]')
            .waitForElementAndClick('[data-cmd="underline"]')
            .setValue('.input-text input[type=text]',"testing-widget!!!")
            // .pause(0)
            .end()
        }
    }

    // .moveToElement('.txt-input',  50,  20)
    // .keys(browser.Keys.SPACE)
    // .sendKeys(".txt-input",browser.Keys.SPACE)
    // .sendKeys(".txt-input",browser.Keys.NUMPAD0)
    // .sendKeys(".txt-input",browser.Keys.NUMPAD7)

    // // .sendKeys('div.input-text .txt-input', 'bob')

    // .pause(0)
    // .doubleClick()

    // // .pause(800)
    // // .moveTo(1,  1)
    // // .mouseButtonDown(0)
    // // .pause(500)
    // // // .moveTo('div.widget-container.ui-sortable',10,  1)
    // .moveToElement('div.input-text',  150,  20)
    // .doubleClick()
    // .pause(800)
    // .waitForElementAndClick("[data-cmd='italic']")
    // .waitForElementAndClick("[data-cmd='bold']")
    // .waitForElementAndClick("[data-cmd='underline']")
    // // .pause(800)
    // .mouseButtonUp(0)

    // '//*[@id="widgetEditor"]/div/div/div/a'
    // .useCss()
    // .assert.elementPresent('.hello')
    // .assert.containsText('h1', 'Welcome to Your Vue.js App')
    // .assert.elementCount('img', 1)
