import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Chat } from './pages/Chat'
import { SOS } from './pages/SOS'
import { Practices } from './pages/Practices'
import { PracticeDetail } from './pages/PracticeDetail'
import { EveningJournal } from './pages/EveningJournal'
import { Calendar } from './pages/Calendar'
import { Profile } from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Страницы с навигацией */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/practices" element={<Practices />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Полноэкранные страницы */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/practice/:id" element={<PracticeDetail />} />
        <Route path="/evening-journal" element={<EveningJournal />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
