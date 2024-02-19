const express = require('express');
const Item = require('../models/item');
const { isAdminLoggedIn } = require('./helpers');

const router = express.Router();

router.route('/')
.get(isAdminLoggedIn, async (req, res, next) => {
    try {
        const item = await Item.findAll({
            attributes: ['itemIds', 'itemName', 'itemCount', 'itemPrice']
        });

        res.locals.title = require('../package.json').name;
        res.locals.user = req.user;
        res.locals.items = item;
    
        res.render('product', {
            isAdded: req.session.isAdded,
            isDeleted: req.session.isDeleted
        });
        req.session.isAdded = false;
        req.session.isDeleted = false;
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/add', async (req, res, next) =>{
    const { itemIds, itemName, itemCount, itemPrice } = req.body;

    if (!itemIds) return next('물품 아이디를 입력하세요.');
    else if (!itemName) return next('물품 이름을 작성해주세요');
    else if (!itemCount) return next('수량을 작성해주세요');
    else if (!itemPrice) return next('가격을 작성해주세요');

    const item = await Item.findOne({ where: { itemIds } });
    if (item) {
        next('이미 해당 아이디로 등록된 물품입니다.');
        return;
    }

    try {
        await Item.create({
            itemIds,
            itemName,
            itemCount,
            itemPrice
        });
        req.session.isAdded = true;
        res.redirect('/product');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/modify', async (req, res, next) => {
    const {itemIds, itemName, itemCount, itemPrice } = req.body;

    if (!itemIds) return next('물품 아이디를 입력하세요');
    else if (!itemName || !itemCount || !itemPrice)
        return next('빈 칸 없이 모든 항목을 작성해 주세요');

    try {
        const result = await Item.update({
            itemName: itemName,
            itemCount: itemCount,
            itemPrice: itemPrice,
        }, {
            where: { itemIds: itemIds }
        });

        if (result) res.redirect('/product');
        else next('Not updated!');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/delete', async (req, res, next) => {
    try {
        const result = await Item.destroy({
            where: { itemIds: req.body.itemIds }
        });

        if (result) {
            req.session.isDeleted = true;
            res.redirect('/product');
        }
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
