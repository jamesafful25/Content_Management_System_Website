import 'dotenv/config'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const isProduction = process.env.NODE_ENV === 'production'

const uploadDir = path.resolve(
    process.env.UPLOAD_PATH || 'uploads'
)

// Ensure local uploads directory exists
if (!isProduction && !fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Local development: save directly to disk
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

// Production: hold image in memory for S3 upload
const storage = isProduction ?
    multer.memoryStorage() :
    diskStorage

// Validate image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
    }
})

export default upload