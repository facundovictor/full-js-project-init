/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Model for the entity Client.
 *
 * References:
 *  http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
 *  http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
 *  http://docs.sequelizejs.com/en/v3/docs/models-definition/#definition
 *  http://docs.sequelizejs.com/en/latest/docs/associations/#nm
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
  let client = sequelize.define("client", {
    id   : {
      type          : DataTypes.INTEGER,
      primaryKey    : true,
      autoIncrement : true
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

    // Configure the real database table name
    tableName    : 'client',

    classMethods : {

      /*
       * Load the model associations with other models.
       *
       * @param models {Array} , Array of all the registered models
       */
      associate: function(models) {

        // Save the models reference
        this.models = models;

        client.belongsToMany(models.provider, {
          through  : {
            model  : models.client_provider,
            unique : false
          },
          foreignKey : 'client_id'
        });
      },

      /*
       * Given a new client data with the nested associated providers data, it
       * creates the new client, and associates it to the providers.
       *
       * @param data {JSON} , The Swagger client data values.
       *
       * @return {Promise} , The promise of the created client.
       *
       * @throw {Error} , An error if the passed data is wrong.
       */
      createClientWithProviders : function (data) {
        let models = this.models;

        let clientPromise = models.provider.findAll({
          where : {
            id : {
              $or : data.providers.map((provider) => provider.id)
            }
          }
        }).then( providers => {
          if (providers.length !== data.providers.length) {
            // TODO: Create custom errors
            let error = new Error("Trying to associate a non-existent provider");
            error.wrongData = true;
            throw error;
          }

          // Create the client
          return models.client.create(data).then( new_client => {
            if (providers.length) {
              // Add the providers
              return new_client.addProviders(providers).then(() => {
                  return new_client;
              });
            }
            return new_client;
          });
        }).then( new_client => {
          // Get the nested client data
          return models.client.find({
            where   : { id : new_client.id },
            include : [ models.provider ]
          });
        });

        return clientPromise;
      },

      /*
       * Given an existent client identified by the id. It updates the client
       * with the new data, including the nested associated providers data.
       *
       * @param id {Number} , The client id
       * @param data {JSON} , The Swagger client data values.
       *
       * @return {Promise} , The promise of the updated client.
       *
       * @throw {Error} , An error if the passed data is wrong.
       */
      updateClientWithProviders : function (id, data) {
        let models = this.models;

        let clientPromise = models.client.find({
          where   : { id },
          include : [ models.provider ]
        }).then( client => {
          if (client == null) {
            // TODO: Create custom errors
            let error = new Error("Trying to update a non-existent client");
            error.wrongData = true;
            throw error;
          }

          return models.provider.findAll({
            where : {
              id : {
                $or : data.providers.map((provider) => provider.id)
              }
            }
          }).then((providers) => {
            if (providers.length !== data.providers.length) {
              // TODO: Create custom errors
              let error = new Error("Trying to associate a non-existent provider");
              error.wrongData = true;
              throw error;
            }

            return client.update(data, {
              where : { id }
            }).then(() => {
              if (providers.length) {
                // Set the providers
                return client.setProviders(providers).then(() => {
                    return client;
                });
              }
              return client;
            });
          });
        });

        return clientPromise;
      }
    }
  });

  return client;
};
