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
    list.belongsToMany(models.product, {foreignKey: {name: 'id'}, through: 'lists', otherKey: 'product_id', as: 'theProduct' })
    list.belongsToMany(models.aisle, {foreignKey: {name: 'id'}, through: 'lists', otherKey: 'aisle_id', as: 'theAisle'})

   
  };
  return list;
};