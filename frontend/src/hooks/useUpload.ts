import { useState } from 'react'
import type { UploadStatus } from '../types'

export const useUpload = () => {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File) => {
    setStatus('uploading')
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Upload failed')
      }
      setFileName(file.name)
      setStatus('success')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setStatus('error')
    }
  }

  return { upload, status, fileName, error }
}