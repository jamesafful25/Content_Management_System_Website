import jwt from 'jsonwebtoken'

/**
 * Generate a signed JWT token for a user
 * @param {object} payload - { id, role }
 * @returns {string} signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  })
}

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {object} decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
