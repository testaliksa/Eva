import { Outlet } from 'react-router-dom'
import { TabBar } from './TabBar'

export function Layout() {
  return (
    <div className="min-h-screen bg-cream">
      <main className="pb-24 px-4 pt-6 max-w-md mx-auto">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
