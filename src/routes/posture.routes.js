const router = require('express').Router()
const auth = require('../middlewares/auth.middleware')
const { savePostureData, getPostureBySession } =
  require('../controllers/posture.controller')

// 자세 데이터 저장 (실시간 배치 전송)
router.post('/', auth, savePostureData)
// 세션별 자세 기록 조회
router.get('/session/:session_id', auth, getPostureBySession)

module.exports = router