import news from '../models/news.js'

export const createNews = async (req, res) => {
  try {
    const result = await news.create({
      title: req.body.title,
      description: req.body.description,
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

export const getNews = async (req, res) => {
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
