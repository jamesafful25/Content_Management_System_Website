import {
  loginService,
  registerAdminService,
  getProfileService,
  changePasswordService
} from '../services/authService.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const data = await loginService(email, password)
    res.status(200).json({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    const user = await registerAdminService({ name, email, password, role })
    res.status(201).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const user = await getProfileService(req.user.id)
    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' })
    }
    const result = await changePasswordService(req.user.id, currentPassword, newPassword)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}
