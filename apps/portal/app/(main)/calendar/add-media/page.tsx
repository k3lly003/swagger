'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@workspace/ui'
import { toast } from 'sonner'
import { Progress } from '@workspace/ui'

// Define allowed file types and max size
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
] as const

type AllowedFileType = typeof ALLOWED_FILE_TYPES[number]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

interface UploadingFile extends File {
  progress?: number
  error?: string
}

interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

export default function AddMediaPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadingFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type as AllowedFileType)) {
      return 'File type not supported'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 50MB limit'
    }
    return null
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.map(file => {
      const error = validateFile(file)
      return {
        ...file,
        error,
        progress: 0
      } as UploadingFile
    })
    setFiles(prev => [...prev, ...validFiles])
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const uploadFile = async (file: File): Promise<{ success: boolean; error?: string; url?: string }> => {
    if (!file) {
      console.error('No file provided to uploadFile function')
      return { success: false, error: 'No file provided' }
    }

    // Create a safe date string, handling invalid timestamps
    const getFormattedDate = (timestamp: number) => {
      try {
        const date = new Date(timestamp)
        // Check if date is valid before converting to ISO string
        return date instanceof Date && !isNaN(date.getTime()) 
          ? date.toISOString()
          : 'Invalid Date'
      } catch (error) {
        return 'Invalid Date'
      }
    }

    console.log('Starting upload for file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: getFormattedDate(file.lastModified)
    })

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('Upload response:', data)

      if (!response.ok) {
        console.error('Upload failed with status:', response.status)
        return {
          success: false,
          error: data.error || `Upload failed with status ${response.status}`
        }
      }

      if (!data.success) {
        console.error('Upload failed:', data.error)
        return { success: false, error: data.error || 'Upload failed' }
      }

      console.log('Upload successful:', data.url)
      return { success: true, url: data.url }

    } catch (error) {
      console.error('Error during upload:', error)
      return { success: false, error: 'Network error during upload' }
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    setUploading(true)

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 0
          }))

          const result = await uploadFile(file)

          setUploadProgress(prev => ({
            ...prev,
            [file.name]: result.success ? 100 : 0
          }))

          return result
        })
      )

      const successCount = results.filter((r) => r.success).length
      const failureCount = results.length - successCount

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}`)
      }
      if (failureCount > 0) {
        toast.error(`Failed to upload ${failureCount} file${failureCount > 1 ? 's' : ''}`)
      }

      if (successCount > 0) {
        router.push('/media')
      }
    } catch (error) {
      console.error('Error in handleUpload:', error)
      toast.error('An error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  const getFileTypeIcon = (file: File) => {
    // Handle case where file.type is undefined
    if (!file.type) {
      return '📄' // Default icon for unknown type
    }

    const type = file.type.split('/')[0]
    switch (type) {
      case 'image':
        return '🖼️'
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      case 'application':
        return file.type.includes('pdf') ? '📄' : '📝'
      default:
        return '📄'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Add New Media</h1>
            <p className="text-sm text-gray-500">Upload new files to the media library</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="max-w-3xl mx-auto">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            Drag and drop your files here
          </h3>
          <p className="text-gray-500 mb-4">
            or click to browse from your computer
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept={ALLOWED_FILE_TYPES.join(',')}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="mx-auto">
              Browse Files
            </Button>
          </label>
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: Images (JPEG, PNG, GIF, WebP), Videos (MP4, WebM), Documents (PDF, DOC, DOCX)
            <br />
            Maximum file size: 50MB
          </p>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Selected Files</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 bg-white rounded-lg border ${
                    file.error ? 'border-red-300 bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{getFileTypeIcon(file)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{file.name}</p>
                        {file.error && (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {file.error}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploading && !file.error && (
                        <Progress 
                          value={uploadProgress[file.name] || 0} 
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    title="Remove file"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading || files.every(f => f.error)}
            className="bg-green-700 hover:bg-green-800"
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>
    </div>
  )
}
