'use strict';
module.exports = (sequelize, DataTypes) => {
  const aisle = sequelize.define('aisle', {
    name: DataTypes.STRING,
    store_id: DataTypes.INTEGER
  }, {});
  aisle.associate = function(models) {
    // associations can be defined here
    aisle.hasMany(models.product, { foreignKey: { name: "aisle" } })

  };
  return aisle;
};