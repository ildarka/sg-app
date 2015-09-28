'use strict';
var fs = require('fs');

var rmdir = function rmdir(dirPath) {
      try       { var files = fs.readdirSync(dirPath); }
      catch (e) { return; }

      if (files.length > 0) {
        for (var i = 0; i < files.length; ++i) {
          var filePath = dirPath + '/' + files[i];
          if ( fs.lstatSync(filePath).isFile() || fs.lstatSync(filePath).isSymbolicLink() ) {
            fs.unlinkSync(filePath);
          } else {
            rmdir(filePath);
          }
        }
      }
      fs.rmdirSync(dirPath);
}

module.exports = rmdir;