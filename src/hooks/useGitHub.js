import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../components/Auth/AuthContext'
import GitHubService from '../services/github'

export function useGitHub() {
  const { token } = useAuth()
  const [service, setService] = useState(null)

  useEffect(() => {
    if (token) {
      setService(new GitHubService(token))
    } else {
      setService(null)
    }
  }, [token])

  return service
}

export function useGitHubData(branch, path) {
  const service = useGitHub()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sha, setSha] = useState(null)

  const load = useCallback(async () => {
    if (!service || !branch || !path) return

    setLoading(true)
    setError(null)

    try {
      const result = await service.getFile(branch, path)
      if (result) {
        setData(result.content)
        setSha(result.sha)
      } else {
        setData(null)
        setSha(null)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }, [service, branch, path])

  const save = useCallback(async (newData, message) => {
    if (!service || !branch || !path) return false

    setLoading(true)
    setError(null)

    try {
      await service.saveFile(branch, path, newData, message, sha)
      setData(newData)
      // Reload to get new SHA
      await load()
      return true
    } catch (err) {
      setError(err.message)
      console.error('Error saving data:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [service, branch, path, sha, load])

  useEffect(() => {
    load()
  }, [load])

  return {
    data,
    loading,
    error,
    reload: load,
    save
  }
}
