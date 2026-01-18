import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sun, Moon, Check, Loader2, AlertCircle } from 'lucide-react'
import { supabase, type MoodEntry } from '../lib/supabase'

const moods = [
  { emoji: '😌', label: 'Спокойно', color: 'bg-mint' },
  { emoji: '😊', label: 'Хорошо', color: 'bg-lavender' },
  { emoji: '😐', label: 'Нейтрально', color: 'bg-gray-200' },
  { emoji: '😔', label: 'Грустно', color: 'bg-peach' },
  { emoji: '😰', label: 'Тревожно', color: 'bg-sos/20' },
]

const energyLevels = [
  { value: 1, label: 'Нет сил' },
  { value: 2, label: 'Мало' },
  { value: 3, label: 'Нормально' },
  { value: 4, label: 'Хорошо' },
  { value: 5, label: 'Много' },
]

// Время суток определяет тип записи
function getTimeOfDay(): 'morning' | 'evening' {
  const hour = new Date().getHours()
  return hour < 15 ? 'morning' : 'evening'
}

export function Calendar() {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>(getTimeOfDay())
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [anxiety, setAnxiety] = useState<number | null>(null)
  const [sleep, setSleep] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const today = new Date()
  const isToday = selectedDate.toDateString() === today.toDateString()
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  // Утренние и вечерние вопросы разные
  const morningQuestions = {
    title: 'Утренний чек-ин',
    subtitle: 'Как ты проснулась?',
    moodQuestion: 'Как настроение с утра?',
    energyQuestion: 'Сколько сил?',
    sleepQuestion: 'Как спалось?',
    notePrompt: 'Что хочется отметить о начале дня...',
  }

  const eveningQuestions = {
    title: 'Вечерний чек-ин',
    subtitle: 'Как прошёл день?',
    moodQuestion: 'Какое настроение сейчас?',
    energyQuestion: 'Сколько энергии осталось?',
    anxietyQuestion: 'Уровень тревоги за день',
    notePrompt: 'Что было сегодня важного...',
  }

  const questions = timeOfDay === 'morning' ? morningQuestions : eveningQuestions

  // Загрузка существующей записи при открытии
  useEffect(() => {
    loadExistingEntry()
  }, [timeOfDay, selectedDate])

  const loadExistingEntry = async () => {
    setLoadingData(true)
    setError(null)
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const { data, error: fetchError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('date', dateStr)
        .eq('time_of_day', timeOfDay)
        .single()

      if (data && !fetchError) {
        setSelectedMood(data.mood)
        setEnergy(data.energy)
        setAnxiety(data.anxiety)
        setSleep(data.sleep)
        setNote(data.note || '')
      } else {
        // Сбросить форму если записи нет
        setSelectedMood(null)
        setEnergy(null)
        setAnxiety(null)
        setSleep(null)
        setNote('')
      }
    } catch (err) {
      console.error('Error loading entry:', err)
      setError('Не удалось загрузить данные. Проверь интернет.')
    } finally {
      setLoadingData(false)
    }
  }

  // Навигация по датам
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    // Не позволяем выбрать будущую дату
    if (newDate <= today) {
      setSelectedDate(newDate)
    }
  }

  const handleSave = async () => {
    if (!selectedMood) return

    setLoading(true)
    setError(null)
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]

      // Проверяем, есть ли уже запись на эту дату
      const { data: existing } = await supabase
        .from('mood_entries')
        .select('id')
        .eq('date', dateStr)
        .eq('time_of_day', timeOfDay)
        .single()

      const entry: MoodEntry = {
        date: dateStr,
        time_of_day: timeOfDay,
        mood: selectedMood,
        energy,
        anxiety: timeOfDay === 'evening' ? anxiety : null,
        sleep: timeOfDay === 'morning' ? sleep : null,
        note: note || null,
      }

      if (existing) {
        // Обновляем существующую запись
        const { error } = await supabase
          .from('mood_entries')
          .update(entry)
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Создаём новую запись
        const { error } = await supabase
          .from('mood_entries')
          .insert([entry])

        if (error) throw error
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Error saving entry:', err)
      alert('Не удалось сохранить. Попробуй ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  // Показываем loading пока данные грузятся
  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 size={32} className="animate-spin text-lavender" />
        <p className="text-caption">Загружаю...</p>
      </div>
    )
  }

  // Показываем ошибку если не удалось загрузить
  if (error && !selectedMood) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
        <AlertCircle size={32} className="text-sos" />
        <p className="text-text text-center">{error}</p>
        <button
          onClick={loadExistingEntry}
          className="px-6 py-3 bg-lavender text-text rounded-full font-medium"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-heading text-text">{questions.title}</h1>
        <p className="text-caption mt-1">{questions.subtitle}</p>
      </header>

      {/* Переключатель утро/вечер */}
      <div className="flex bg-white rounded-2xl p-1">
        <button
          onClick={() => setTimeOfDay('morning')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            timeOfDay === 'morning'
              ? 'bg-peach/50 text-text'
              : 'text-caption hover:text-text'
          }`}
        >
          <Sun size={18} />
          <span className="font-medium">Утро</span>
        </button>
        <button
          onClick={() => setTimeOfDay('evening')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            timeOfDay === 'evening'
              ? 'bg-lavender/50 text-text'
              : 'text-caption hover:text-text'
          }`}
        >
          <Moon size={18} />
          <span className="font-medium">Вечер</span>
        </button>
      </div>

      {/* Текущая дата */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4">
        <button
          onClick={goToPreviousDay}
          className="p-2 text-caption hover:text-text transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="font-heading text-lg text-text">
            {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
          </p>
          <p className="text-sm text-caption">
            {isToday ? 'Сегодня' : dayNames[selectedDate.getDay()]}
          </p>
        </div>
        <button
          onClick={goToNextDay}
          disabled={isToday}
          className={`p-2 transition-colors ${
            isToday
              ? 'text-gray-200 cursor-not-allowed'
              : 'text-caption hover:text-text'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Выбор настроения */}
      <section>
        <h2 className="font-heading text-lg text-text mb-3">{questions.moodQuestion}</h2>
        <div className="flex justify-between gap-2">
          {moods.map((mood) => (
            <button
              key={mood.emoji}
              onClick={() => setSelectedMood(mood.emoji)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                selectedMood === mood.emoji
                  ? `${mood.color} scale-110`
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs text-caption">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Уровень энергии */}
      <section>
        <h2 className="font-heading text-lg text-text mb-3">{questions.energyQuestion}</h2>
        <div className="flex justify-between gap-2">
          {energyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setEnergy(level.value)}
              className={`flex-1 py-3 rounded-xl text-sm transition-all ${
                energy === level.value
                  ? 'bg-lavender text-text'
                  : 'bg-white text-caption hover:bg-gray-50'
              }`}
            >
              {level.value}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-caption">Нет сил</span>
          <span className="text-xs text-caption">Много</span>
        </div>
      </section>

      {/* Утром — качество сна, вечером — тревога */}
      {timeOfDay === 'morning' ? (
        <section>
          <h2 className="font-heading text-lg text-text mb-3">Как спалось?</h2>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setSleep(level)}
                className={`flex-1 py-3 rounded-xl text-sm transition-all ${
                  sleep === level
                    ? 'bg-mint text-text'
                    : 'bg-white text-caption hover:bg-gray-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-caption">Плохо</span>
            <span className="text-xs text-caption">Отлично</span>
          </div>
        </section>
      ) : (
        <section>
          <h2 className="font-heading text-lg text-text mb-3">Уровень тревоги сегодня</h2>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setAnxiety(level)}
                className={`flex-1 py-3 rounded-xl text-sm transition-all ${
                  anxiety === level
                    ? level >= 4 ? 'bg-sos/30 text-text' : 'bg-peach text-text'
                    : 'bg-white text-caption hover:bg-gray-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-caption">Спокойно</span>
            <span className="text-xs text-caption">Сильная</span>
          </div>
        </section>
      )}

      {/* Заметка */}
      <section>
        <h2 className="font-heading text-lg text-text mb-3">Заметка</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={questions.notePrompt}
          rows={3}
          className="w-full px-4 py-3 bg-white rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-lavender text-text placeholder-caption"
        />
      </section>

      {/* Кнопка сохранения */}
      <button
        onClick={handleSave}
        disabled={!selectedMood || loading}
        className={`w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 ${
          saved
            ? 'bg-mint text-text'
            : selectedMood && !loading
            ? 'bg-lavender text-text hover:bg-lavender/80'
            : 'bg-gray-200 text-caption cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Сохраняю...
          </>
        ) : saved ? (
          <>
            <Check size={20} />
            Сохранено
          </>
        ) : (
          'Сохранить'
        )}
      </button>

      {/* Подсказка */}
      <p className="text-center text-caption text-sm">
        {timeOfDay === 'morning'
          ? 'Начни день с осознанности — это помогает.'
          : 'Завершай день с благодарностью к себе.'}
      </p>
    </div>
  )
}
