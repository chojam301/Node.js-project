const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false
            },
            gender: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            points: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            isAdmin: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Basket, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });
    }

    static associate1(db) {
        db.User.hasMany(db.Order, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });
    }
};
