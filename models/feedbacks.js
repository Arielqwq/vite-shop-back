import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema(
  {
    u_id: {
      type: ObjectId,
      ref: 'users'
    },
    title: {
      type: String,
      required: [true, '缺少標題']
    },
    description: {
      type: String,
      required: [true, '缺少說明']
    },
    reply: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 0
    },
    createDate: {
      type: Date,
      default: new Date()
    },
    replyDate: {
      type: Date
    }
  }, { versionKey: false }
)
export default model('feedbacks', schema)
