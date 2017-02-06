/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Middleware for enabling CORS.
 */

'use strict';

module.exports = function enableCORS(request, response, next) {
  // Note: This should be limited on production
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type');
  response.header('Access-Control-Allow-Credentials', 'true');
  next();
};
