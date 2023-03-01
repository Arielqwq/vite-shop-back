import users from '../models/users.js'
import products from '../models/products.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      username: req.body.username
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        username: req.user.username,
        phone: req.user.phone,
        birth: req.user.birth,
        // cart: req.user.cart.lenth 購物車顯示種類數
        // 累加器 .reduce(function, 初始值) => .reduce((目前已加的值, 目前迴圈跑到陣列的東西) => 每次的值 + current.quantity, 0),
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    console.log('login' + error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        account: req.user.account,
        email: req.user.email,
        username: req.user.username,
        phone: req.user.phone,
        birth: req.user.birth,
        // cart: req.user.cart.lenth 購物車顯示種類數
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editUser = async (req, res) => {
  try {
    console.log(req.body)

    req.user.account = req.body.account || req.user.account
    req.user.password = req.body.password || req.user.password
    req.user.email = req.body.email || req.user.email
    req.user.username = req.body.username || req.user.username
    req.user.phone = req.body.phone || req.user.phone
    req.user.birth = req.body.birth || req.user.birth

    const result = await req.user.save()
    console.log(result)

    res.status(200).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        username: req.user.username,
        phone: req.user.phone,
        birth: req.user.birth
      }
    })
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

export const adminEditUser = async (req, res) => {
  try {
    // console.log(req)
    // const result = await users.findByIdAndUpdate(req.body._id, {
    //   account: req.body.account,
    //   email: req.body.email
    // }
    const result = await users.findByIdAndUpdate(req.body._id, {
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      username: req.body.username,
      phone: req.body.phone,
      birth: req.body.birth
    }, { new: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editCart = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const idx = req.user.cart.findIndex(cart => cart.p_id.toString() === req.body.p_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      // parseInt(req.body.quantity) 傳數字
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      console.log(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.cart.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.cart[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到此商品' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.cart.push({
        p_id: req.body.p_id,
        // parseInt(req.body.quantity) 傳數字
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    // result: req.user.cart.lenth 購物車顯示種類數
    res.status(200).json({ success: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    // .findById(要搜尋的id, '要取出的欄位')查詢使用者資料，只要取出 'cart' 欄位內容，其他資訊不需要，
    // .populate()把資料帶到該帶的地方，只取 'cart.p_id'就好
    const result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
    res.status(200).json({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取所有會員
// 只有管理員看得到
export const getAllUsers = async (req, res) => {
  try {
    // 沒有任何查詢條件
    const result = await users.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 編輯收藏
export const editLove = async (req, res) => {
  try {
    const idx = req.user.love.findIndex(favorite => favorite.toString() === req.body.p_id)
    if (idx > -1) {
      if (req.body.love === false) {
        req.user.love.splice(idx, 1)
      }
    } else if (req.body.love === true) {
      req.user.love.push(req.body.p_id)
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.body.love })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 會員後台取得收藏
export const getLove = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'love').populate('love')
    res.status(200).json({ success: true, message: '', result: result.love })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getLoveById = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: '', result: req.user.love.includes(req.params.id) })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
