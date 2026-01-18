// Общие утилиты приложения

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return 'Не спится? Я рядом.'
  if (hour < 12) return 'Доброе утро. Как начался твой день?'
  if (hour < 18) return 'Добрый день. Как ты?'
  return 'Добрый вечер. Как прошёл день?'
}

// Более детальное приветствие для чата
export function getChatGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return 'Не спится? Я рядом. Что у тебя на душе?'
  if (hour < 12) return 'Доброе утро. Как ты сегодня?'
  if (hour < 18) return 'Привет. Как проходит твой день?'
  return 'Добрый вечер. Как ты?'
}
