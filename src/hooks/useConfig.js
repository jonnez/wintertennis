import { useState, useEffect } from 'react'
import { useAuth } from '../components/Auth/AuthContext'
import GitHubService from '../services/github'

// Hook to load configuration from main branch
export function useConfig() {
  const { token } = useAuth()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadConfig() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const service = new GitHubService(token)
        const result = await service.getFile('main', 'data/config.json')

        if (result) {
          setConfig(result.content)
        } else {
          // Fallback to current year if config doesn't exist
          const currentYear = new Date().getMonth() < 8
            ? new Date().getFullYear() - 1
            : new Date().getFullYear()
          setConfig({
            activeSeason: currentYear.toString(),
            availableSeasons: [currentYear.toString()]
          })
        }
      } catch (err) {
        console.error('Error loading config:', err)
        setError(err.message)
        // Fallback to current year on error
        const currentYear = new Date().getMonth() < 8
          ? new Date().getFullYear() - 1
          : new Date().getFullYear()
        setConfig({
          activeSeason: currentYear.toString(),
          availableSeasons: [currentYear.toString()]
        })
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [token])

  return {
    config,
    loading,
    error,
    activeSeason: config?.activeSeason || null,
    availableSeasons: config?.availableSeasons || []
  }
}
