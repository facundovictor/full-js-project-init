/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Model for the entity Client.
 *
 * Reference:
 *      http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
  let Client = sequelize.define("Client", {
    id   : {
      type       : DataTypes.INTEGER,
      allowNull  : false,
      primaryKey : true
    },
    name : {
      type      : DataTypes.STRING(50),
      allowNull : false
    },
    email : {
      type      : DataTypes.STRING(50),
      allowNull : false
    },
    phone : {
      type      : DataTypes.STRING(50),
      allowNull : false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Client.belongsToMany(models.Provider, {
          as         : 'providers',
          through    : 'client_provider',
          foreignKey : 'client_id'
        });
      }
    }
  });

  return Client;
};
