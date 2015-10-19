'use strict';
let fs = require('fs');
let _  = require('lodash');
let http = require("http");
let querystring = require('querystring');
let q       = require('q');

let rootPath = require("app-root-dir").get();
let picPath  = rootPath+"/ascii_pic.json";
let ascii_data = null;

if(fs.existsSync(picPath)) ascii_data = require(picPath);

const JP2A_DOMAIN = "http://52.88.187.28:8000/jp2a?";

module.exports = {
  checkExistOnRootFolder : function(obj){
    if(!ascii_data) return false;
    let cloneData = _.clone(ascii_data, true);
    delete cloneData.text;

    if(_.isEqual(cloneData, obj)){
      return ascii_data.text; 
    }

    else return false;
  },
  loadFromTextFile : function(path){
    let fileExist = fs.existsSync(path);
    if(fileExist){
      let ascii = fs.readFileSync(path);
      return ascii;
    }else return "File not found!";
  },
  loadFromService : function(obj){
    var deferred = q.defer();
    var self = this;
    var ascii = '';
    var query = querystring.stringify(obj);
    http.get(JP2A_DOMAIN+query, function(res){
      res.on('data', function(d){
        ascii += d;
      })
      res.on('end', function(){
        if(ascii) {
          let asciiObj = _.clone(obj, true);
          asciiObj.text = ascii; 
          let writeToFile = fs.writeFileSync(rootPath + "/ascii_pic.json", JSON.stringify(asciiObj), 0);
          deferred.resolve(ascii);
        } else{
          ascii = "Couldn't Make request to JP2A server";
        }
      })
    });
    return deferred.promise;
  }
}
