'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface Establishment {
  id: string
  name: string
  type: string
  email: string
  phone?: string
}

interface EstablishmentContextType {
  currentEstablishment: Establishment | null
  establishments: Establishment[]
  setCurrentEstablishment: (establishment: Establishment) => void
  isLoading: boolean
}

const EstablishmentContext = createContext<EstablishmentContextType | undefined>(undefined)

export function EstablishmentProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [currentEstablishment, setCurrentEstablishmentState] = useState<Establishment | null>(null)
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user?.establishments && Array.isArray(session.user.establishments)) {
      setEstablishments(session.user.establishments)
      
      try {
        const savedId = localStorage.getItem('currentEstablishmentId')
        if (savedId) {
          const saved = session.user.establishments.find((e: Establishment) => e.id === savedId)
          if (saved) {
            setCurrentEstablishmentState(saved)
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
      
      if (session.user.establishments.length > 0) {
        setCurrentEstablishmentState(session.user.establishments[0])
        try {
          localStorage.setItem('currentEstablishmentId', session.user.establishments[0].id)
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }
      
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [session, status])

  const setCurrentEstablishment = (establishment: Establishment) => {
    setCurrentEstablishmentState(establishment)
    try {
      localStorage.setItem('currentEstablishmentId', establishment.id)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('establishmentChanged', { detail: establishment }))
      }
    } catch (error) {
      console.error('Error in setCurrentEstablishment:', error)
    }
  }

  return (
    <EstablishmentContext.Provider value={{ currentEstablishment, establishments, setCurrentEstablishment, isLoading }}>
      {children}
    </EstablishmentContext.Provider>
  )
}

export function useEstablishment() {
  const context = useContext(EstablishmentContext)
  if (context === undefined) {
    throw new Error('useEstablishment must be used within EstablishmentProvider')
  }
  return context
}
