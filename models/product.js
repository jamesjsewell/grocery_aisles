'use strict';
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    aisle: DataTypes.INTEGER
  }, {});
  product.associate = function(models) {
    // associations can be defined here

  };
  return product;
};