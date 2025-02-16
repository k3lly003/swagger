import { NextResponse } from 'next/server'
import { writeFile, mkdir, access, constants } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Define allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(req: Request) {
  try {
    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    console.log('Received upload request:', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size
    })

    // Validate file presence
    if (!file) {
      console.error('No file provided in request')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        { success: false, error: 'File type not supported' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.size)
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Create unique filename
    const bytes = new Uint8Array(8)
    crypto.getRandomValues(bytes)
    const uniqueId = Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
    
    const fileName = `${uniqueId}-${file.name}`
    console.log('Generated unique filename:', fileName)

    // Convert file to buffer
    let buffer: Buffer
    try {
      const arrayBuffer = await file.arrayBuffer()
      console.log('File converted to ArrayBuffer:', { size: arrayBuffer.byteLength })
      buffer = Buffer.from(arrayBuffer)
      console.log('ArrayBuffer converted to Buffer:', { size: buffer.length })
    } catch (error) {
      console.error('Error converting file to buffer:', error)
      return NextResponse.json(
        { success: false, error: 'Error processing file' },
        { status: 500 }
      )
    }

    // Ensure uploads directory exists and is writable
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    console.log('Upload directory path:', uploadDir)

    try {
      // Check if directory exists
      if (!existsSync(uploadDir)) {
        console.log('Creating uploads directory...')
        await mkdir(uploadDir, { recursive: true })
        console.log('Uploads directory created successfully')
      }

      // Check directory permissions
      await access(uploadDir, constants.W_OK)
      console.log('Uploads directory is writable')
    } catch (error) {
      console.error('Directory error:', error)
      return NextResponse.json(
        { success: false, error: 'Server configuration error - contact administrator' },
        { status: 500 }
      )
    }

    // Save the file
    try {
      const filePath = join(uploadDir, fileName)
      console.log('Attempting to save file to:', filePath)
      await writeFile(filePath, buffer)
      
      console.log('File saved successfully:', {
        path: filePath,
        size: buffer.length,
        type: file.type
      })

      // Return success response with file URL
      const fileUrl = `/uploads/${fileName}`
      console.log('Returning success response with URL:', fileUrl)
      return NextResponse.json({
        success: true,
        url: fileUrl
      })

    } catch (error) {
      console.error('Error saving file:', error)
      return NextResponse.json(
        { success: false, error: 'Error saving file to disk' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Unexpected error during upload:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error during upload' },
      { status: 500 }
    )
  }
} 