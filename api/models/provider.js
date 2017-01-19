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
      type          : DataTypes.INTEGER,
      primaryKey    : true,
      autoIncrement : true
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

      /*
       * Load the model associations with other models.
       *
       * @param models {Array} , Array of all the registered models
       */
      associate: function(models) {

        // Save the models reference
        this.models = models;

        provider.belongsToMany(models.client, {
          through  : {
            model  : models.client_provider,
            unique : false
          },
          foreignKey : 'provider_id'
        });
      },


      /*
       * Given an existent provider identified by the id. It updates it
       * with the new data.
       *
       * @param id {Number} , The provider id
       * @param data {JSON} , The Swagger provider data values.
       *
       * @return {Promise} , The promise of the updated provider.
       *
       * @throw {Error} , An error if the passed data is wrong.
       */
      updateProvider : function (id, data) {
        let models = this.models;

        return models.provider.find({
          where : { id }
        }).then( provider => {
          if (provider == null) {
            // TODO: Create custom errors
            let error = new Error("Trying to update a non-existent provider");
            error.wrongData = true;
            throw error;
          }

          return provider.update(data, {
            where : { id }
          }).then(() => {
            return provider;
          });
        });
      }
    }
  });

  return provider;
};
