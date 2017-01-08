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
const readline  = require('readline');
const moment    = require('moment');
const fs        = require('fs');


/* Globals *******************************************************************/
const database_path   = path.dirname(__dirname) + '/database',
      migrations_path = database_path + '/migrations',
      config_path     = database_path + '/config.json';

// Database configuration
const conf = require(config_path).development;

// Migration file template
const migration_template = `/*
 * Author      : <your name>
 * Description : <Add a migration description here>
 */

'use strict';

// Reference : https://github.com/sequelize/umzug#getting-all-pending-migrations
module.exports = {
  up: function () {
    return new Promise(function (resolve, reject) {
      // Describe how to achieve the task.
      // Call resolve/reject at some point.
    });
  },

  down: function () {
    return new Promise(function (resolve, reject) {
      // Describe how to revert the task.
      // Call resolve/reject at some point.
    });
  }
};
`;

/* Functions *****************************************************************/

/*
 * Get the mysql connector
 *
 * Reference: http://docs.sequelizejs.com/en/v3/docs/getting-started/
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
 * Reference: https://github.com/sequelize/umzug#configuration
 *
 * @return {Object} Umzug instance connected to the database
 */
function initializeMigrator () {
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
 * Properly ends the process by closing the database connection first.
 */
function exit() {
  db.close();
  process.exit();
}

/*
 * List all pending migrations.
 *
 * Reference: https://github.com/sequelize/umzug#getting-all-pending-migrations
 */
function listPending () {
  return migrator.pending().then((migrations) => {
    let amount = migrations.length;
    console.log(`Pending migrations : ${amount}`);
    for (var i=0; i<amount; i++)
      console.log(` [${i}] - ${migrations[i].file}`);
  });
}

/*
 * Ask the user for the migration file description
 *
 * return {Promise} The promise of the user answer
 */
function getMigrationFileDescription () {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter a description, or [q] for abort: ', (answer) => {
      // For readability, avoid using uppercase letters along with lowercase
      answer = answer.toLowerCase().trim();

      if (answer === 'q') {
        rl.close();
        console.log('Aborting...');
        exit();
      }

      // Replace white spaces by '-'
      answer = answer.replace(/\s+/g, '-');
      // Remove all characters that are not a letter or a number
      answer = answer.replace(/[^a-z0-9-]/g, '');

      if (!answer.length) {
        console.log('A description is required!');
        resolve(getMigrationFileDescription());
      } else {
        resolve(answer);
        rl.close();
      }
    });
  });
}

/*
 * Creates a migration file with the current time in its name
 */
function createMigrationFile () {
  console.log("> New migration file");

  getMigrationFileDescription().then((description) => {
    const file_name = `${moment().format('YYYYMMDDHHmmss')}-${description}.js`,
          file_path = `${migrations_path}/${file_name}`;

    fs.writeFileSync(file_path, migration_template);

    console.log(`
    migration created:
    ${file_path}
    `);
  });
}


/* Main **********************************************************************/

var db       = dbConnect();
var migrator = initializeMigrator();

// listPending().then(() => exit());
createMigrationFile();
