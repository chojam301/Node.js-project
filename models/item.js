const Sequelize = require('sequelize');

module.exports = class Item extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            itemIds: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true
            },
            itemName: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            itemCount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            itemPrice: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Item',
            tableName: 'items',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Item.hasMany(db.Basket, { foreignKey: 'itemId', sourceKey: 'itemIds', onDelete: 'cascade' });
    }
};
