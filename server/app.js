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
const path      = require('path');

// Library imports
const express = require('express');
const app     = express();

/* Globals *******************************************************************/
const base_path            = path.dirname(__dirname),
      server_path          = base_path + '/server',
      database_path        = base_path + '/database',
      server_config_path   = server_path + '/config.json',
      database_config_path = database_path + '/config.json';

// Database configuration
let conf = require(server_config_path).development;
conf.database = require(database_config_path).development;

/* Routes ********************************************************************/

app.get('/', function (req, res) {
  res.send('In progress...');
});


/* INIT **********************************************************************/

app.listen(conf.port, conf.host, function () {
  console.log(`Server started listening on ${conf.host}:${conf.port}`);
});
