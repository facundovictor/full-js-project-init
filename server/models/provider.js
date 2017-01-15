/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Model for the entity Provider.
 *
 * Reference:
 *      http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
  let Provider = sequelize.define("Provider", {
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
    classMethods: {
      associate: function(models) {
        Provider.belongsToMany(models.Client, {
          as         : 'clients',
          through    : 'client_provider',
          foreignKey : 'provider_id'
        });
      }
    }
  });

  return Provider;
};
