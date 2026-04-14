import ReactMarkdown from 'react-markdown'
import type { Message } from '../types'
import '../styles/ChatMessage.css'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <div className="chat-message__avatar" aria-hidden="true">
        {isUser ? '🧑' : '🤖'}
      </div>
      <div className="chat-message__bubble">
        {isUser ? (
          <p className="chat-message__text">{message.content}</p>
        ) : (
          <div className="chat-message__markdown">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {message.isStreaming && (
          <span
            className="chat-message__cursor"
            aria-label="Assistant is typing"
            aria-live="polite"
          />
        )}
      </div>
    </div>
  )
}