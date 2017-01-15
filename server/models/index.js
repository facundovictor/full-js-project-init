/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * This connectes Sequelize to the database, finds every sequelize model in the
 * current directory and it loads it.
 */

 'use strict';

// Node imports
const fs   = require('fs');
const path = require('path');

// Library imports
const Sequelize = require('sequelize');


let db = {
  initialize : function (conf) {
    let me = this;

    me.sequelize = new Sequelize(conf.database, conf.username, conf.password, {
      dialect : conf.dialect,
      port    : conf.port,
      host    : conf.host,
      logging : conf.logging,
      dialectOptions : {
        multipleStatements : true
      }
    });

    fs.readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf(".js",file.length - 3) !== -1) && (file !== "index.js");
      })
      .forEach(function(file) {
        var model = me.sequelize.import('./' + file);
        me[model.name] = model;
      });
  }
}

module.exports = db;
