import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getChatGreeting } from '../lib/utils'

interface Message {
  id: string
  role: 'user' | 'eva'
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Приветствие Евы
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'eva',
        content: getChatGreeting(),
      },
    ])
  }, [])

  // Автопрокрутка
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Отправляем только последние 10 сообщений для контекста
      const contextMessages = updatedMessages.slice(-10)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: contextMessages }),
      })

      if (!response.ok) {
        throw new Error('Ошибка сервера')
      }

      const data = await response.json()

      const evaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'eva',
        content: data.response,
      }

      setMessages((prev) => [...prev, evaMessage])
    } catch (err) {
      console.error('Chat error:', err)
      setError('Не удалось отправить сообщение. Проверь, запущен ли сервер.')

      // Fallback ответ, если сервер недоступен
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'eva',
        content: 'Прости, что-то пошло не так... Попробуй ещё раз через минуту.',
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-cream -mt-6 -mx-4">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-4 bg-white border-b border-gray-100">
        <Link to="/" className="p-2 -ml-2 text-caption hover:text-text transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-lg text-text">Ева</h1>
          <p className="text-xs text-caption">Я слушаю тебя</p>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-peach/50 text-text text-sm text-center">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl animate-fade-in ${
                msg.role === 'user'
                  ? 'bg-lavender text-text rounded-br-md'
                  : 'bg-white text-text rounded-bl-md shadow-sm'
              }`}
            >
              <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-caption/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-caption/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-caption/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-white border-t border-gray-100 safe-area-bottom">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напиши, что чувствуешь..."
            rows={1}
            className="flex-1 px-4 py-3 bg-cream rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-lavender text-text placeholder-caption"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-lavender rounded-full text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lavender/80 transition-colors"
            aria-label="Отправить"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
