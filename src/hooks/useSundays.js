import { useState, useEffect, useMemo } from 'react'
import { getWinterSundays, getNextSunday, getCurrentSeasonYear } from '../services/dateUtils'

export function useSundays(year) {
  const sundays = useMemo(() => {
    if (!year) return []
    return getWinterSundays(year)
  }, [year])

  return sundays
}

export function useCurrentSeason() {
  const [seasonYear, setSeasonYear] = useState(getCurrentSeasonYear())

  return {
    seasonYear,
    setSeasonYear,
    seasonLabel: `${seasonYear}/${seasonYear + 1}`
  }
}

export function useSelectedSunday(sundays) {
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

  return {
    selectedDate,
    setSelectedDate
  }
}
