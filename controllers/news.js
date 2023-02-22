import news from '../models/news.js'

export const createNews = async (req, res) => {
  try {
    const result = await news.create({
      title: req.body.title,
      description: req.body.description,
      sell: req.body.sell,
      image: req.files?.image?.[0]?.path || ''
    })
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
export const getSellNews = async (req, res) => {
  try {
    const result = await news.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查單一個商品
export const getNewsPage = async (req, res) => {
  try {
    const result = await news.findById(req.params.id)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到此筆消息' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: 'ID 格式錯誤，找不到這則消息' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 只有管理員看得到
export const getAllNews = async (req, res) => {
  try {
    const result = await news.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editNews = async (req, res) => {
  try {
    const newsNew = await news.findById(req.params.id)
    newsNew.title = req.body.title
    newsNew.description = req.body.description
    newsNew.image = req.files?.image?.[0]?.path || newsNew.image
    await newsNew.save()
    res.status(200).json({ success: true, message: '', result: newsNew })
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
