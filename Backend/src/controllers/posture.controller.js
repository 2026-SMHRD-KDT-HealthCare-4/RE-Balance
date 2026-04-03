const postureService = require('../services/posture.service')

const savePostureData = async (req, res, next) => {
  try {
    const result = await postureService.save(req.body)
    res.status(201).json(result)
  } catch (e) { next(e) }
}

const getPostureBySession = async (req, res, next) => {
  try {
    const result = await postureService.getBySession(req.params.session_id)
    res.status(200).json(result)
  } catch (e) { next(e) }
}

module.exports = { savePostureData, getPostureBySession }