const passport = require('passport');  // passport 모듈을 가져와서 사용
const local = require('./local');      // local.js 모듈을 가져와서 사용
const User = require('../models/user');// models 폴더의 user.js 모듈을 가져와서 사용

module.exports = () => {  // 해당 화살표 함수를 외부로 바로 노출함
    // 로그인 할 때 실행되며 req.session에 어떤 데이터를 저장할지 정하는 메서드이다.
    passport.serializeUser((user, done) => {
        done(null, user.id); // 사용자 정보가 공유되면 안되기 때문에 아이디만 저장함
    });
    /*
    deserializeUser는 매 요청시 마다 실행되며 serializeUser에서 저장한 user.id를
    첫 번째 매개변수로 사용하여 DB 조회로 사용자 정보를 얻어낸다.
    */
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id }
        })
            .then(user => done(null, user)) // 조회한 정보를 req.user에 저장한다.
            .catch(err => done(err));
    });

    local();
};