import aboutus from '../models/aboutus.js'

// export const createAboutus = async (req, res) => {
//   try {
//     const result = await aboutus.create({
//       title: req.body.title,
//       description: req.body.description,
//       image: req.files?.image?.[0]?.path || ''
//     })
//     res.status(200).json({ success: true, message: '', result })
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
//     } else {
//       res.status(500).json({ success: false, message: '未知錯誤' })
//     }
//   }
// }

export const getAboutus = async (req, res) => {
  try {
    const result = await aboutus.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editAboutus = async (req, res) => {
  try {
    const aboutusNew = await aboutus.findById(req.params.id)
    aboutusNew.title = req.body.title
    aboutusNew.description = req.body.description
    aboutusNew.image = req.files?.image?.[0]?.path || aboutusNew.image
    await aboutusNew.save()
    res.status(200).json({ success: true, message: '', result: aboutusNew })
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
