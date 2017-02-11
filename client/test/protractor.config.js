/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Protractor configuration
 *
 * References:
 *   https://github.com/angular/protractor/blob/master/lib/config.ts
 *   https://github.com/bcaudan/jasmine-spec-reporter/tree/master/examples/protractor
 */

'use strict';

// A nice reporter using the 'color' library (only 1 dependency).
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  framework       : 'jasmine',
  seleniumAddress : 'http://localhost:4444/wd/hub',
  capabilities    : {
    browserName : 'chrome'
  },
  jasmineNodeOpts: {
    showColors : true,
    print      : function () {}
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace : true
      }
    }));
  }
};
