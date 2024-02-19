const path = require('path'); //path 모듈을 가져와서 사용

const express = require('express'); //express 모듈을 가져와서 사용
const morgan = require('morgan'); //morgan 모듈을 가져와서 사용
const dotenv = require('dotenv'); //dotenv모듈을 가져와서 사용
const cookieParser = require('cookie-parser'); //cookie-Parser모듈을 가져와서 사용
const session = require('express-session'); //express-session모듈을 가져와서 사용

const nunjucks = require('nunjucks'); //nunjucks모듈을 가져와서 사용
const { sequelize } = require('./models'); 

const passport = require('passport'); //경로 표시가 없는것은 노드를 설치할때 내장된 모듈이거나 우리가 설치한 모듈
const passportConfig = require('./passport'); //현재 폴더에서 passport폴더, 뒤에 파일명이 비어있으면 index(js파일)가 된다.

const authRouter = require('./routes/auth'); //routes폴더 안의 auth.js모듈을 가져와서 사용
const userRouter = require('./routes/user'); //routes폴더 안의 user.js모듈을 가져와서 사용
const basketRouter = require('./routes/basket');
const registerRouter = require('./routes/register');
const productRouter = require('./routes/product');
const payRouter = require('./routes/pay');
const orderRouter = require('./routes/order');
const indexRouter = require('./routes');  //require 함수를 통해서 모듈을 불러온다

dotenv.config(); //dotenv모듈의 config함수가 .env파일을 읽어서 env 속성 객체 안에 환경 변수들을 만들어줄 것이다.
passportConfig(); //패스포트 설정

const app = express(); //express모듈을 통해 객체 생성후 app 객체를 통해 다양한 일을 한다.
app.set('port', process.env.PORT || 3000); //프로그램이 실행되면 프로세스 객체가 생성된다, 사용할수 있는 이유는 config함수를 호출해줘 env파일을 읽어준다. PORT값이 있으면 PORT값, 없으면 3000

app.set('view engine', 'html'); 
nunjucks.configure(path.join(__dirname, 'views'), { //path모듈을 사용, views이름을 합쳐준다, nunjucks의 세팅을 views 폴더로 해놓은 것
    express: app,
    watch: true,
}); //운영체제마다 디렉토리 기호가 다르기때문에 join함수로 더해주기

sequelize.sync({ force: false }) //모듈들을 읽어서 DB테이블과 값을 동기화시켜준다
  .then(() => console.log('데이터베이스 연결 성공'))
  .catch(err => console.error(err));

  app.use( //node는 자바스크립트 실행 환경, express모듈의 특징은 미들웨어를 장착함으로써 구현, 장착하기위해 use메서드 사용
    morgan('dev'), //로그를 출력해주는 역할, dev는 로그의 등급을 나타내줌
    express.static(path.join(__dirname, 'public')), //지정된 public폴더 안에 특정 파일이 있으면 파일에 응답해준다
    express.json(), //post로 요청해서 응답받은 json 형식의 body를 parsing 해서 요청객체에 추가
    express.urlencoded({ extended: false }), //url을 parsing해서 req.parmas에 속성을 만들고 값을 추가 함
    cookieParser(process.env.SECRET), //요청자가 누구인지 알기 위해 사용
    session({  //쿠키가 노출될 우려가 있으므로 쿠키를 관리하기 위해 세션 사용
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        isAdded: false,
        isDeleted: false,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie',
    })
);

app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음. 해당 함수를 호출함으로써 req.isAuthendticated 같은 함수들이 생성됨
app.use(passport.session()); //req.session 객체에 passport 정보를 저장

app.use('/auth', authRouter); //미들웨어를 장착할때 특정 주소, 요쳥 주소에 대해서만 미들웨어를 장착하게 하려면 먼저 요청 주소를 전달하면 된다. 
app.use('/user', userRouter);
app.use('/basket', basketRouter);
app.use('/register', registerRouter);
app.use('/product', productRouter);
app.use('/pay', payRouter);
app.use('/order', orderRouter);
app.use('/', indexRouter);

app.use((req, res, next) => { 
    res.locals.title = require('./package.json').name; 
    res.locals.port = app.get('port'); //nunjucks를 사용하게 되면 title, port를 html파일에서 활용할 수 있다.
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.render('index'); //응답할때 render함수를 통해서 index를 전달하면 views폴더 안에서 index.html을 읽어서 응답, render함수 자체가 configure함수를 호출함.
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
}); //err 미들웨어는 요청객체, 응답객체, next함수, err가 붙는다. 

app.listen(app.get('port'), () => { 
    console.log(app.get('port'), '번 포트에서 대기 중'); //port를 열어주고 요청오는것을 대기해준다.
});

module.exports = app;
