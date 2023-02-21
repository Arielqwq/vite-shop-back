import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, '缺少標題']
    },
    image: {
      type: String,
      required: [true, '缺少圖片']
    },
    description: {
      type: String,
      required: [true, '缺少內文']
    },
    sell: {
      type: Boolean,
      required: [true, '缺少狀態']
    }
  },
  { versionKey: false }
)
export default model('news', schema)
