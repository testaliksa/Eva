import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Moon, ChevronRight, Check, Sparkles, Loader2 } from 'lucide-react'
import { supabase, type JournalEntry as JournalEntryType } from '../lib/supabase'

interface JournalEntry {
  question1: string // Чего ты хочешь от завтра?
  question2: string // Как ты это сделаешь?
  question3: string // Что может пойти не так?
  question4: string // Как ты можешь это предусмотреть?
}

const questions = [
  {
    id: 'question1',
    emoji: '🌟',
    title: 'Чего ты хочешь от завтрашнего дня?',
    subtitle: 'Одно главное желание или цель',
    placeholder: 'Например: хочу закончить важный проект / хочу провести спокойный день...',
  },
  {
    id: 'question2',
    emoji: '🎯',
    title: 'Как ты это сделаешь?',
    subtitle: 'Конкретный первый шаг',
    placeholder: 'Например: начну с самой сложной задачи утром / отключу уведомления...',
  },
  {
    id: 'question3',
    emoji: '⚡',
    title: 'Что может пойти не так?',
    subtitle: 'Подумай о возможных препятствиях',
    placeholder: 'Например: могу отвлечься на соцсети / коллега может попросить о помощи...',
  },
  {
    id: 'question4',
    emoji: '🛡️',
    title: 'Как ты можешь это предусмотреть?',
    subtitle: 'Твой план на случай препятствий',
    placeholder: 'Например: поставлю телефон в авиарежим / вежливо скажу, что занята до обеда...',
  },
]

export function EveningJournal() {
  const [currentStep, setCurrentStep] = useState(0)
  const [entries, setEntries] = useState<JournalEntry>({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
  })
  const [isComplete, setIsComplete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const currentQuestion = questions[currentStep]

  // Загрузка существующей записи при открытии
  useEffect(() => {
    loadExistingEntry()
  }, [])

  const loadExistingEntry = async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('date', today)
        .single()

      if (data && !error) {
        setEntries({
          question1: data.question1 || '',
          question2: data.question2 || '',
          question3: data.question3 || '',
          question4: data.question4 || '',
        })
        // Если все поля заполнены, показать завершённый экран
        if (data.question1 && data.question2 && data.question3 && data.question4) {
          setIsComplete(true)
        }
      }
    } catch (err) {
      console.error('Error loading journal:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveToSupabase = async () => {
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]

      // Проверяем, есть ли запись на сегодня
      const { data: existing } = await supabase
        .from('journal_entries')
        .select('id')
        .eq('date', today)
        .single()

      const entry: JournalEntryType = {
        date: today,
        question1: entries.question1,
        question2: entries.question2,
        question3: entries.question3,
        question4: entries.question4,
      }

      if (existing) {
        const { error } = await supabase
          .from('journal_entries')
          .update(entry)
          .eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .insert([entry])
        if (error) throw error
      }

      setIsComplete(true)
    } catch (err) {
      console.error('Error saving journal:', err)
      alert('Не удалось сохранить. Попробуй ещё раз.')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      saveToSupabase()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChange = (value: string) => {
    setEntries({
      ...entries,
      [currentQuestion.id]: value,
    })
  }

  const currentValue = entries[currentQuestion.id as keyof JournalEntry]

  // Показываем loading пока данные грузятся
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender/30 to-cream flex flex-col items-center justify-center">
        <Loader2 size={32} className="animate-spin text-lavender" />
        <p className="text-caption mt-4">Загружаю...</p>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender/30 to-cream flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-lavender rounded-full flex items-center justify-center mb-6 animate-spring-in">
            <Sparkles size={40} className="text-text" />
          </div>

          <h1 className="text-2xl font-heading text-text mb-3">
            Готово!
          </h1>

          <p className="text-caption mb-8 max-w-xs">
            Ты подготовилась к завтрашнему дню. Теперь можно расслабиться и отдохнуть.
          </p>

          {/* Краткое резюме */}
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm mb-8 text-left">
            <p className="text-sm text-caption mb-2">Твой план на завтра:</p>
            <p className="text-text font-medium mb-4">{entries.question1}</p>

            <p className="text-sm text-caption mb-2">Первый шаг:</p>
            <p className="text-text">{entries.question2}</p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Link
              to="/"
              className="w-full py-4 bg-lavender text-text rounded-full font-medium text-center hover:bg-lavender/80 transition-colors"
            >
              На главную
            </Link>
            <Link
              to="/practices"
              className="w-full py-4 bg-white text-text rounded-full font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Расслабляющая практика перед сном
            </Link>
            <button
              onClick={() => {
                setIsComplete(false)
                setCurrentStep(0)
              }}
              className="w-full py-4 text-caption text-sm hover:text-text transition-colors"
            >
              Изменить ответы
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender/30 to-cream flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4">
        {currentStep === 0 ? (
          <Link
            to="/"
            className="p-2 -ml-2 text-caption hover:text-text transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
        ) : (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-caption hover:text-text transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="flex items-center gap-2">
          <Moon size={20} className="text-lavender" />
          <span className="font-heading text-text">Вечерний дневник</span>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 mb-6">
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-lavender' : 'bg-white'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-caption mt-2">
          Вопрос {currentStep + 1} из {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 flex flex-col">
        <div className="mb-6 animate-fade-in" key={currentStep}>
          <span className="text-4xl mb-4 block">{currentQuestion.emoji}</span>
          <h1 className="text-xl font-heading text-text mb-2">
            {currentQuestion.title}
          </h1>
          <p className="text-caption text-sm">
            {currentQuestion.subtitle}
          </p>
        </div>

        <textarea
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={currentQuestion.placeholder}
          className="flex-1 min-h-[150px] p-4 bg-white rounded-2xl text-text placeholder:text-caption/50 resize-none focus:outline-none focus:ring-2 focus:ring-lavender/50 transition-all"
          autoFocus
        />
      </div>

      {/* Action */}
      <div className="p-4 pb-8">
        <button
          onClick={handleNext}
          disabled={!currentValue.trim() || saving}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-medium transition-all ${
            currentValue.trim() && !saving
              ? 'bg-lavender text-text hover:bg-lavender/80'
              : 'bg-gray-200 text-caption cursor-not-allowed'
          }`}
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Сохраняю...
            </>
          ) : currentStep < questions.length - 1 ? (
            <>
              Дальше
              <ChevronRight size={20} />
            </>
          ) : (
            <>
              Готово
              <Check size={20} />
            </>
          )}
        </button>

        {currentStep === 0 && (
          <p className="text-center text-caption text-xs mt-4">
            Это займёт всего 2-3 минуты
          </p>
        )}
      </div>
    </div>
  )
}
