const REPO_OWNER = 'jonnez'
const REPO_NAME = 'wintertennis'
const API_BASE = 'https://api.github.com'

class GitHubService {
  constructor(token) {
    this.token = token
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `GitHub API error: ${response.status}`)
    }

    return response.json()
  }

  // Get file contents
  async getFile(branch, path) {
    try {
      const data = await this.request(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${branch}`
      )

      if (data.content) {
        const content = atob(data.content)
        return {
          content: JSON.parse(content),
          sha: data.sha
        }
      }
      return null
    } catch (error) {
      if (error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Create or update file
  async saveFile(branch, path, content, message, sha = null) {
    const body = {
      message,
      content: btoa(JSON.stringify(content, null, 2)),
      branch
    }

    if (sha) {
      body.sha = sha
    }

    return this.request(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    )
  }

  // Create branch
  async createBranch(newBranch, fromBranch = 'main') {
    try {
      // Get ref of source branch
      const ref = await this.request(
        `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${fromBranch}`
      )

      // Create new branch
      await this.request(
        `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`,
        {
          method: 'POST',
          body: JSON.stringify({
            ref: `refs/heads/${newBranch}`,
            sha: ref.object.sha
          })
        }
      )

      return true
    } catch (error) {
      if (error.message.includes('Reference already exists')) {
        return true // Branch already exists, that's fine
      }
      throw error
    }
  }

  // List branches
  async listBranches() {
    const branches = await this.request(
      `/repos/${REPO_OWNER}/${REPO_NAME}/branches`
    )
    return branches.map(b => b.name)
  }

  // Check if branch exists
  async branchExists(branch) {
    try {
      await this.request(
        `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${branch}`
      )
      return true
    } catch (error) {
      return false
    }
  }

  // Initialize year branch with empty data files
  async initializeYearBranch(year) {
    const branch = year.toString()
    const exists = await this.branchExists(branch)

    if (!exists) {
      await this.createBranch(branch)
    }

    // Create initial data files if they don't exist
    const emptyPlayers = { players: [] }
    const playerFile = await this.getFile(branch, 'data/players.json')

    if (!playerFile) {
      await this.saveFile(
        branch,
        'data/players.json',
        emptyPlayers,
        `Initialize players.json for ${year}`
      )
    }

    return branch
  }
}

export default GitHubService
