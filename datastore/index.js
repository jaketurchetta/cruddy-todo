const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(err);
        }
        callback(null, { id, text });
      }
      );
    }
  });
};

exports.readAll = (callback) => {

  var results = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      for (var i = 0; i < files.length; i++) {
        var slicedId = files[i].slice(0, -4);
        results.push({ id : slicedId, text: slicedId });
      }
      callback(null, results);
    }
  });

};

exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf-8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf-8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};


exports.delete = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf-8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
