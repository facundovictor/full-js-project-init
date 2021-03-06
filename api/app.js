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
const cors   = require('./middleware/cors');

/* Globals *******************************************************************/
const base_path            = path.dirname(__dirname),
      client_path          = base_path + '/client/public',
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

// Export the app module to allow it to be tested
module.exports = app;

// Initialize the database and all the models
models.initialize(global.conf.database);

// Load CORS
app.use(cors);

// Load the front-end app files
app.use(express.static(client_path));

SwaggerExpress.create(global.conf.swagger, (err, swaggerExpress) => {
  if (err)
    throw err;

  // Install middleware
  swaggerExpress.register(app);

  app.listen(conf.server.port, conf.server.host, () => {
    console.log(`Server started listening on ${conf.server.host}:${conf.server.port}`);
  });
});
