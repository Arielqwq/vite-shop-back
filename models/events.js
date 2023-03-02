import { Schema, model, ObjectId } from 'mongoose'
import validator from 'validator'

const participantInfo = new Schema({
  account: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少帳號']
  },
  email: {
    type: String,
    required: [true, '缺少信箱']
  },
  phone: {
    type: String,
    validate: {
      validator (phone) {
        return validator.isMobilePhone(phone, 'zh-TW')
      },
      message: '手機格式錯誤'
    }
  }
})

const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, '缺少活動名稱']
    },
    price: {
      type: Number,
      min: [0, '價格錯誤'],
      required: [true, '缺少活動價格']
    },
    daysfrom: {
      type: String,
      required: [true, '缺少活動開始日期']
    },
    daysto: {
      type: String,
      required: [true, '缺少活動結束日期']
    },
    description: {
      type: String,
      required: [true, '缺少活動說明']
    },
    lecturer: {
      type: String,
      default: ''
    },
    lecturerInfo: {
      type: String,
      default: ''
    },
    pplNum: {
      type: Number,
      required: [true, '缺少活動人數']
    },
    image: {
      type: String,
      required: [true, '缺少活動圖片']
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
        values: ['體驗', '文章分享', '線上課程', '實體課程', '其他'],
        message: '分類錯誤'
      }
    },
    participant: {
      type: [participantInfo],
      default: []
    }
  },
  { versionKey: false }
)

export default model('events', schema)
