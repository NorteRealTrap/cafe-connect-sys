'use client'

import { useEstablishment } from '@/contexts/EstablishmentContext'

export default function DashboardPage() {
  const { currentEstablishment } = useEstablishment()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">
          Estabelecimento ativo: <span className="font-semibold">{currentEstablishment?.name}</span>
        </p>
      </div>
    </div>
  )
}
