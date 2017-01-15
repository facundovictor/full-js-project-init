/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Model for the entity Provider.
 *
 * References:
 *  http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
 *  http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
 *  http://docs.sequelizejs.com/en/v3/docs/models-definition/#definition
 *  http://docs.sequelizejs.com/en/latest/docs/associations/#nm
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
  let provider = sequelize.define("provider", {
    id   : {
      type       : DataTypes.INTEGER,
      allowNull  : false,
      primaryKey : true
    },
    name : {
      type      : DataTypes.STRING(50),
      allowNull : false
    }
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps   : false,

    // Configure the real database table name
    tableName    : 'provider',

    classMethods : {
      associate: function(models) {
        provider.belongsToMany(models.client, {
          through  : {
            model  : models.client_provider,
            unique : false
          },
          foreignKey : 'provider_id'
        });
      }
    }
  });

  return provider;
};
