import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Determine the storage mode
const isProduction = process.env.NODE_ENV === 'production'

// Upload directory for local development
const uploadDir = path.resolve(
    process.env.UPLOAD_PATH || 'uploads'
)

// AWS S3 configuration
const s3Bucket = process.env.S3_BUCKET
const awsRegion = process.env.AWS_REGION || 'us-east-1'

// Validate production configuration
if (isProduction && !s3Bucket) {
    throw new Error('S3_BUCKET must be configured in production')
}

// Create S3 client only when production storage is enabled
const s3Client = isProduction ?
    new S3Client({ region: awsRegion }) :
    null

/**
 * Generate the correct image URL.
 * Local development: use the Express uploads route.
 * Production: generate a temporary presigned S3 URL.
 */
export const getImageUrl = async(imageKey) => {
    if (!imageKey) return null

    if (!isProduction) {
        return `/uploads/${imageKey}`
    }

    const command = new GetObjectCommand({
        Bucket: s3Bucket,
        Key: imageKey
    })

    return await getSignedUrl(s3Client, command, {
        expiresIn: 900
    })
}

/**
 * Upload an image.
 * Local development: Multer has already saved the file.
 * Production: upload the image buffer to Amazon S3.
 */
export const uploadImage = async(imageFile) => {
    if (!imageFile) return null

    // Local development: Multer has already saved the file.
    if (!isProduction) {
        return imageFile.filename
    }

    // Production: upload the image buffer to S3.
    const extension = path.extname(imageFile.originalname).toLowerCase()
    const imageKey = `${randomUUID()}${extension}`

    await s3Client.send(new PutObjectCommand({
        Bucket: s3Bucket,
        Key: imageKey,
        Body: imageFile.buffer,
        ContentType: imageFile.mimetype
    }))

    return imageKey
}

/**
 * Delete an image.
 * Local development: remove from uploads directory.
 * Production: delete from Amazon S3.
 */
export const deleteImage = async(imageKey) => {
    if (!imageKey) return

    if (isProduction) {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: s3Bucket,
            Key: imageKey
        }))

        return
    }

    const imagePath = path.join(uploadDir, imageKey)

    try {
        await fs.unlink(imagePath)
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error
        }
    }
}