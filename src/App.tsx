import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { useApp } from '@/context/AppContext'
import Hoje from '@/pages/Hoje'
import Discovery from '@/pages/Discovery'
import Metas from '@/pages/Metas'
import MetaDetalhe from '@/pages/MetaDetalhe'
import NovaMeta from '@/pages/NovaMeta'
import Evolucao from '@/pages/Evolucao'
import CoachHistorico from '@/pages/CoachHistorico'
import Perfil from '@/pages/Perfil'
import Notificacoes from '@/pages/Notificacoes'
import RevisaoSemanal from '@/pages/RevisaoSemanal'
import { useReminders } from '@/lib/useReminders'

export default function App() {
  const { state } = useApp()
  const location = useLocation()
  useReminders(state)

  if (!state.onboarded && location.pathname !== '/discovery') {
    return <Navigate to="/discovery" replace />
  }

  return (
    <div className="min-h-full">
      {state.onboarded && <Nav />}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/" element={<Hoje />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/metas/nova" element={<NovaMeta />} />
          <Route path="/metas/:goalId" element={<MetaDetalhe />} />
          <Route path="/metas/:goalId/revisao" element={<RevisaoSemanal />} />
          <Route path="/evolucao" element={<Evolucao />} />
          <Route path="/coach" element={<CoachHistorico />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/notificacoes" element={<Notificacoes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
