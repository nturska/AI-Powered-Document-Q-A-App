export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  isStreaming?: boolean
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'