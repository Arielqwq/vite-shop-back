import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, '缺少標題']
    },
    description: {
      type: String,
      required: [true, '缺少說明']
    },
    response: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 0
    }
  }, { versionKey: false }
)
export default model('feedbacks', schema)
