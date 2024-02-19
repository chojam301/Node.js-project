exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) next(); //로그인 되어 있으면 next 함수 호출
    else res.status(403).send('로그인 필요'); //로그인 되어 있지 않으면 상태코드 403 설정 후 로그인 필요라는 문구 출력
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) next(); //로그인 되어있지 않으면 next 함수 호출
    else res.redirect(`/`); //로그인 되어있으면 redirect
};

exports.isAdminLoggedIn = (req, res, next) => {
    if (req.user.isAdmin == true) {
        console.log('물품 관리');
        next();
    }
    else res.status(403).send('관리자가 아닙니다.');
};