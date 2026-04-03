const { StretchingLog } = require('../models')

const save = async (data) => {
  // data: { session_id, target_part, duration,
  //         description, alarm_message }
  return await StretchingLog.create(data)
}

const getBySession = async (session_id) => {
  return await StretchingLog.findAll({
    where: { session_id },
    order: [['created_at', 'ASC']]
  })
}

module.exports = { save, getBySession }