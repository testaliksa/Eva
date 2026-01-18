import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react'
import { getPracticeById, type Practice } from '../lib/practices-data'

// Компонент дыхательной практики
function BreathingPractice({ practice }: { practice: Practice }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(practice.steps?.[0]?.duration || 4)
  const [isComplete, setIsComplete] = useState(false)

  const steps = practice.steps || []
  const totalCycles = practice.cycles || 4

  useEffect(() => {
    if (!isActive || isComplete) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Переход к следующему шагу
          const nextStep = currentStep + 1
          if (nextStep >= steps.length) {
            // Конец цикла
            const nextCycle = currentCycle + 1
            if (nextCycle > totalCycles) {
              setIsComplete(true)
              setIsActive(false)
              return 0
            }
            setCurrentCycle(nextCycle)
            setCurrentStep(0)
            return steps[0].duration
          }
          setCurrentStep(nextStep)
          return steps[nextStep].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, currentStep, currentCycle, steps, totalCycles, isComplete])

  const reset = () => {
    setIsActive(false)
    setCurrentStep(0)
    setCurrentCycle(1)
    setSecondsLeft(steps[0]?.duration || 4)
    setIsComplete(false)
  }

  const currentPhase = steps[currentStep]

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Визуализация */}
      <div className="relative flex items-center justify-center">
        <div
          className={`w-48 h-48 rounded-full ${practice.bgColor} flex items-center justify-center transition-transform duration-1000 ${
            isActive && currentPhase?.phase === 'inhale' ? 'scale-110' : ''
          } ${isActive && currentPhase?.phase === 'exhale' ? 'scale-90' : ''}`}
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-text">{secondsLeft}</p>
            <p className="text-lg text-text mt-2">{currentPhase?.text || 'Готова?'}</p>
          </div>
        </div>
      </div>

      {/* Прогресс */}
      <p className="text-caption">
        {isComplete ? 'Отлично! Ты молодец.' : `Цикл ${currentCycle} из ${totalCycles}`}
      </p>

      {/* Управление */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          disabled={isComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
            isActive
              ? 'bg-gray-200 text-text'
              : 'bg-lavender text-text hover:bg-lavender/80'
          }`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? 'Пауза' : 'Начать'}
        </button>
        <button
          onClick={reset}
          className="p-3 bg-gray-100 rounded-full text-caption hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  )
}

// Компонент заземления 5-4-3-2-1
function GroundingPractice({ practice }: { practice: Practice }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const steps = practice.groundingSteps || []

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setIsComplete(false)
  }

  const step = steps[currentStep]

  return (
    <div className="flex flex-col items-center gap-8">
      {isComplete ? (
        <div className="text-center">
          <p className="text-2xl font-heading text-text mb-4">Ты здесь. Ты в безопасности.</p>
          <p className="text-caption mb-8">Ты вернулась в настоящий момент.</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-mint text-text rounded-full font-medium"
          >
            Начать заново
          </button>
        </div>
      ) : (
        <>
          <div className={`w-24 h-24 rounded-full ${practice.bgColor} flex items-center justify-center`}>
            <span className="text-4xl font-bold text-text">{step?.count}</span>
          </div>

          <div className="text-center max-w-xs">
            <p className="text-sm text-caption mb-2">Я {step?.sense}</p>
            <p className="text-xl font-heading text-text">{step?.prompt}</p>
          </div>

          <p className="text-caption text-sm">
            Не торопись. Найди их глазами или в памяти.
          </p>

          <button
            onClick={nextStep}
            className="px-6 py-3 bg-mint text-text rounded-full font-medium hover:bg-mint/80 transition-colors"
          >
            Готово, дальше
          </button>
        </>
      )}
    </div>
  )
}

// Компонент телесной практики
function BodyPractice({ practice }: { practice: Practice }) {
  const [isActive, setIsActive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(practice.timerDuration || 60)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isActive || isComplete) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsComplete(true)
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, isComplete])

  const reset = () => {
    setIsActive(false)
    setSecondsLeft(practice.timerDuration || 60)
    setIsComplete(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Таймер */}
      <div className={`w-32 h-32 rounded-full ${practice.bgColor} flex items-center justify-center`}>
        <span className="text-3xl font-bold text-text">{formatTime(secondsLeft)}</span>
      </div>

      {isComplete ? (
        <div className="text-center">
          <p className="text-xl font-heading text-text mb-2">Отлично!</p>
          <p className="text-caption mb-4">Почувствуй, как изменилось твоё состояние.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 max-w-xs">
          <p className="font-heading text-text mb-3">Как выполнять:</p>
          <ol className="space-y-2">
            {practice.bodySteps?.map((step, i) => (
              <li key={i} className="text-sm text-caption flex gap-2">
                <span className="text-text font-medium">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Управление */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          disabled={isComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
            isActive
              ? 'bg-gray-200 text-text'
              : `${practice.bgColor} text-text hover:opacity-80`
          }`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? 'Пауза' : 'Начать таймер'}
        </button>
        <button
          onClick={reset}
          className="p-3 bg-gray-100 rounded-full text-caption hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  )
}

export function PracticeDetail() {
  const { id } = useParams<{ id: string }>()
  const practice = id ? getPracticeById(id) : null

  if (!practice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-caption">Практика не найдена</p>
        <Link to="/practices" className="text-lavender hover:underline">
          Вернуться к практикам
        </Link>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${practice.bgColor}/20 -mt-6 -mx-4 px-4 pt-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/practices"
          className="p-2 -ml-2 text-caption hover:text-text transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-xl text-text">{practice.title}</h1>
          <p className="text-sm text-caption">{practice.duration}</p>
        </div>
      </div>

      {/* Описание */}
      <p className="text-text mb-8 max-w-sm">{practice.description}</p>

      {/* Практика */}
      <div className="pb-8">
        {practice.type === 'breathing' && <BreathingPractice practice={practice} />}
        {practice.type === 'grounding' && <GroundingPractice practice={practice} />}
        {practice.type === 'body' && <BodyPractice practice={practice} />}
      </div>
    </div>
  )
}
