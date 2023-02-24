import { Schema, model } from 'mongoose'
// import random from 'mongoose-simple-random'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '缺少名稱']
    },
    price: {
      type: Number,
      min: [0, '價格錯誤'],
      required: [true, '缺少價格']
    },
    description: {
      type: String,
      required: [true, '缺少說明']
    },
    image: {
      type: String,
      required: [true, '缺少圖片']
    },
    // 多圖
    images: {
      type: [String],
      default: []
    },
    sell: {
      type: Boolean,
      required: [true, '缺少狀態']
    },
    category: {
      type: String,
      required: [true, '缺少分類'],
      // enum 限制欄位的值只能是裡面的其中一個
      enum: {
        values: ['葡萄酒', '白蘭地', '清酒', '燒酒', '香檳氣泡酒', '啤酒', '奶酒', '其他'],
        message: '分類錯誤'
      }
    }
  },
  { versionKey: false }
)
export default model('products', schema)
