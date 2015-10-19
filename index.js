'use strict';

let clc         = require("cli-color");
let fs          = require("fs");
let path        = require("path");
let validURL    = require("valid-url");
let http        = require("http");
let querystring = require('querystring');
let helpers     = require('./helpers');
let moment      = require('moment');
var _           = require('lodash');
var util        = require('util');
var pJson       = require('prettyjson');

const MAX_COLOR = 240;
const MIN_COLOR = 10;
const DEFAULT_JSON_SPACE = 2;
const time      = moment();
const COLORS = [ 'red', 'blue', 'green', 'orange', 'white', 'yellow',  'pink'];

function doLog (color, printTarget, hightlight){
  let finalPrintObject = null;
  if(_.indexOf(COLORS, color) === -1) throw new Error ("invalid log color");
  if(util.isString(printTarget)){
    finalPrintObject = clc[color](printTarget);
  }
  if(util.isObject(printTarget)){
    if(log.prettyOn){
      let option = {
        dashColor : "gray",
        keysColor : "white",
        stringColor : color
      }
      finalPrintObject = pJson.render(printTarget, option);
    }
    else finalPrintObject = clc[color](JSON.stringify(printTarget, null, DEFAULT_JSON_SPACE));
  }
  if(util.isFunction(printTarget)){
    finalPrintObject = clc[color](printTarget.toString());
  }
  if(hightlight) finalPrintObject = clc.bgBlackBright(finalPrintObject);
 
  console.log(finalPrintObject);
}

let log = (target) => {
  if(!target) console.log();
  else console.log(target);
}

log.smartMode = false;

log.setGlobal = () => {
  GLOBAL.log = this;
}

log.enablePrettyPrint = () => {
  log.prettyOn = true;
}
log.disablePrettyPrint = () => {
  log.prettyOn = false;
}


log.enableSmartMode = () => {
  log.smartMode = true;
}

log.disableSmartMode = () => {
  log.smartMode = false;
}

function printImage(target, color){
  try{
    if(typeof target == 'string'){
      doLog(color, helpers.loadFromTextFile(target));
      return;
    }
    else if(typeof target == 'object'){
      if (validURL.isUri(target.url)){ 
        let ascii = helpers.checkExistOnRootFolder(target);
        if(ascii) doLog(color, ascii);
        else {
          helpers.loadFromService(target).then(function(ascii){
            doLog(color, ascii) 
          }); 
        }
      }else {
        log.err("You are providing invalid url");
      } 
    }
    else{
      log.r("Your parameter is wrong")
    }
  }catch(e){
    log.r(e);
  }
}

log.r = (target) => { doLog('red', target) } ;
log.g = (target) => { doLog('green', target) } ;
log.b = (target) => { doLog('blue', target) } ;
log.w = (target) => { doLog('white', target) } ;
log.y = (target) => { doLog('yellow', target) } ;
log.p = (target) => { doLog('pink', target) } ;
log.o = (target) => { doLog('orange', target) } ;

// logging data time before main log item
let prefix = (stringType) => {
  return moment().format('MMMM Do YYYY, h:mm:ss a') + " - " + stringType + ":"; 
}

log.err  = (target) => { log.r("\n" + prefix('ERROR') ) + log.r(target)       };
log.inf  = (target) => { log.b("\n" + prefix('INFO') ) + log.b(target)       };
log.wrn = (target) => { log.o("\n" + prefix('WARNING') ) + log.o(target)       };
log.lrt = (target) => { doLog("yellow", "\n" + prefix('ALERT'), true) + doLog('yellow', target, true) };

log.r.img = (target) => { printImage(target, 'red' ); };
log.g.img = (target) => { printImage(target, 'green' ); };
log.b.img = (target) => { printImage(target, 'blue' ); };
log.w.img = (target) => { printImage(target, 'white' ); };
log.y.img = (target) => { printImage(target, 'yellow' ); };
log.p.img = (target) => { printImage(target, 'pink' ); };
log.o.img = (target) => { printImage(target, 'orange' ); };

module.exports = log;