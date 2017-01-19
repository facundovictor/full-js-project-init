/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Controller for the entity Provider.
 */

'use strict';

// Project imports
const models = require('../models');


function provider (req, res) {

  models.provider.findAll().then((providers) => {
    res.json(providers);
  }).catch((error) => {
    console.log(error);
    if (global.conf.verbose)
      console.log(error.stack);
    res.sendStatus(500);
  });

};

module.exports = { provider };
