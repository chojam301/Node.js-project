const Sequelize = require('sequelize');

module.exports = class Basket extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      basketId: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
      itemCount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.INTEGER
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Basket',
      tableName: 'baskets',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Basket.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
  }

  static associate1(db) {
    db.Basket.belongsTo(db.Item, { foreignKey: 'itemId', targetKey: 'itemIds' });
  }
};
