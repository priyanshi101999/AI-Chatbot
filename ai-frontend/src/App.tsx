import { useEffect, useRef, useState } from 'react'
import './App.css'
import { sendMessageToAi } from './api/chat'

type ChatMessage = {
  role: 'user' | 'ai'
  content: string
}

const SUGGESTIONS = [
  'Plan my day in a realistic way',
  'Explain React state like I am new',
  'Write a short professional email',
  'Give me 3 startup ideas with AI',
]

const BOT_NAME = 'Brainwave'

function renderMessageContent(content: string) {
  const segments = content.split(/(\*\*.*?\*\*)/g)

  return segments.map((segment, index) => {
    if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
      return <strong key={`${segment}-${index}`}>{segment.slice(2, -2)}</strong>
    }

    return <span key={`${segment}-${index}`}>{segment}</span>
  })
}

function App() {
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, loading])

  const sendMessage = async (prefilledMessage?: string) => {
    const nextMessage = (prefilledMessage ?? message).trim()

    if (!nextMessage || loading) {
      return
    }

    const nextHistory = [...chat, { role: 'user', content: nextMessage } as ChatMessage]

    setError('')
    setLoading(true)
    setChat(nextHistory)
    setMessage('')

    try {
      const response = await sendMessageToAi({
        message: nextMessage,
        history: chat,
      })

      setChat((currentChat) => [
        ...currentChat,
        { role: 'ai', content: response.reply ?? 'No response received.' },
      ])
    } catch {
      setError('The assistant could not respond. Check that the backend is running on port 8000.')
      setChat(nextHistory)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="app-backdrop" />

      <aside className="app-sidebar">
        <div>
          <p className="sidebar-eyebrow">{BOT_NAME}</p>
          <h1>Think out loud. Sort the mess. Build the next move.</h1>
          <p className="sidebar-copy">
            Drop in half-baked thoughts, work problems, content ideas, startup
            concepts, or random sparks. {BOT_NAME} helps turn loose thoughts into
            something sharper.
          </p>

          <button
            type="button"
            className="ghost-button sidebar-action"
            onClick={() => {
              setChat([])
              setError('')
            }}
            disabled={loading || chat.length === 0}
          >
            New chat
          </button>
        </div>


      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div className="topbar">
            <div>
              <p className="chat-header-label">Brainstorm Workspace</p>
              <p className="topbar-title">{BOT_NAME}</p>
            </div>
            <div className="topbar-badge">Live local chat</div>
          </div>
        </header>

        <section className="chat-thread">
          {chat.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-copy">
                <p className="chat-header-label">Starter prompts</p>
                <h3>Use the assistant like a real workspace tool.</h3>
                <p>
                  Ask for explanations, drafts, plans, summaries, or debugging help.
                </p>
              </div>

              <div className="suggestion-grid">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="suggestion-card"
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {chat.map((msg, index) => (
                <article
                  key={`${msg.role}-${index}`}
                  className={`message-row ${msg.role === 'user' ? 'user-row' : 'ai-row'}`}
                >
                  <div className="message-meta">{msg.role === 'user' ? 'You' : 'AI'}</div>
                  <div className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                    {renderMessageContent(msg.content)}
                  </div>
                </article>
              ))}

              {loading && (
                <article className="message-row ai-row">
                  <div className="message-meta">AI</div>
                  <div className="message-bubble ai-bubble typing-bubble" aria-live="polite">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        <footer className="composer-wrap">
          {error ? <p className="error-banner">{error}</p> : null}

          <div className="composer">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message the assistant..."
              className="composer-input"
              rows={1}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void sendMessage()
                }
              }}
            />

            <button
              type="button"
              onClick={() => void sendMessage()}
              className="send-button"
              aria-label="Send message"
              disabled={loading || !message.trim()}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="send-icon"
              >
                <path
                  d="M4 12.75L19.2 4.6c.58-.31 1.25.18 1.14.82l-2.18 12.95c-.1.61-.8.85-1.24.43l-4.2-4.02-3.46 3.53c-.46.47-1.26.14-1.26-.52v-5.34L4.6 13.9c-.66-.21-.75-1.11-.14-1.43l.54.28Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <p className="composer-hint">Press Enter to send. Shift+Enter adds a new line.</p>
        </footer>
      </main>
    </div>
  )
}

export default App
