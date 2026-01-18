import { User, Bell, Shield, Trash2, LogOut, Heart } from 'lucide-react'

export function Profile() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-heading text-text">Профиль</h1>
      </header>

      {/* Аватар и имя */}
      <section className="flex items-center gap-4 p-4 bg-white rounded-2xl">
        <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center">
          <User size={32} className="text-text" />
        </div>
        <div>
          <h2 className="font-heading text-lg text-text">Гость</h2>
          <p className="text-sm text-caption">Войти или создать аккаунт</p>
        </div>
      </section>

      {/* Настройки */}
      <section className="bg-white rounded-2xl divide-y divide-gray-100">
        <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors">
          <Bell size={20} className="text-caption" />
          <div className="flex-1">
            <p className="text-text">Напоминания</p>
            <p className="text-sm text-caption">Мягкие напоминания о себе</p>
          </div>
        </button>

        <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors">
          <Shield size={20} className="text-caption" />
          <div className="flex-1">
            <p className="text-text">Приватность</p>
            <p className="text-sm text-caption">Управление данными</p>
          </div>
        </button>

        <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors">
          <Heart size={20} className="text-caption" />
          <div className="flex-1">
            <p className="text-text">О приложении</p>
            <p className="text-sm text-caption">Философия Евы</p>
          </div>
        </button>
      </section>

      {/* Опасные действия */}
      <section className="bg-white rounded-2xl divide-y divide-gray-100">
        <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors">
          <LogOut size={20} className="text-caption" />
          <p className="text-text">Выйти</p>
        </button>

        <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-sos/5 transition-colors">
          <Trash2 size={20} className="text-sos" />
          <div className="flex-1">
            <p className="text-sos">Удалить мой след</p>
            <p className="text-sm text-caption">Удалить все данные безвозвратно</p>
          </div>
        </button>
      </section>

      {/* Дисклеймер */}
      <p className="text-center text-caption text-xs px-4">
        Ева — это AI-приложение для поддержки, не замена профессиональной психологической помощи.
        Если тебе нужна помощь специалиста, пожалуйста, обратись к психологу.
      </p>

      <p className="text-center text-caption text-xs">
        Версия 0.1.0
      </p>
    </div>
  )
}
