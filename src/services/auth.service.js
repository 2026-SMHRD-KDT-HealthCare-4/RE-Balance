const bcrypt = require('bcrypt')
const { sign } = require('../config/jwt')
const { User } = require('../models')

const register = async ({ name, email, password, gender }) => {
  const exists = await User.findOne({ where: { email } })
  if (exists) throw { status: 409, message: '이미 사용 중인 이메일입니다' }
  const hash = await bcrypt.hash(password, 10)
  await User.create({ name, email, password: hash, gender })
  return { message: '회원가입 성공' }
}

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } })
  if (!user) throw { status: 401, message: '이메일 또는 비밀번호가 틀렸습니다' }
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw { status: 401, message: '이메일 또는 비밀번호가 틀렸습니다' }
  const token = sign({ user_id: user.user_id, email: user.email })
  return { token, user: { user_id: user.user_id, email: user.email, name: user.name } }
}

module.exports = { register, login }