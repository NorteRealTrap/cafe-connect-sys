'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface Establishment {
  id: string
  name: string
  type: string
  email: string
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

    if (session?.user?.establishments) {
      const userEstablishments = session.user.establishments
      setEstablishments(userEstablishments)
      
      const savedEstablishmentId = localStorage.getItem('currentEstablishmentId')
      
      if (savedEstablishmentId) {
        const savedEstablishment = userEstablishments.find(
          e => e.id === savedEstablishmentId
        )
        if (savedEstablishment) {
          setCurrentEstablishmentState(savedEstablishment)
        } else {
          setCurrentEstablishmentState(userEstablishments[0])
        }
      } else {
        setCurrentEstablishmentState(userEstablishments[0])
      }
      
      setIsLoading(false)
    }
  }, [session, status])

  const setCurrentEstablishment = (establishment: Establishment) => {
    setCurrentEstablishmentState(establishment)
    localStorage.setItem('currentEstablishmentId', establishment.id)
    
    window.dispatchEvent(new CustomEvent('establishmentChanged', { 
      detail: establishment 
    }))
  }

  return (
    <EstablishmentContext.Provider
      value={{
        currentEstablishment,
        establishments,
        setCurrentEstablishment,
        isLoading
      }}
    >
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
