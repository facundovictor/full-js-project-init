/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Controller for the entity Provider.
 */

'use strict';

// Library Imports
const router = require('express').Router();

// Project imports
const models = require('../models');


router.get('/provider', (req, res) => {

  // models.provider.findAll({
  //   include : [ models.client ]
  // }).then((providers) => {
  //   providers.forEach((provider) => {
  //       console.log(`Provider : ${provider.name}, clients : ${provider.clients}`);
  //   });
  // });

  res.send('Provider: In progress...');
});

module.exports = router;
