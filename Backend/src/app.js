const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/error.middleware'); //

const app = express();

// 1. 미들웨어 설정
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' })); //
app.use(express.json()); // Postman으로 보내는 JSON 데이터를 읽기 위해 필수!

// 2. 이미지 정적 서빙
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))); //

// 3. 라우터 등록
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/posture', require('./routes/posture.routes'));
app.use('/api/stretching', require('./routes/stretching.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 4. 에러 핸들러 적용 (모든 라우터 설정 아래에 위치해야 함)
app.use(errorHandler); //

// 5. 서버 실행 (이 부분이 없으면 Postman 테스트가 불가능합니다!)
const PORT = process.env.PORT || 3000; //
app.listen(PORT, () => {
    console.log(` 서버가 포트 ${PORT}에서 정상 실행 중입니다!`);
    console.log(` 테스트 주소: http://localhost:${PORT}/api/auth/login`);
});

module.exports = app;