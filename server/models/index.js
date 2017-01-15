/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * This module connectes Sequelize to the database, finds every sequelize model
 * in the current directory and it loads it.
 */

'use strict';

// Node imports
const fs   = require('fs');

// Library imports
const Sequelize = require('sequelize');


let db = {

  /*
   * Creates a new instance of Sequelize connected to the database. Finds every
   * sequelize model in the current directory (models), and it loads it. And
   * finally, it loads all model associations.
   *
   * References: http://docs.sequelizejs.com/en/v3/docs/getting-started/
   *             http://docs.sequelizejs.com/en/1.7.0/docs/usage/
   *             http://docs.sequelizejs.com/en/1.7.0/articles/express/
   *
   * @param conf {Object}, Sequelize configuration.
   *
   * @return {Object} Database object that contains the following structure
   */
  initialize : function (conf) {

    // Initialize the new sequelize instance
    this.sequelize = new Sequelize(conf.database, conf.username, conf.password, {
      dialect : conf.dialect,
      port    : conf.port,
      host    : conf.host,
      logging : conf.logging,
      dialectOptions : {
        multipleStatements : true
      }
    });

    // Lookup for all the models in the current directory
    fs.readdirSync(__dirname)
      .filter((file) => {
        return (file.indexOf(".js",file.length - 3) !== -1) && (file !== "index.js");
      })
      .forEach((file) => {
        // Import the sequelize model
        let model = this.sequelize.import('./' + file);
        // Save the reference
        this[model.name] = model;
      });

    Object.keys(this).forEach((modelName) => {
      if ("associate" in this[modelName])
        this[modelName].associate(this);
    });
  }
}

module.exports = db;
