/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Controller for the entity Client.
 */

'use strict';

// Library Imports
const router = require('express').Router();

// Project imports
const models = require('../models');


router.get('/client', (req, res) => {

  // models.client.findAll({
  //   include : [ models.provider ]
  // }).then((clients) => {
  //   clients.forEach((client) => {
  //       console.log(`Client : ${client.name}, providers : ${client.providers}`);
  //   });
  // });

  res.send('Client: In progress...');
});

module.exports = router;
