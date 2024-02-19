const path = require('path'); //path 모듈을 가져와서 사용

const express = require('express'); //express 모듈을 가져와서 사용
const { User } = require('../models'); //models폴더 안의 index모듈을 가져와서 User, Comment 구조분해 할당해서 사용 

const router = express.Router(); //라우터 분리를 위해 사용

router.get('/users', async (req, res, next) => { //users 경로에 접근한 경우
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'age', 'gender']
        });
        // 모든 사용자 정보를 응답해 줌
        res.json(users);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; //이 모듈을 외부로 노출시켜 사용 가능하도록 함
