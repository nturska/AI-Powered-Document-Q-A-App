import { useState, useRef, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import '../styles/ChatInput.css'

interface ChatInputProps {
  onSend: (question: string) => void
  disabled: boolean
  pdfLoaded: boolean
}

export const ChatInput = ({ onSend, disabled, pdfLoaded }: ChatInputProps) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSend = value.trim().length > 0 && !disabled && pdfLoaded

  const handleSend = () => {
    if (!canSend) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
    }
  }

  const placeholder = !pdfLoaded
    ? 'Upload a PDF first...'
    : disabled
    ? 'Waiting for response...'
    : 'Ask a question about the document... (Enter to send)'

  return (
    <div className="chat-input">
      <div className={`chat-input__wrapper ${!pdfLoaded ? 'chat-input__wrapper--locked' : ''}`}>
        <textarea
          ref={textareaRef}
          className="chat-input__textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || !pdfLoaded}
          rows={1}
          aria-label="Ask a question"
          aria-disabled={disabled || !pdfLoaded}
        />
        <button
          className="chat-input__send"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send question"
          title="Send (Enter)"
        >
          <Send size={18} strokeWidth={2} />
        </button>
      </div>
      <p className="chat-input__hint">
        {pdfLoaded
          ? 'Shift + Enter for new line'
          : 'Upload a PDF to enable chat'}
      </p>
    </div>
  )
}