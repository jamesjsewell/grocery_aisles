'use strict';
module.exports = (sequelize, DataTypes) => {
  const list = sequelize.define('list', {
    store_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    aisle_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  list.associate = function(models) {
    // associations can be defined here
    list.hasMany(models.store, { foreignKey: { name: 'id' } })
  };
  return list;
};