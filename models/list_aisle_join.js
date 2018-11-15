'use strict';
module.exports = (sequelize, DataTypes) => {
  const list_aisle_join = sequelize.define('list_aisle_join', {
    list_id: DataTypes.INTEGER,
    aisle_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {});
  list_aisle_join.associate = function(models) {
    // associations can be defined here
  };
  return list_aisle_join;
};