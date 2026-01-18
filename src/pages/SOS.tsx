import { useState, useEffect } from 'react'
import { ArrowLeft, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

type Phase = 'inhale' | 'hold' | 'exhale'

const anchors = [
  'Ты в безопасности прямо сейчас.',
  'Это пройдёт. Ты справляешься.',
  'Дыши со мной. Медленно.',
  'Ты не одна. Я рядом.',
  'Твои чувства важны и реальны.',
]

export function SOS() {
  const [phase, setPhase] = useState<Phase>('inhale')
  const [anchor, setAnchor] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  // Дыхательный цикл: 4-4-6 секунд
  useEffect(() => {
    const timings = { inhale: 4000, hold: 4000, exhale: 6000 }
    const next: Record<Phase, Phase> = { inhale: 'hold', hold: 'exhale', exhale: 'inhale' }

    const timer = setTimeout(() => {
      setPhase(next[phase])
    }, timings[phase])

    return () => clearTimeout(timer)
  }, [phase])

  // Случайная якорная фраза
  useEffect(() => {
    setAnchor(anchors[Math.floor(Math.random() * anchors.length)])
  }, [])

  const phaseText = {
    inhale: 'Вдох...',
    hold: 'Задержи...',
    exhale: 'Выдох...',
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 -mt-6 -mx-4">
      {/* Кнопка назад */}
      <Link
        to="/"
        className="absolute top-6 left-4 p-2 text-caption hover:text-text transition-colors"
        aria-label="Вернуться на главную"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Дыхательная анимация */}
      <div className="relative flex items-center justify-center mb-12">
        <div
          className={`w-48 h-48 rounded-full bg-lavender/60 animate-breathe flex items-center justify-center`}
        >
          <div className="w-32 h-32 rounded-full bg-lavender/80 flex items-center justify-center">
            <span className="text-2xl font-heading text-text">{phaseText[phase]}</span>
          </div>
        </div>
      </div>

      {/* Якорная фраза */}
      <p className="text-xl text-center font-heading text-text mb-8 animate-fade-in max-w-xs">
        {anchor}
      </p>

      {/* Подсказка про помощь */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="text-caption text-sm underline hover:text-text transition-colors"
      >
        Нужна дополнительная помощь?
      </button>

      {showHelp && (
        <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm animate-fade-in max-w-xs">
          <p className="text-sm text-text mb-4">
            Если тебе очень плохо, пожалуйста, обратись за помощью:
          </p>
          <a
            href="tel:88002000122"
            className="flex items-center gap-3 p-3 bg-mint/50 rounded-xl text-text hover:bg-mint transition-colors"
          >
            <Phone size={20} />
            <div>
              <p className="font-medium">Телефон доверия</p>
              <p className="text-sm text-caption">8-800-2000-122 (бесплатно)</p>
            </div>
          </a>
          <p className="text-xs text-caption mt-4 text-center">
            Ева — это приложение, не замена профессиональной помощи.
          </p>
        </div>
      )}

      {/* Переход в чат */}
      <Link
        to="/chat"
        className="mt-8 px-6 py-3 bg-peach text-text rounded-full font-medium hover:bg-peach/80 transition-colors"
      >
        Поговорить с Евой
      </Link>
    </div>
  )
}
