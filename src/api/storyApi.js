/**
 * API Layer - Fetch data dari Mock API
 * 
 * Mock API: https://jsonplaceholder.typicode.com/posts
 * Real API: Replace dengan endpoint sebenarnya
 */

/**
 * Fetch stories dari API
 * @returns {Promise<Array>} Array of stories
 * @throws {Error} Jika API call gagal
 */
export async function fetchStoriesFromAPI() {
  try {
    console.log('[API] Fetching stories from API...')

    // Mock API - gunakan JSONPlaceholder
    // Di production, ganti dengan endpoint sebenarnya
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_limit=10'
    )

    // Check if response ok (status 200-299)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transform API response ke story format
    const stories = data.map((post, index) => ({
      id: String(post.id),
      title: post.title,
      description: post.body,
      location: `Location ${index + 1}`, // Mock location
      image: `https://via.placeholder.com/300x200?text=Story+${post.id}`,
      createdAt: new Date().toISOString(),
      userId: String(post.userId)
    }))

    console.log(`[API] ✅ Fetched ${stories.length} stories`)
    return stories
  } catch (error) {
    console.error('[API] ❌ Failed to fetch stories:', error.message)
    throw error
  }
}

/**
 * Fetch single story dari API
 * @param {string} id - Story ID
 * @returns {Promise<Object>} Story object
 * @throws {Error} Jika API call gagal
 */
export async function fetchStoryByIdFromAPI(id) {
  try {
    console.log(`[API] Fetching story ${id} from API...`)

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const post = await response.json()

    const story = {
      id: String(post.id),
      title: post.title,
      description: post.body,
      location: `Location ${post.id}`,
      image: `https://via.placeholder.com/800x400?text=Story+${post.id}`,
      createdAt: new Date().toISOString(),
      userId: String(post.userId)
    }

    console.log(`[API] ✅ Fetched story: ${story.title}`)
    return story
  } catch (error) {
    console.error(`[API] ❌ Failed to fetch story ${id}:`, error.message)
    throw error
  }
}