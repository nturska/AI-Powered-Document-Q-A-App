import { useRef, type DragEvent, type ChangeEvent, useState } from 'react'
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react'
import type { UploadStatus } from '../types'
import '../styles/FileUpload.css'

interface FileUploadProps {
  onUpload: (file: File) => void
  status: UploadStatus
  error: string | null
}

export const FileUpload = ({ onUpload, status, error }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isLocked = status === 'uploading'

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) return
    onUpload(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (isLocked) return
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isLocked) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleClick = () => {
    if (!isLocked) inputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={[
        'file-upload',
        isDragging && 'file-upload--dragging',
        status === 'success' && 'file-upload--success',
        status === 'error' && 'file-upload--error',
        status === 'uploading' && 'file-upload--uploading',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label="Upload PDF file"
      aria-disabled={isLocked}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        disabled={isLocked}
        className="file-upload__input"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="file-upload__content">
        <Icon status={status} isDragging={isDragging} />
        <Label status={status} isDragging={isDragging} />
        {error && (
          <p className="file-upload__error" role="alert">
            {error}
          </p>
        )}
        {status === 'idle' || status === 'error' ? (
          <span className="file-upload__subtext">PDF files only · Max 10MB</span>
        ) : null}
      </div>
    </div>
  )
}


const Icon = ({ status, isDragging }: { status: UploadStatus; isDragging: boolean }) => {
  const props = { size: 32, strokeWidth: 1.5, className: 'file-upload__icon' }

  if (status === 'uploading') return <Loader2 {...props} className="file-upload__icon file-upload__icon--spinning" />
  if (status === 'success')   return <FileText {...props} />
  if (status === 'error')     return <AlertCircle {...props} />
  if (isDragging)             return <UploadCloud {...props} className="file-upload__icon file-upload__icon--bounce" />
  return <UploadCloud {...props} />
}

const Label = ({ status, isDragging }: { status: UploadStatus; isDragging: boolean }) => {
  const text = {
    uploading: 'Uploading...',
    success:   'PDF loaded successfully',
    error:     'Upload failed — try again',
    idle:      isDragging ? 'Drop it here!' : 'Drag & drop or click to upload',
  }[status] ?? ''

  return <p className="file-upload__label">{text}</p>
}