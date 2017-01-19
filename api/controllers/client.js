/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Controller for the entity Client.
 *
 * References:
 *   https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */

'use strict';

// Project imports
const models = require('../models');

// Exposed methods
module.exports = {
  getAllClients,
  getClient,
  addClient,
  updateClient,
  deleteClient
};


/*
 * Given a client, it returns the minimum client data.
 *
 * @param Client {Object} , Client model
 *
 * @return {JSON} minimum client data
 */
function getClientData (client) {
  let clientResponse = {
      id        : client.id,
      name      : client.name,
      email     : client.email,
      phone     : client.phone,
      providers : []
  };

  if (client.providers) {
    client.providers.forEach( provider => {
        clientResponse.providers.push({
            id : provider.id
        });
    });
  }

  return clientResponse;
}


/*
 * GET /client
 *
 * Get all the clients including the providers' ids.
 */
function getAllClients (req, res) {

  models.client.findAll({
    include : [ models.provider ]
  }).then( clients => {
    let response = clients.map( client => {
      return getClientData(client);
    });
    res.json(response);
  }).catch( error => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);
    res.sendStatus(500);
  });

}


/*
 * GET /client/{id}
 *
 * Get the clients that corresponds with the id parameter. Also, includes the
 * the providers' ids.
 */
function getClient (req, res) {

  models.client.find({
    where   : {
      id : req.swagger.params.id.value
    },
    include : [ models.provider ]
  }).then( client => {
    if (client != null)
        res.status(200).json(getClientData(client));
    else
        res.sendStatus(404);
  }).catch( error => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);
    res.sendStatus(500);
  });

}


/*
 * POST /client
 *
 * Add a new client with the nested associated providers data.
 */
function addClient (req, res) {

  let client = req.swagger.params.client.value;

  models.client.createClientWithProviders(client).then( new_client => {
      /* The standard specifies that on success, the answer should contain
       * the header 'location' with the URI that references to the new re-
       * source.
       * But, answering with the complete resource, gives a fastest and com-
       * plete representation of the resource state. Also, it avoids a second
       * hit to the API.
       */
      // res.location(`/client/${new_client.id}`);
      res.status(201).json(getClientData(new_client));
  }).catch( error => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);

    let status = 500;
    if (error.wrongData)
      status = 404;

    res.status(status).json({
      message : error.message
    });
  });
}


/*
 * PUT /client/{id}
 *
 * Update the client specified by the 'id' parameter, using the client informa
 * -tion on the request's body.
 */
function updateClient (req, res) {

  let id     = req.swagger.params.id.value,
      client = req.swagger.params.client.value;

  models.client.updateClientWithProviders(id, client).then( updated_client => {
      res.status(200).json(getClientData(updated_client));
  }).catch( error => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);

    let status = 500;
    if (error.wrongData)
      status = 404;

    res.status(status).json({
      message : error.message
    });
  });
}


/*
 * DELETE /client/{id}
 *
 * Remove the client specified by the 'id' parameter.
 */
function deleteClient (req, res) {

  models.client.destroy({
    where : {
      id : req.swagger.params.id.value
    }
  }).then( destroyedRowsAmount => {
    if (destroyedRowsAmount === 1)
      res.sendStatus(204);
    else
      res.sendStatus(404);
  }).catch( error => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);
    res.status(500).json({
      message : error.message
    });
  });

}
