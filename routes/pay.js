const express = require('express');
const { User, Order, Basket } = require('../models'); //models 폴더의 user 모듈을 가져와서 사용

const router = express.Router();

router.route('/') // 기본 경로
    .get(async (req, res, next) => {
        try {

            res.locals.title = require('../package.json').name;
            res.locals.user = req.user;
            
            res.render('pay'); 
          
        } catch (err) {
            console.error(err);
            next(err); 
        }
    });

router.post('/charge', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id }
        });

        const point = parseInt(user.points) + parseInt(req.body.points)
    
        const result = await User.update({
            points: point
        }, {
            where: { id: req.user.id }
        }); 

        if (result) res.redirect('/'); 
        else next('Not charged!') 
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/payment', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
        });

        const decision = await Order.findOne({
            attributes: ['totalPrice', 'orderId']
        }, {
            where: { userId: req.user.id }
        });
        console.log(decision);
        console.log(decision.dataValues.orderId);

        const change =  parseInt(user.points) - parseInt(decision.dataValues.totalPrice)

        const result = await User.update({
            points: change
        }, {
            where: { id: req.user.id }
        });

        if (result) {
            await Order.destroy({
                where: { orderId: decision.dataValues.orderId }
            });
            await Basket.destroy({
                where: { userId: req.user.id }
            })
            res.redirect('/');
        }
        else next('실패했습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
