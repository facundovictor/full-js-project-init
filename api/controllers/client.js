/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Controller for the entity Client.
 */

'use strict';

// Project imports
const models = require('../models');


function client (req, res) {

  models.client.findAll({
    include : [ models.provider ]
  }).then((clients) => {
    let response = [];
    clients.forEach((client) => {
      let current_client = {
         id        : client.id,
         name      : client.name,
         email     : client.email,
         phone     : client.phone,
         providers : []
      };

      client.providers.forEach((provider) => {
        current_client.providers.push({
          id : provider.id
        });
      });

      response.push(current_client);
    });
    res.json(response);
  });

};

module.exports = { client };
