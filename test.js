'use strict';
let log = require('./index');
var testGlobal = require('./test-global');

var obj = {
  test : "test",
  test1 : {
    something : "something"
  },
  test3 : {
    something2 : {
      something2 : "something2"
    }
  }
}

var func = function(){
  var one = 1;
}
log.r(obj);
log.inf(obj);
log.r("This is a red string");