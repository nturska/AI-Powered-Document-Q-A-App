import { FileText, FileQuestion } from 'lucide-react'
import type { UploadStatus } from '../types'
import '../styles/StatusBar.css'

interface StatusBarProps {
  fileName: string | null
  status: UploadStatus
}

export const StatusBar = ({ fileName, status }: StatusBarProps) => {
  return (
    <div className={`status-bar status-bar--${status}`} role="status" aria-live="polite">
      <div className="status-bar__content">
        {fileName ? (
          <>
            <FileText size={14} strokeWidth={2} className="status-bar__icon" aria-hidden="true" />
            <span className="status-bar__filename" title={fileName}>
              {fileName}
            </span>
            <span className="status-bar__badge">Active</span>
          </>
        ) : (
          <>
            <FileQuestion size={14} strokeWidth={2} className="status-bar__icon" aria-hidden="true" />
            <span className="status-bar__empty">No document loaded</span>
          </>
        )}
      </div>
    </div>
  )
}