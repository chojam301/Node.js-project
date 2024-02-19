const express = require('express'); //express 모듈을 가져와서 사용

const { Item, Basket, User } = require('../models');
const { isLoggedIn } = require('./helpers'); //로그인이 되어있는지 확인하기 위해 helpers에서 확인

const router = express.Router(); //라우터 분리를 위해 사용

router.route('/')
    //미들웨어 호출 하기 전에 로그인이 되어있는지 확인, 로그인 되어있으면 호출 아니면 error
    .get(isLoggedIn, async (req, res, next) => { 
        try {
            const item = await Item.findAll({ 
                attributes: ['itemIds', 'itemName', 'itemCount', 'itemPrice']
            });

            res.locals.title = require('../package.json').name;
            res.locals.user = req.user;
            res.locals.userId = req.user.id;
            res.locals.items = item;

            res.render('basket');

        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        const { itemName, itemCount } = req.body;
        const userId = req.user.id;
        const item = await Item.findOne({
            where: { itemName: itemName },
            attributes: [ 'itemIds', 'itemCount', 'itemPrice' ]
        });
        const itemIds = item.itemIds;
        const itemCnt = item.itemCount;
        const rand_0_9 = (Math.floor(Math.random() * 10)).toString();
        const basketId = req.user.id + rand_0_9;
        const newCount = parseInt(itemCnt) - parseInt(itemCount);
        const total = parseInt(itemCount) * (item.itemPrice);

        try {
            const result = await Basket.create({ 
                basketId: basketId,
                userId: userId, 
                itemId: itemIds, 
                itemCount,
                totalPrice: total
            });

        
            if (result) {
                await Item.update({
                    itemCount: newCount
                }, {
                    where: { itemIds: itemIds }
                });
                res.redirect('/');
            }
            else next('실패했습니다.')
            
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


router.get('/:id', async (req, res, next) => {
    try {
        //User 테이블 내 id와 넘겨받은 id와 같은 경우 정보를 가져와 user에 저장함
        const user = await User.findOne({
            where: { id: req.params.id }
        });

        if (user) { //user가 존재하는 경우
            const basket = await user.getBaskets();
            res.json(basket); 
        } else // user가 존재하지 않는 경우 메시지 출력 후 에러로 전달
            next(`There is no user with ${req.params.id}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; //라우터를 노출시킴
