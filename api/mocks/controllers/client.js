/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * References:
 *     https://github.com/theganyo/swagger-node-runner/issues/79
 */

'use strict';

// Exposed methods
module.exports = {
  // getAllClients,
  // getClient,
  // addClient,
  // updateClient,
  deleteClient
};


/*
 * DELETE /client/{id}
 *
 * Remove the client specified by the 'id' parameter.
 *
 * This needs to be mocked, because it returns a response with no body, and
 * this is not supported by the auto-mock provided by swagger.
 *
 * Reference:
 *        https://github.com/theganyo/swagger-node-runner/issues/79
 */
function deleteClient (req, res) {
  if (req.swagger.params.id.value > 0)
    res.sendStatus(204);
  else
    res.status(404).send({
      message : 'Trying to update a non-existent client'
    });
}
