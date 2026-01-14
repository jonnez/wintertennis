import { useState, useEffect, useMemo } from 'react'
import { getWinterSundays, getNextSunday } from '../services/dateUtils'
import { useConfig } from './useConfig'

export function useSundays(year) {
  const sundays = useMemo(() => {
    if (!year) return []
    return getWinterSundays(year)
  }, [year])

  return sundays
}

export function useCurrentSeason() {
  const { activeSeason, loading } = useConfig()
  const [seasonYear, setSeasonYear] = useState(activeSeason)

  useEffect(() => {
    if (activeSeason && !seasonYear) {
      setSeasonYear(activeSeason)
    }
  }, [activeSeason, seasonYear])

  // Convert to number for calculations
  const yearNum = seasonYear ? parseInt(seasonYear) : null

  return {
    seasonYear: yearNum,
    setSeasonYear,
    seasonLabel: yearNum ? `${yearNum}/${yearNum + 1}` : '',
    loading
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
