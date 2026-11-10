import { verifyToken } from '../utils/jwt.js'
import { User } from '../models/index.js'

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated.' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Invalid token.' })
  }
}
