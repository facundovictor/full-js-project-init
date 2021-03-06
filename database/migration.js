/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * This is a script for doing migrations with sequelize. Why use this instead
 * of sequelize-cli? Because `sequelize-cli` includes a lot of extra function
 * -ality, and I just needed the minimum code for doing migrations.
 */

'use strict';

// Node imports
const path      = require('path');
const readline  = require('readline');
const fs        = require('fs');

// Library imports
// http://docs.sequelizejs.com/en/latest/docs/migrations/
const Sequelize = require('sequelize');
// https://github.com/sequelize/umzug
const umzug     = require('umzug');
// http://momentjs.com/docs/
const moment    = require('moment');
// https://github.com/tj/commander.js/
const commander = require('commander');


/* Command configuration *****************************************************/
commander
  .option('-u, --up [migration]', 'Execute all migrations up to the specified'+
                                  " one. If it's not specified, then execute "+
                                  'it up to the newest one')
  .option('-d, --down [migration]', 'Undo all migrations down to the specifie'+
                                    "d one. If it's not specified, then rever"+
                                    ' only the latest migration')
  .option('-n, --new', 'Generate a new migration')
  .option('-e, --executed', 'List the already executed migrations')
  .option('-p, --pending', 'List all pending migrations (Default behavior)')
  .option('-v, --verbose', 'Show more information on the stdout')
  .parse(process.argv);


/* Globals *******************************************************************/
const database_path   = path.dirname(__dirname) + '/database',
      migrations_path = database_path + '/migrations',
      config_path     = database_path + '/config.json';

// Database configuration
const conf = require(config_path).development;


/* Templates *****************************************************************/

// Migration file template
const migration_template = `/*
 * Author      : <your name>
 * Description : <Add a migration description here>
 */

'use strict';

// Reference : https://github.com/sequelize/umzug#getting-all-pending-migrations
module.exports = {
  up: function (db, queryInterface) {
    return new Promise((resolve, reject) => {
      // Describe how to achieve the task.
      // Call resolve/reject at some point.

      // Use transactions whenever possible
      /*
      db.transaction((transaction) => {
        return db.query(sql, {transaction})
      }).then((results) => resolve(results))
        .catch((error)  => reject(error));
      */
    });
  },

  // Create the revert function whenver possible
  down: function (db, queryInterface) {
    return new Promise((resolve, reject) => {
      // Describe how to achieve the task.
      // Call resolve/reject at some point.

      // Use transactions whenever possible
      /*
      db.transaction((transaction) => {
        return db.query(sql, {transaction})
      }).then((results) => resolve(results))
        .catch((error)  => reject(error));
      */
    });
  }
};
`;


/* Functions *****************************************************************/

/*
 * Get the mysql connector
 *
 * References: http://docs.sequelizejs.com/en/v3/docs/getting-started/
 *             http://docs.sequelizejs.com/en/1.7.0/docs/usage/
 *
 * @return {Object} Sequelize instance connected to the database
 */
function dbConnect () {
  let logger = commander.verbose ? console.log : null;
  return new Sequelize(conf.database, conf.username, conf.password, {
    dialect        : conf.dialect,
    port           : conf.port,
    host           : conf.host,
    logging        : logger,
    dialectOptions : {
      multipleStatements : true
    }
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
      params: [db, db.getQueryInterface()],
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
 * List all executed migrations.
 *
 * Reference: https://github.com/sequelize/umzug#getting-all-executed-migrations
 */
function listExecuted () {
  return migrator.executed().then((migrations) => {
    let amount = migrations.length;
    console.log(`Executed migrations : ${amount}`);
    for (var i=0; i<amount; i++)
      console.log(` [${i}] - ${migrations[i].file}`);
  });
}

/*
 * Creates a readline interface, for getting the user standard input
 *
 * Reference : https://nodejs.org/api/readline.html
 *
 * @return {Interface} A new readline.Interface instance
 */
function getReadLineInterface () {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
}

/*
 * Ask user for confirmation before proceeding with migrations.
 */
function askUserConfirmation(action, migration) {
  return new Promise((resolve, reject) => {
    const rl = getReadLineInterface();
    let description;

    if (action === 'up') {
      if (migration) {
        description = `Execute all migrations up to ${migration}`;
      } else {
        description = 'Execute all pending migrations';
      }
    } else if (action === 'down') {
      if (migration) {
        description = `Revert all migrations down to ${migration}`;
      } else {
        description = 'Revert the last migration';
      }
    }

    console.log(description);

    return rl.question('[Y/n] ', (answer) => {
      rl.close();
      if (answer !== 'y' && answer !== 'Y') {
        console.log('Aborting...');
        exit();
      }
      resolve(true);
    });
  });
};

/*
 * Given the action ('up' or 'down'), and a migration file, it executes all
 * pending migrations up to the specified migration (or it reverts all down to
 * it).
 *
 * When the migration target is unspecified, if the action is 'up', this will
 * run all pending migrations, otherwise, it will revert the last migration.
 *
 * @param action {String}, ['up' | 'down'] Action to perform
 * @param migration {String}, Optional file name that contains the migration
 *                            target.
 */
function runMigration(action, migration) {
  return new Promise ((resolve, reject) => {
    // If the migration isn't specified, the value is 'true'
    if (typeof migration !== "string")
      migration = false;

    askUserConfirmation(action, migration).then((confirmed) => {
      if (!confirmed)
        exit();

      if (!action) {
        console.log('Error: action unspecified. Aborting...');
        exit();
      }

      var params;

      if (migration) {
        params = {
          to : migration
        };
      }

      /* WARNING :
       * If action == 'down' and params == {}, it will revert all migrations.
       */
      return migrator[action](params).then((migrations) => {
        let amount      = migrations.length,
            description = action === 'up' ? 'Executed' : 'Reverted';
        console.log(`${description} migrations : ${amount}`);
        for (var i=0; i<amount; i++)
          console.log(` [${i}] - ${migrations[i].file}`);
        resolve();
      });
    }).catch((error) => reject(error));
  });
}

/*
 * Ask the user for the migration file description
 *
 * return {Promise} The promise of the user answer
 */
function getMigrationFileDescription () {
  return new Promise((resolve, reject) => {
    const rl = getReadLineInterface();

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

  return getMigrationFileDescription().then((description) => {
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

Promise.resolve().then(() => {
  if (commander.pending) {
    return listPending();
  } else if (commander.executed) {
    return listExecuted();
  } else if (commander.new) {
    return createMigrationFile();
  } else if (commander.up) {
    return runMigration('up', commander.up);
  } else if (commander.down) {
    return runMigration('down', commander.down);
  } else {
    commander.help();
    exit();
  }
}).then(() => {
  exit();
}).catch((error) => {
  if (commander.verbose)
    console.log(error);
  else
    console.log(error.message);

  exit();
});
