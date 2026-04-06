const stretchingService = require('../services/stretching.service')

const saveStretchingLog = async (req, res, next) => {
  try {
    const result = await stretchingService.save(req.body)
    res.status(201).json(result)
  } catch (e) { next(e) }
}

const getStretchingBySession = async (req, res, next) => {
  try {
    const result = await stretchingService.getBySession(req.params.session_id)
    res.status(200).json(result)
  } catch (e) { next(e) }
}

module.exports = { saveStretchingLog, getStretchingBySession }