import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import https from 'https'
import userRoute from './routes/users.js'
// 錯誤測試
// import userRoute from './routes/users'
import productRoute from './routes/products.js'
import orderRoute from './routes/orders.js'
import aboutusRoute from './routes/aboutus.js'
import eventsRoute from './routes/events.js'

import './passport/passport.js'

//  => localhost 免安裝版mongoDB
// mongoose.connect(process.env.DB_URL, { family: 4 })

mongoose.connect(process.env.DB_URL)
// 消毒:過濾
mongoose.set('sanitizeFilter', true)

// 以下設定的順序有差
const app = express()

// 跨域請求設定
app.use(cors({
  // 順序有差
  // origin 代表請求來源, Postman 等後端的請求會是 undefined (增加 || origin === undefined 為允許 postman 請求)
  // callback(錯誤, 是否允許)
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      // 不允許請求
      callback(new Error(), false)
    }
  }
}))
// 處理跨域錯誤
// callback(new Error(), false) 跳來這裡
app.use((_, req, res, next) => {
  console.log(_)
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

app.use('/users', userRoute)
// 商品
app.use('/products', productRoute)
// 訂單
app.use('/orders', orderRoute)
// 關於我們
app.use('/aboutus', aboutusRoute)
// 活動頁
app.use('/events', eventsRoute)

if (process.env.render) {
  setInterval(() => {
    https.get(process.env.render)
  }, 1000 * 60 * 5)
}
// // 固定回傳200
// app.get('/', (req, res) => {
//   res.status(200).json({ success: true, message: '' })
// })

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '~我找不到~' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('~伺服器啟動~')
})
