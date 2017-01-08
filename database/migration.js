/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * This is a script for doing migrations with sequelize. Why use this instead
 * of sequelize-cli? Because `sequelize-cli` includes a lot of extra function
 * -ality, and I just needed the minimum code for doing migrations.
 */

'use strict';

// http://docs.sequelizejs.com/en/latest/docs/migrations/
const sequelize = require('sequelize');
// https://github.com/sequelize/umzug
const umzug     = require('umzug');
const path      = require('path');


/* Globals *******************************************************************/
const database_path   = path.dirname(__dirname) + '/database',
      migrations_path = database_path + '/migrations',
      config_path     = database_path + '/config.json';

// Database configuration
const conf = require(config_path).development;


/* Functions *****************************************************************/

/*
 * Get the mysql connector
 *
 * @return {Object} Sequelize instance connected to the database
 */
function dbConnect () {
  return new sequelize(conf.database, conf.username, conf.password, {
    dialect : conf.dialect,
    port    : conf.port,
    logging : console.log
  });
}

/*
 * Return the umzug migrator, connected to the database through Sequelize
 *
 * @return {Object} Umzug instance connected to the database
 */
function initializeMigrator () {
  let db = dbConnect();

  // See --> https://github.com/sequelize/umzug#configuration
  return new umzug({
    storage        : 'sequelize',
    upName         : 'up',
    downName       : 'down',
    storageOptions : {
      /*
        This will track the migrations on the table __migrations
        in the same database.
      */
      sequelize  : db,
      tableName  : '__migrations',
      columnName : 'migration'
    },
    migrations: {
      // The params that gets passed to the migrations.
      params: [db],
      // The path to the migrations directory.
      path: migrations_path,
      // The pattern that determines whether or not a file is a migration.
      pattern: /^\d+[\w-]+\.js$/
    }
  });
}

/*
 * List all pending migrations.
 */
function listPending () {
  migrator.pending().then((migrations) => {
    let amount = migrations.length;
    console.log(`Pending migrations : ${amount}`);
    for (var i=0; i<amount; i++)
      console.log(` [${i}] - ${migrations[i].file}`);
  });
}

/* Main **********************************************************************/

var migrator = initializeMigrator();

listPending();
