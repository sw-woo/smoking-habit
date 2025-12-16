import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore } from './stores/userStore'

// Pages
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Health from './pages/Health'
import Achievements from './pages/Achievements'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Craving from './pages/Craving'

// Layout
import Layout from './components/Layout'

function App() {
  const { userData, loadUserData } = useUserStore()

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  // 온보딩 완료 여부 확인
  const isOnboarded = userData !== null

  return (
    <Routes>
      {/* 온보딩 */}
      <Route
        path="/"
        element={isOnboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />}
      />

      {/* 메인 레이아웃 (하단 탭바 포함) */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health" element={<Health />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 충동 대처 (풀스크린 모달) */}
      <Route path="/craving" element={<Craving />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
