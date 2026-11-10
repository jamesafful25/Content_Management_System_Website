import { User } from '../models/index.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'

/**
 * Login an admin user
 * @param {string} email
 * @param {string} password
 * @returns {{ token, user }}
 */
export const loginService = async (email, password) => {
  const user = await User.findOne({ where: { email } })

  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 })
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Account has been deactivated'), { statusCode: 401 })
  }

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 })
  }

  const token = generateToken({ id: user.id, role: user.role })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  }
}

/**
 * Register a new admin user (superadmin only)
 * @param {object} data - { name, email, password, role }
 * @returns {User}
 */
export const registerAdminService = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ where: { email } })
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { statusCode: 400 })
  }

  const hashed = await hashPassword(password)
  const user = await User.create({ name, email, password: hashed, role })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

/**
 * Get logged in user profile
 * @param {number} userId
 * @returns {User}
 */
export const getProfileService = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  })
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 })
  }
  return user
}

/**
 * Update admin password
 * @param {number} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId)
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 })
  }

  const isMatch = await comparePassword(currentPassword, user.password)
  if (!isMatch) {
    throw Object.assign(new Error('Current password is incorrect'), { statusCode: 400 })
  }

  const hashed = await hashPassword(newPassword)
  await user.update({ password: hashed })

  return { message: 'Password updated successfully' }
}
