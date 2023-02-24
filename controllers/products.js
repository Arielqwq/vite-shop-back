import products from '../models/products.js'
import { Types } from 'mongoose'

export const createProduct = async (req, res) => {
  try {
    console.log(req.file)
    console.log(req.files)
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.files?.image?.[0]?.path || '',
      images: req.files?.images?.map(file => file.path) || [],
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
export const getSellProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取推薦商品
export const getProducRecom = async (req, res) => {
  try {
    const result = await products.aggregate([
      {
        $match: { sell: true, _id: { $ne: Types.ObjectId(req.params.id) } }
      },
      {
        $sample: { size: 4 }
      }
    ])
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 只有管理員看得到
export const getAllProducts = async (req, res) => {
  try {
    // 沒有任何查詢條件
    const result = await products.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查單一個商品
export const getProduct = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
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

export const editProduct = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.files.images)
    // console.log(req.files.images.path)
    const productNew = await products.findById(req.params.id)
    // console.log('ya' + req.files.images.path)
    // console.log(productNew)
    // 因為 delImages 是陣列，.includes(image)是指陣列裡的image
    const images = productNew.images.filter(image => !req.body?.delImages?.includes(image)).concat(req.files?.images?.map(file => file.path)).filter(image =>
      image !== null && image !== undefined
    )
    console.log(images, 'images')
    productNew.name = req.body.name
    productNew.price = req.body.price
    productNew.description = req.body.description
    productNew.image = req.files?.image?.[0]?.path || productNew.image
    productNew.images = images
    productNew.sell = req.body.sell
    productNew.category = req.body.category
    console.log(productNew)
    // Mongoose 有 upsert:true ，當找不到東西時，可自動新增一筆 => ,{ new: true, upsert:true})
    await productNew.save()
    if (!productNew) {
      // 找不到這個東西，無法更新
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result: productNew })
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

// export const deleteProduct = async (req, res) => {
//   try {
//     const result = await products.findByIdAndUpdate(req.params.id, {
//       status: req.body.status
//     }, { new: true })
//     if (!result) {
//       res.status(404).json({ success: false, message: '找不到' })
//     } else {
//       console.log(result)
//       res.status(200).json({ success: true, message: '' })
//     }
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
//     } else if (error.name === 'CastError') {
//       res.status(404).json({ success: false, message: '找不到' })
//     } else {
//       res.status(500).json({ success: false, message: '未知錯誤' })
//     }
//   }
// }
