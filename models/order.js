const Sequelize = require('sequelize');

module.exports = class Order extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      orderId: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
      },
      state: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
      },
      totalPrice: {
        type: Sequelize.INTEGER
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Order',
      tableName: 'orders',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Order.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
  }
};
