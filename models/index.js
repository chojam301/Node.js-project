const Sequelize = require('sequelize');
const User = require('./user');
const Basket = require('./basket');
const Item = require('./item');
const Order = require('./order');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Basket = Basket;
db.Item = Item;
db.Order = Order;

User.init(sequelize);
Basket.init(sequelize);
Item.init(sequelize);
Order.init(sequelize);

User.associate(db);
User.associate1(db);
Basket.associate(db);
Basket.associate1(db);
Item.associate(db);
Order.associate(db);


module.exports = db;
