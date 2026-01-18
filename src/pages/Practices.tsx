import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

interface Practice {
  id: string
  title: string
  description: string
  duration: string
  category: 'quick' | 'breathing' | 'grounding' | 'body'
  emoji: string
  bgColor: string
}

const practices: Practice[] = [
  // Быстрые техники — когда накрыло
  {
    id: 'breathing-478',
    title: 'Дыхание 4-7-8',
    description: 'Успокаивает за 1 минуту',
    duration: '1 мин',
    category: 'quick',
    emoji: '🌬️',
    bgColor: 'bg-lavender/50',
  },
  {
    id: 'breathing-box',
    title: 'Квадратное дыхание',
    description: 'Техника спецназа для стресса',
    duration: '2 мин',
    category: 'quick',
    emoji: '⬜',
    bgColor: 'bg-mint/50',
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1',
    description: 'Вернись в момент "здесь и сейчас"',
    duration: '3 мин',
    category: 'quick',
    emoji: '🌿',
    bgColor: 'bg-mint/50',
  },
  {
    id: 'power-pose',
    title: 'Поза супермена',
    description: 'Прибавь уверенности за 2 минуты',
    duration: '2 мин',
    category: 'quick',
    emoji: '💪',
    bgColor: 'bg-peach/50',
  },
  {
    id: 'shake-it-off',
    title: 'Встряхнись',
    description: 'Сбрось напряжение через тело',
    duration: '1 мин',
    category: 'quick',
    emoji: '🫨',
    bgColor: 'bg-lavender/50',
  },
  // Дыхательные
  {
    id: 'breathing-478',
    title: 'Дыхание 4-7-8',
    description: 'Классика для успокоения',
    duration: '1-2 мин',
    category: 'breathing',
    emoji: '🌬️',
    bgColor: 'bg-lavender/50',
  },
  {
    id: 'breathing-box',
    title: 'Box Breathing',
    description: 'Равномерное дыхание',
    duration: '2-3 мин',
    category: 'breathing',
    emoji: '⬜',
    bgColor: 'bg-mint/50',
  },
  // Заземление
  {
    id: 'grounding-54321',
    title: 'Заземление 5-4-3-2-1',
    description: 'Через органы чувств',
    duration: '3-5 мин',
    category: 'grounding',
    emoji: '🌿',
    bgColor: 'bg-mint/50',
  },
  // Телесные
  {
    id: 'power-pose',
    title: 'Поза силы',
    description: 'Повышает уверенность',
    duration: '2 мин',
    category: 'body',
    emoji: '💪',
    bgColor: 'bg-peach/50',
  },
  {
    id: 'shake-it-off',
    title: 'Встряска',
    description: 'Сбросить напряжение',
    duration: '1 мин',
    category: 'body',
    emoji: '🫨',
    bgColor: 'bg-lavender/50',
  },
]

const categories = [
  { id: 'quick', label: 'Быстро помочь', icon: '⚡' },
  { id: 'breathing', label: 'Дыхание', icon: '🌬️' },
  { id: 'grounding', label: 'Заземление', icon: '🌿' },
  { id: 'body', label: 'Тело', icon: '💪' },
]

export function Practices() {
  const [activeCategory, setActiveCategory] = useState<string>('quick')

  const filteredPractices = practices.filter((p) => p.category === activeCategory)

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
        {filteredPractices.map((practice, index) => (
          <Link
            key={`${practice.id}-${index}`}
            to={`/practice/${practice.id}`}
            className={`p-4 rounded-2xl ${practice.bgColor} hover:shadow-md transition-all animate-spring-in`}
            style={{ animationDelay: `${index * 0.05}s` }}
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
