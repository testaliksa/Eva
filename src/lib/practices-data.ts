// Единый источник данных для всех практик

export interface BreathingStep {
  phase: string
  duration: number
  text: string
}

export interface GroundingStep {
  count: number
  sense: string
  prompt: string
}

export interface Practice {
  id: string
  title: string
  description: string
  duration: string
  type: 'breathing' | 'grounding' | 'body'
  category: 'quick' | 'breathing' | 'grounding' | 'body'
  emoji: string
  bgColor: string
  steps?: BreathingStep[]
  cycles?: number
  groundingSteps?: GroundingStep[]
  bodySteps?: string[]
  timerDuration?: number
}

// Все практики в одном месте
export const practices: Practice[] = [
  {
    id: 'breathing-478',
    title: 'Дыхание 4-7-8',
    description: 'Успокаивающая техника, которая замедляет сердцебиение и снижает тревогу за 1 минуту.',
    duration: '1 мин',
    type: 'breathing',
    category: 'quick',
    emoji: '🌬️',
    bgColor: 'bg-lavender',
    steps: [
      { phase: 'inhale', duration: 4, text: 'Вдох через нос' },
      { phase: 'hold', duration: 7, text: 'Задержи дыхание' },
      { phase: 'exhale', duration: 8, text: 'Медленный выдох через рот' },
    ],
    cycles: 4,
  },
  {
    id: 'breathing-box',
    title: 'Квадратное дыхание',
    description: 'Техника Navy SEALs для быстрого успокоения в стрессе.',
    duration: '2 мин',
    type: 'breathing',
    category: 'quick',
    emoji: '⬜',
    bgColor: 'bg-mint',
    steps: [
      { phase: 'inhale', duration: 4, text: 'Вдох' },
      { phase: 'hold', duration: 4, text: 'Задержка' },
      { phase: 'exhale', duration: 4, text: 'Выдох' },
      { phase: 'hold', duration: 4, text: 'Задержка' },
    ],
    cycles: 4,
  },
  {
    id: 'grounding-54321',
    title: 'Заземление 5-4-3-2-1',
    description: 'Техника, которая возвращает тебя в настоящий момент через органы чувств.',
    duration: '3 мин',
    type: 'grounding',
    category: 'quick',
    emoji: '🌿',
    bgColor: 'bg-mint',
    groundingSteps: [
      { count: 5, sense: 'вижу', prompt: 'Назови 5 вещей, которые ты ВИДИШЬ вокруг себя' },
      { count: 4, sense: 'касаюсь', prompt: 'Назови 4 вещи, которых ты можешь КОСНУТЬСЯ' },
      { count: 3, sense: 'слышу', prompt: 'Назови 3 звука, которые ты СЛЫШИШЬ' },
      { count: 2, sense: 'чувствую запах', prompt: 'Назови 2 запаха, которые ты ЧУВСТВУЕШЬ' },
      { count: 1, sense: 'вкус', prompt: 'Назови 1 вкус, который ты ощущаешь' },
    ],
  },
  {
    id: 'power-pose',
    title: 'Поза супермена',
    description: '2 минуты в позе силы повышают уверенность и снижают кортизол.',
    duration: '2 мин',
    type: 'body',
    category: 'quick',
    emoji: '💪',
    bgColor: 'bg-peach',
    bodySteps: [
      'Встань прямо, ноги на ширине плеч',
      'Руки на бёдра, локти в стороны',
      'Подбородок слегка приподнят',
      'Грудь расправлена, плечи назад',
      'Дыши глубоко и ровно',
      'Почувствуй себя сильной',
    ],
    timerDuration: 120,
  },
  {
    id: 'shake-it-off',
    title: 'Встряхнись',
    description: 'Сбрось напряжение через тело. Животные так делают после стресса.',
    duration: '1 мин',
    type: 'body',
    category: 'quick',
    emoji: '🫨',
    bgColor: 'bg-lavender',
    bodySteps: [
      'Встань и начни слегка трясти кистями рук',
      'Добавь тряску в руки и плечи',
      'Потряси ногами, как будто стряхиваешь воду',
      'Потряси всем телом — пусть оно расслабится',
      'Продолжай 30-60 секунд',
      'Остановись и почувствуй тело',
    ],
    timerDuration: 60,
  },
]

// Получить практику по ID
export const getPracticeById = (id: string): Practice | undefined => {
  return practices.find(p => p.id === id)
}

// Получить практики по категории
export const getPracticesByCategory = (category: string): Practice[] => {
  return practices.filter(p => p.category === category)
}

// Категории для фильтрации
export const categories = [
  { id: 'quick', label: 'Быстро помочь', icon: '⚡' },
  { id: 'breathing', label: 'Дыхание', icon: '🌬️' },
  { id: 'grounding', label: 'Заземление', icon: '🌿' },
  { id: 'body', label: 'Тело', icon: '💪' },
]
