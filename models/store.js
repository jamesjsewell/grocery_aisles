'use strict';
module.exports = (sequelize, DataTypes) => {
  const store = sequelize.define('store', {
    name: DataTypes.STRING
  }, {});
  store.associate = function(models) {

    // associations can be defined here
    store.hasMany(models.aisle, { foreignKey: { name: 'store_id' } })

  };
  return store;
};