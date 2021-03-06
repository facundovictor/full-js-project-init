/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Model for the relatinship Client <-> Provider.
 *
 * References:
 *  http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
 *  http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
 *  http://docs.sequelizejs.com/en/v3/docs/models-definition/#definition
 *  http://docs.sequelizejs.com/en/latest/docs/associations/#nm
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
  let client_provider = sequelize.define("client_provider", {
    client_id   : {
      type       : DataTypes.INTEGER,
      allowNull  : false,
      primaryKey : true
    },
    provider_id : {
      type       : DataTypes.INTEGER,
      allowNull  : false,
      primaryKey : true
    }
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps : false,

    // Configure the real database table name
    tableName  : 'client_provider'
  });

  return client_provider;
};
