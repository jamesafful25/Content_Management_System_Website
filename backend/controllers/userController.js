import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} from '../services/userService.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService()
    res.status(200).json({ success: true, users })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.params.id, req.body)
    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id, req.user.id)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}
