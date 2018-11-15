'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('list_aisle_joins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      list_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'lists',
          key: 'id'
        }
      },
      aisle_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'aisles',
          key: 'id'
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('list_aisle_joins');
  }
};