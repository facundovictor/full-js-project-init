/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Model for the entity Client.
 *
 * References:
 *  http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
 *  http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
  let client = sequelize.define("client", {
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
      allowNull : false,
      validate  : {
        isEmail : true
      }
    },
    phone : {
      type      : DataTypes.STRING(50),
      allowNull : false
    }
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps   : false,

    tableName    : 'client',

    classMethods : {
      associate: function(models) {
        client.belongsToMany(models.provider, {
          through  : {
            model  : models.client_provider,
            unique : false
          },
          foreignKey : 'provider_id'
        });
      }
    }
  });

  return client;
};
