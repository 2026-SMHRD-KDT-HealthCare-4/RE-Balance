const authService = require('../services/auth.service')

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json(result)
  } catch (e) { next(e) }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json(result)
  } catch (e) { next(e) }
}

module.exports = { register, login }