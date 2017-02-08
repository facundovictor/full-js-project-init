/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * References:
 *     https://github.com/theganyo/swagger-node-runner/issues/79
 */

'use strict';

// Exposed methods
module.exports = {
  // getAllProviders,
  // addProvider,
  // updateProvider,
  deleteProvider
};

/*
 * DELETE /provider/{id}
 *
 * Remove the provider specified by the 'id' parameter.
 *
 * This needs to be mocked, because it returns a response with no body, and
 * this is not supported by the auto-mock provided by swagger.
 *
 * Reference:
 *        https://github.com/theganyo/swagger-node-runner/issues/79
 */
function deleteProvider (req, res) {
  if (req.swagger.params.id.value > 0)
    res.sendStatus(204);
  else
    res.sendStatus(404);
}
