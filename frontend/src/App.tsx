import { useUpload } from './hooks/useUpload'
import { useAskQuestion } from './hooks/useAskQuestion'
import { FileUpload } from './components/FileUpload'
import { StatusBar } from './components/StatusBar'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { Moon, Sun, FileSearch } from 'lucide-react'
import { useState, useEffect } from 'react'
import './App.css';
import { BrowserRouter } from 'react-router-dom'

function App() {
  const { upload, status, fileName, error } = useUpload()
  const { messages, ask, isStreaming } = useAskQuestion()
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <BrowserRouter basename="/projects/pdf-qa">
      <div className="app">

        <header className="app__header">
          <div className="app__logo">
            <FileSearch size={22} strokeWidth={2} aria-hidden="true" />
            <span className="app__logo-text">PDF Q&amp;A</span>
          </div>
          <button
            className="app__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark'
              ? <Sun size={18} strokeWidth={2} />
              : <Moon size={18} strokeWidth={2} />
            }
          </button>
        </header>

        <main className="app__main">

          <aside className="app__sidebar">
            <div className="app__sidebar-inner">
              <h2 className="app__sidebar-title">Document</h2>
              <p className="app__sidebar-hint">
                Upload a PDF to start asking questions about its content.
              </p>
              <FileUpload
                onUpload={upload}
                status={status}
                error={error}
              />
              <StatusBar
                fileName={fileName}
                status={status}
              />
            </div>
          </aside>


          <section className="app__chat" aria-label="Chat">
            <ChatWindow
              messages={messages}
              isStreaming={isStreaming}
            />
            <ChatInput
              onSend={ask}
              disabled={isStreaming}
              pdfLoaded={status === 'success'}
            />
          </section>

        </main>
      </div>
    </BrowserRouter>
  )
}

export default App