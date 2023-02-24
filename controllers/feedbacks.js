import feedbacks from '../models/feedbacks.js'

export const createFeedback = async (req, res) => {
  try {
    const result = await feedbacks.create({
      u_id: req.user._id,
      title: req.body.title,
      description: req.body.description
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

// 取自己的回應內容
export const getMyFeedbacks = async (req, res) => {
  try {
    const result = await feedbacks.find({ u_id: req.user._id })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 只有管理員看得到所有
export const getAllFeedbacks = async (req, res) => {
  try {
    // .populate('u_id', 'username')把 username填進去u_id裡，要多個就在'username account'新增，或是只不要某一個 '-username '
    const result = await feedbacks.find().populate('u_id', 'username')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 回覆
export const replyFeedbacks = async (req, res) => {
  try {
    const feedbacksNew = await feedbacks.findById(req.params.id)
    feedbacksNew.reply = req.body.reply
    feedbacksNew.status = req.body.status ? 1 : 0
    feedbacksNew.replyDate = new Date()
    await feedbacksNew.save()
    res.status(200).json({ success: true, message: '', result: feedbacksNew })
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
