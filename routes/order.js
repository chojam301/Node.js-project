const express = require('express');

const { User, Basket, Order } = require('../models'); //models 폴더의 user 모듈을 가져와서 사용
const { isLoggedIn } = require('./helpers'); //로그인이 되어있는지 확인하기 위해 helpers에서 확인

const router = express.Router();

router.route('/')
.get(isLoggedIn, async (req, res, next) => { 
    try {
        const basket = await Basket.findAll({ 
            where: { userId: req.user.id },
            attributes: ['basketId', 'itemCount', 'totalPrice', 'itemId']
        });

        res.locals.title = require('../package.json').name;
        res.locals.user = req.user;
        res.locals.userId = req.user.id;
        res.locals.baskets = basket;

        res.render('order');
    } catch (err) {
        console.error(err);
        next(err);
    }
})
.post(async (req, res, next) => {
    try {
        const result = await Basket.destroy({
            where: { basketId: req.body.basketId }
        });

        if (result) res.redirect('/order');
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/decision', async(req, res, next) => {
    const basket = await Basket.findAll({ 
        where: { userId: req.user.id },
        attributes: ['basketId', 'itemCount', 'totalPrice', 'itemId']
    });
    // console.log(basket);

    const rand_0_9 = (Math.floor(Math.random() * 10)).toString();
    const orderId = req.user.id + rand_0_9;
    var total = 0;
    var sum = 0;
    var Ids='';
    var strs=''

    for (let i = 0; i < basket.length; i++) {
        sum = basket[i].dataValues.totalPrice;
        total += sum;
        strs = basket[i].dataValues.itemId;
        Ids += strs;
    }

    try {
        const result = await Order.create({ 
            orderId: orderId,
            totalPrice: total,
            userId: req.user.id,
            itemId: Ids
        });
        
        if (result) res.redirect('/');
        else next('실패했습니다.');

    } catch (err){
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
            const order = await user.getOrders(); //order에 user.getOrders메서드의 실행결과를 저장한다.
            res.json(order); //order 정보를 응답해 줌
        } else // user가 존재하지 않는 경우 메시지 출력 후 에러로 전달
            next(`There is no user with ${req.params.id}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
