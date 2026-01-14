import React, { createContext, useContext, useState, useEffect } from 'react'
import { getNextSunday } from '../services/dateUtils'

const SelectedSundayContext = createContext(null)

export function SelectedSundayProvider({ children, sundays }) {
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (sundays.length > 0 && !selectedDate) {
      const nextSunday = getNextSunday()
      // Find the closest Sunday in our list
      const closest = sundays.reduce((prev, curr) => {
        return Math.abs(curr - nextSunday) < Math.abs(prev - nextSunday) ? curr : prev
      })
      setSelectedDate(closest)
    }
  }, [sundays, selectedDate])

  return (
    <SelectedSundayContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedSundayContext.Provider>
  )
}

export function useSharedSelectedSunday() {
  const context = useContext(SelectedSundayContext)
  if (!context) {
    throw new Error('useSharedSelectedSunday must be used within a SelectedSundayProvider')
  }
  return context
}
