import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { categories, getPracticesByCategory } from '../lib/practices-data'

export function Practices() {
  const [activeCategory, setActiveCategory] = useState<string>('quick')

  const filteredPractices = getPracticesByCategory(activeCategory)

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-heading text-text">Практики</h1>
        <p className="text-caption mt-1">Быстрые техники, когда тебе нужна помощь</p>
      </header>

      {/* Быстрый доступ — SOS */}
      <Link
        to="/sos"
        className="flex items-center gap-4 p-4 bg-sos/10 border border-sos/20 rounded-2xl hover:bg-sos/20 transition-colors"
      >
        <div className="w-12 h-12 bg-sos/20 rounded-full flex items-center justify-center">
          <Zap size={24} className="text-sos" />
        </div>
        <div>
          <h2 className="font-heading text-text">Мне плохо прямо сейчас</h2>
          <p className="text-sm text-caption">Дыхание + поддержка</p>
        </div>
      </Link>

      {/* Категории */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-lavender text-text'
                : 'bg-white text-caption hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Карточки практик */}
      <div className="grid gap-3">
        {filteredPractices.map((practice) => (
          <Link
            key={practice.id}
            to={`/practice/${practice.id}`}
            className={`p-4 rounded-2xl ${practice.bgColor}/50 hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{practice.emoji}</span>
              <div className="flex-1">
                <h3 className="font-heading text-text">{practice.title}</h3>
                <p className="text-sm text-caption">{practice.description}</p>
              </div>
              <span className="text-xs text-caption bg-white/50 px-2 py-1 rounded-full">
                {practice.duration}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Подсказка */}
      {activeCategory === 'quick' && (
        <p className="text-center text-caption text-sm mt-2">
          Эти техники работают за 1-3 минуты. Попробуй любую.
        </p>
      )}
    </div>
  )
}
