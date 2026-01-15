import { format, addDays, startOfDay, isAfter, isBefore, getDay } from 'date-fns'
import { nl } from 'date-fns/locale'

// Get all Sundays in winter season (September through April)
export function getWinterSundays(year) {
  const sundays = []

  // Start year (e.g., 2025 means season 2025-2026)
  const startYear = year
  const endYear = year + 1

  // September through December of start year
  for (let month = 8; month <= 11; month++) {
    addSundaysInMonth(sundays, startYear, month)
  }

  // January through April of end year
  for (let month = 0; month <= 3; month++) {
    addSundaysInMonth(sundays, endYear, month)
  }

  return sundays.sort((a, b) => a - b)
}

function addSundaysInMonth(sundays, year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let current = firstDay
  // Find first Sunday
  while (getDay(current) !== 0) {
    current = addDays(current, 1)
  }

  // Add all Sundays in the month
  while (current <= lastDay) {
    sundays.push(new Date(current))
    current = addDays(current, 7)
  }
}

// Get next Sunday (or today if it's Sunday)
export function getNextSunday() {
  const today = startOfDay(new Date())
  const dayOfWeek = getDay(today)

  if (dayOfWeek === 0) {
    return today
  }

  const daysUntilSunday = 7 - dayOfWeek
  return addDays(today, daysUntilSunday)
}

// Format date for display
export function formatDate(date, formatStr = 'EEEE d MMMM yyyy') {
  return format(date, formatStr, { locale: nl })
}

// Format date for file names (YYYY-MM-DD)
export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd')
}

// Parse date from key
export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Get current season year (September starts new season)
export function getCurrentSeasonYear() {
  const now = new Date()
  const month = now.getMonth()

  // If we're in January-August, the season started last year
  if (month < 8) {
    return now.getFullYear() - 1
  }

  return now.getFullYear()
}

// Check if date is in even/odd week based on play day sequence
// Week 1 (first play day) = odd, Week 2 (second play day) = even, etc.
// This ensures fairness regardless of holidays/vacations
export function isEvenWeek(date, sundays) {
  if (!sundays || sundays.length === 0) return false

  // Find the index (0-based) of this date in the sundays array
  const dateKey = formatDateKey(date)
  const weekIndex = sundays.findIndex(sunday => formatDateKey(sunday) === dateKey)

  if (weekIndex === -1) return false

  // Week 1 is index 0 (odd), Week 2 is index 1 (even), etc.
  // So even weeks have odd indices
  return (weekIndex + 1) % 2 === 0
}

export function isOddWeek(date, sundays) {
  if (!sundays || sundays.length === 0) return false

  // Find the index (0-based) of this date in the sundays array
  const dateKey = formatDateKey(date)
  const weekIndex = sundays.findIndex(sunday => formatDateKey(sunday) === dateKey)

  if (weekIndex === -1) return false

  // Week 1 is index 0 (odd), Week 2 is index 1 (even), etc.
  // So odd weeks have even indices
  return (weekIndex + 1) % 2 === 1
}
