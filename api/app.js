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
const SwaggerExpress = require('swagger-express-mw');
const express        = require('express');

// Project imports
const models = require('./models');

/* Globals *******************************************************************/
const base_path            = path.dirname(__dirname),
      server_path          = base_path + '/api',
      database_path        = base_path + '/database',
      server_config_path   = server_path + '/config/default.json',
      database_config_path = database_path + '/config.json';

// Server configuration
global.conf = require(server_config_path);
// Server path
global.conf.swagger.appRoot = server_path;
// Swagger path
global.conf.swagger.swaggerFile = server_path + '/swagger/swagger.yaml';

// Database configuration
global.conf.database = require(database_config_path).development;
if (global.conf.verbose)
    global.conf.database.logging = console.log;

/* INIT **********************************************************************/
const app = express();

models.initialize(global.conf.database);

SwaggerExpress.create(global.conf.swagger, (err, swaggerExpress) => {
  if (err)
    throw err;

  // Install middleware
  swaggerExpress.register(app);

  app.listen(conf.server.port, conf.server.host, () => {
    console.log(`Server started listening on ${conf.server.host}:${conf.server.port}`);
  });
});
