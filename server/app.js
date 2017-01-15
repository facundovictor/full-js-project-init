/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Minimal prototype of a RESTful API using:
 *      - ExpressJS
 *      - Sequelize
 *      - Swagger
 *
 * The base entities that this API serves are 'clients' and 'providers'.
 */

'use strict';

// Node imports
const path = require('path');

// Library imports
const express = require('express');
const app     = express();

// Project imports
const models = require('./models');

/* Globals *******************************************************************/
const base_path            = path.dirname(__dirname),
      server_path          = base_path + '/server',
      database_path        = base_path + '/database',
      server_config_path   = server_path + '/config.json',
      database_config_path = database_path + '/config.json';

// Server configuration
global.conf = require(server_config_path).development;
global.conf.database = require(database_config_path).development;

if (global.conf.verbose)
    global.conf.database.logging = console.log;

/* Routes ********************************************************************/

app.get('/', function (req, res) {
  res.send('In progress...');
});


/* INIT **********************************************************************/

models.initialize(global.conf.database);

app.listen(conf.port, conf.host, function () {
  console.log(`Server started listening on ${conf.host}:${conf.port}`);
});
