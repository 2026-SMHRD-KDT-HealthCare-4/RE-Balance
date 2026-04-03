const { PostureData } = require('../models')

const save = async (data) => {
  // data: { session_id, neck_angle, shoulder_angle,
  //         posture_score, alarm_message, posture_measurement_time }
  return await PostureData.create(data)
}

const getBySession = async (session_id) => {
  return await PostureData.findAll({
    where: { session_id },
    order: [['posture_measurement_time', 'ASC']]
  })
}

module.exports = { save, getBySession }