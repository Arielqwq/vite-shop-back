import events from '../models/events.js'
// .sort({ _id: -1 }).limit(2) 過濾最新的兩筆

export const createEvent = async (req, res) => {
  try {
    console.log(req.file)
    console.log(req.files)
    const result = await events.create({
      title: req.body.title,
      price: req.body.price,
      daysfrom: req.body.daysfrom,
      daysto: req.body.daysto,
      description: req.body.description,
      pplNum: req.body.pplNum,
      lecturer: req.body.lecturer || '',
      lecturerInfo: req.body.lecturerInfo || '',
      image: req.files?.image?.[0]?.path || '',
      sell: req.body.sell,
      category: req.body.category
    })
    // .send() 或 .json() 都可，統一.json()。
    // .send() 會根據資料型態去改變回傳內容， .send('asdasd') 就預設回傳文字
    // res.status(200).send({ success: true, message: '', result })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 上架，查詢方法是 sell: true
export const getSellEvents = async (req, res) => {
  try {
    const result = await events.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getlastEventsforHome = async (req, res) => {
  try {
    const result = await events.find({ sell: true }).sort({ _id: -1 }).limit(2)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 會員查自己參加的活動
export const getMyEvents = async (req, res) => {
  try {
    const result = await events.find({ u_id: req.user._id })
    console.log(result)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 只有管理員看得到
export const getAllEvents = async (req, res) => {
  try {
    // 沒有任何查詢條件
    const result = await events.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查單一個商品
export const getEvent = async (req, res) => {
  try {
    const result = await events.findById(req.params.id)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到此商品' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: 'ID 格式錯誤，找不到此商品' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 編輯活動內容
export const editEvent = async (req, res) => {
  try {
    console.log(req.body)
    // console.log(req.files.images)
    // console.log(req.files.images.path)
    const eventNew = await events.findById(req.params.id)

    eventNew.title = req.body.title
    eventNew.price = req.body.price
    eventNew.daysfrom = req.body.daysfrom
    eventNew.daysto = req.body.daysto
    eventNew.description = req.body.description
    eventNew.lecturer = req.body.lecturer || ''
    eventNew.lecturerInfo = req.body.lecturerInfo || ''
    eventNew.pplNum = req.body.pplNum
    eventNew.image = req.files?.image?.[0]?.path || eventNew.image
    // console.log(eventNew)
    eventNew.sell = req.body.sell
    eventNew.category = req.body.category
    console.log(eventNew)
    // Mongoose 有 upsert:true ，當找不到東西時，可自動新增一筆 => ,{ new: true, upsert:true})
    await eventNew.save()
    if (!eventNew) {
      // 找不到這個東西，無法更新
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result: eventNew })
    }
  } catch (error) {
    console.log(error)

    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 編輯活動參與成員
export const editEventParticipant = async (req, res) => {
  try {
    const event = await events.findById(req.params.id)
    console.log(req.user._id.toString())
    const idx = event.participant.findIndex(data => data.account === req.user._id.toString())
    console.log(idx)
    if (idx > -1) {
      res.status(400).json({ success: false, message: '已報名' })
      return
    } else {
      event.participant.push({
        account: req.user._id,
        email: req.user.email,
        phone: req.body.phone
      })
      await event.save()
      res.status(200).json({ success: true, message: '' })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
