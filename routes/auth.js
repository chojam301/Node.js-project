const e = require('express');
const express = require('express');   //express 모듈을 가져와서 사용
const passport = require('passport'); //passport 모듈을 가져와서 사용

const router = express.Router();  //라우터 분리를 위해 사용

router.post('/login', (req, res, next) => {  //post로 로그인 요청이 들어오면 api 호출함수 출력됨
    passport.authenticate('local', (authError, user, info) => { //local.js에 local 전략을 수행, done 함수에 전달된 값이 (authError, user, info) 콜백함수로 전달됨
        if (user) req.login(user, loginError => res.redirect('/')); //로그인 성공 시에 redirect 실행
        else next(`Login fail!`);  //실패 시에 로그인 실패 문구를 출력함
    })(req, res, next); //요청 객체, local전략을 수행하기 위해서 필요함
});

router.get('/logout', (req, res, next) => {
    req.logout(); //initialize 미들웨어 함수를 호출함으로서 logout 함수를 추가
    req.session.destroy(); //로그아웃을 함으로서 세션 삭제
    res.redirect('/'); //기본 경로로 redirect
});

module.exports = router; //라우터 노출
