import { useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage'
import type { Message } from '../types'
import '../styles/ChatWindow.css'

interface ChatWindowProps {
  messages: Message[]
  isStreaming: boolean
}

export const ChatWindow = ({ messages, isStreaming }: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-window" ref={containerRef} role="log" aria-live="polite" aria-label="Conversation">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}

const EmptyState = () => (
  <div className="chat-window__empty">
    <div className="chat-window__empty-icon" aria-hidden="true">💬</div>
    <p className="chat-window__empty-title">No messages yet</p>
    <p className="chat-window__empty-hint">Upload a PDF and ask your first question.</p>
  </div>
)