/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Controller for the entity Provider.
 */

'use strict';

// Project imports
const models = require('../models');

// Exposed methods
module.exports = {
  getAllProviders,
  addProvider,
  updateProvider,
  deleteProvider
};


/*
 * GET /provider
 *
 * Get all the providers.
 */
function getAllProviders (req, res) {

  models.provider.findAll().then( providers => {
    res.status(200).json(providers);
  }).catch((error) => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);
    res.sendStatus(500);
  });

}


/*
 * POST /provider
 *
 * Add a new provider.
 */
function addProvider (req, res) {

  let provider = req.swagger.params.provider.value;

  models.provider.create(provider).then( new_provider => {
    /* The standard specifies that on success, the answer should contain
     * the header 'location' with the URI that references to the new re-
     * source.
     * But, answering with the complete resource, gives a fastest and com-
     * plete representation of the resource state. Also, it avoids a second
     * hit to the API.
     */
    // res.location(`/provider/${new_provider.id}`);
    res.status(201).json(new_provider);
  }).catch( error => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);
    res.status(500).json({
      message : error.message
    });
  });
}


/*
 * PUT /provider/{id}
 *
 * Update the provider specified by the 'id' parameter, using the provider in-
 * formation on the request's body.
 */
function updateProvider (req, res) {

  let id       = req.swagger.params.id.value,
      provider = req.swagger.params.provider.value;

  models.provider.updateProvider(id, provider).then( updated_provider => {
    res.status(200).json(updated_provider);
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
 * DELETE /provider/{id}
 *
 * Remove the provider specified by the 'id' parameter.
 */
function deleteProvider (req, res) {

  models.provider.destroy({
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
