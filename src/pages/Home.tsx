import { useState, useEffect } from 'react'
import { MessageCircle, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTimeBasedGreeting } from '../lib/utils'

export function Home() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Мягкий fade-in для приветствия
    const timer = setTimeout(() => {
      setGreeting(getTimeBasedGreeting())
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-8">
      {/* Приветствие */}
      <section className="text-center pt-8">
        <h1
          className={`text-3xl font-heading text-text transition-opacity duration-500 ${
            greeting ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {greeting}
        </h1>
        <p className="text-caption mt-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Ева — твоё безопасное пространство
        </p>
      </section>

      {/* Быстрые действия */}
      <section className="flex flex-col gap-4 mt-4">
        <Link
          to="/chat"
          className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow animate-spring-in"
        >
          <div className="w-12 h-12 bg-lavender rounded-full flex items-center justify-center">
            <MessageCircle size={24} className="text-text" />
          </div>
          <div>
            <h2 className="font-heading text-lg text-text">Поговорить с Евой</h2>
            <p className="text-caption text-sm">Я слушаю, без осуждения</p>
          </div>
        </Link>

        <Link
          to="/practices"
          className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow animate-spring-in"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
          <div>
            <h2 className="font-heading text-lg text-text">Практики</h2>
            <p className="text-caption text-sm">Дыхание, медитации, заземление</p>
          </div>
        </Link>

        <Link
          to="/calendar"
          className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow animate-spring-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="w-12 h-12 bg-peach rounded-full flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <div>
            <h2 className="font-heading text-lg text-text">Календарь ощущений</h2>
            <p className="text-caption text-sm">Отметить своё состояние</p>
          </div>
        </Link>

        {/* Вечерний дневник — показываем вечером */}
        {new Date().getHours() >= 18 && (
          <Link
            to="/evening-journal"
            className="flex items-center gap-4 p-5 bg-gradient-to-r from-lavender/30 to-lavender/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow animate-spring-in border border-lavender/20"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="w-12 h-12 bg-lavender rounded-full flex items-center justify-center">
              <Moon size={24} className="text-text" />
            </div>
            <div>
              <h2 className="font-heading text-lg text-text">Вечерний дневник</h2>
              <p className="text-caption text-sm">Подготовиться к завтрашнему дню</p>
            </div>
          </Link>
        )}
      </section>

      {/* Мягкое напоминание */}
      <section className="text-center mt-8 px-4">
        <p className="text-caption text-sm italic">
          «Ты достойна любви и заботы — прямо сейчас.»
        </p>
      </section>
    </div>
  )
}
