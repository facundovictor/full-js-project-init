/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * This module loads all the controllers.
 */

'use strict';

// Node imports
const fs = require('fs');


let controllers = {};

// Lookup for all the controllers in the current directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf(".js",file.length - 3) !== -1) && (file !== "index.js");
  })
  .forEach((file) => {
    // Import the controller
    let controller = require('./' + file);
    // Save the reference with the same name as the file (The extension is ignored).
    controllers[file.replace(/\.[^/.]+$/, "")] = controller;
  });

module.exports = controllers;
