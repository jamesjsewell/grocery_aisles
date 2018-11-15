'use strict';
module.exports = (sequelize, DataTypes) => {
  const aisle = sequelize.define('aisle', {
    name: DataTypes.STRING,
    store_id: DataTypes.INTEGER
  }, {});
  aisle.associate = function(models) {
    // associations can be defined here
    aisle.hasMany(models.product, { foreignKey: { name: "aisle" } })
   //aisle.belongsToMany(models.list, { foreignKey: { name: "aisle_id" }, through: 'lists', as: 'theAisle' })
    // aisle.belongsToMany(models.list, { foreignKey: 'aisle_id', through: 'list_aisle_joins' })
    
  };
  return aisle;
};