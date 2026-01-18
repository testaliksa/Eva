import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sun, Moon, Check } from 'lucide-react'

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

  const today = new Date()
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

  const handleSave = () => {
    if (selectedMood) {
      // TODO: Сохранить в Supabase
      const entry = {
        date: today.toISOString().split('T')[0],
        timeOfDay,
        mood: selectedMood,
        energy,
        anxiety: timeOfDay === 'evening' ? anxiety : null,
        sleep: timeOfDay === 'morning' ? sleep : null,
        note,
      }
      console.log('Saving entry:', entry)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
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
        <button className="p-2 text-caption hover:text-text transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="font-heading text-lg text-text">
            {today.getDate()} {monthNames[today.getMonth()]}
          </p>
          <p className="text-sm text-caption">{dayNames[today.getDay()]}</p>
        </div>
        <button className="p-2 text-caption hover:text-text transition-colors">
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
        disabled={!selectedMood}
        className={`w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 ${
          saved
            ? 'bg-mint text-text'
            : selectedMood
            ? 'bg-lavender text-text hover:bg-lavender/80'
            : 'bg-gray-200 text-caption cursor-not-allowed'
        }`}
      >
        {saved ? (
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
