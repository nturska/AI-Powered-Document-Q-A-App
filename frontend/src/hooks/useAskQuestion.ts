import { useState, useCallback } from 'react'
import type { Message } from '../types'

export const useAskQuestion = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const ask = useCallback(async (question: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: question }
    const assistantId = crypto.randomUUID()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', isStreaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsStreaming(true)

    try {
      const res = await fetch(`/api/ask?q=${encodeURIComponent(question)}`)
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const token = line.slice(6)
          if (token === '[DONE]') break

          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: m.content + token } : m
          ))
        }
      }
    } catch (e) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: '⚠️ Something went wrong. Please try again.' }
          : m
      ))
    } finally {
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      ))
      setIsStreaming(false)
    }
  }, [])

  return { messages, ask, isStreaming }
}