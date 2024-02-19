const passport = require('passport'); //passport 모듈을 가져와서 사용
const Strategy = require('passport-local').Strategy; //passport-local 모듈에서 Strategy 생성자를 불러옴
const bcrypt = require('bcrypt'); //비밀번호 해싱을 위해 bcrypt 모듈을 가져와 사용

const User = require('../models/user'); // models 폴더의 user 모듈 가져와 사용

module.exports = () => { //해당 화살표 함수를 외부로 노출함
  passport.use(new Strategy({ // passport.use 로 전략 미들웨어 추가
    usernameField: 'id',      // 각각 req.body의 키 값을 필드값으로 설정 (req.body.id)
    passwordField: 'password' // req.body.password
  }, async (id, password, done) => { // 미들웨어가 호출될 때 req.body에 있는 id와 password를 전달함

    try {
      const user = await User.findOne({ where: { id } }); // user가 있나 id 속성을 이용해 찾음
      if (user) { // user가 존재하는 경우
        const result = await bcrypt.compare(password, user.password); // 입력받은 비밀번호를 해싱된 비밀번호와 비교하여 체크함
        if (result) 
          done(null, user); //결과가 true면 user 정보 전달
        else // 결과가 false 면 에러 메시지 전달
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
      } else  // user가 없는 경우 에러 메시지 전달
        done(null, false, { message: '가입되지 않은 회원입니다.' });
    } catch (error) {
      done(error);
    }
  }));
};
