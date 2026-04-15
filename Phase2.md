# 🟡 PHASE 2 - IMPLEMENTATION GUIDE
## API + IndexedDB Integration

---

## 📋 FILE CHECKLIST

**5 files baru/update:**

```
[ ] 1. src/api/storyApi.js        (NEW - API layer)
[ ] 2. src/services/db.js         (NEW - IndexedDB)
[ ] 3. src/store/storyStore.js    (NEW - Store)
[ ] 4. src/views/HomeView.vue     (UPDATE)
[ ] 5. src/main.js                (UPDATE)
```

---

## 🚀 SETUP (10 MENIT)

### Step 1: Create Folder Structure

```bash
# Create api folder
mkdir -p src/api
mkdir -p src/services
mkdir -p src/store
```

### Step 2: Copy 5 Files

Copy dari outputs/:

```
phase2_storyApi.js    → src/api/storyApi.js
phase2_db.js          → src/services/db.js
phase2_storyStore.js  → src/store/storyStore.js
phase2_HomeView.vue   → src/views/HomeView.vue (REPLACE)
phase2_main.js        → src/main.js (REPLACE)
```

### Step 3: Run Dev Server

```bash
npm run dev
```

---

## 📊 ALUR KERJA PHASE 2

```
User buka HomeView
    ↓
onMounted() dipanggil
    ↓
initStore() → Initialize IndexedDB
    ↓
loadStories() dipanggil
    ↓
🌐 Cek apakah online?
    ├─ YES → fetchStoriesFromAPI()
    │   ├─ API success → saveStories(db)
    │   └─ API fail → continue ke cache
    │
    └─ NO → Langsung ke cache
    ↓
📦 getStoriesFromDB()
    ├─ Ada data → Show from cache
    └─ Tidak ada → Show error
    ↓
Update state.stories
    ↓
HomeView re-render
    ↓
Show stories di UI ✅
```

---

## 🧪 TESTING

### Test 1: Online - Fetch dari API

**Setup:**
- Ensure dev server running
- Ensure online

**Test:**
```
1. Open http://localhost:5173
2. Check browser console
3. Look for: "[API] ✅ Fetched X stories"
4. Should see 10 stories from JSONPlaceholder
```

**Expected output di console:**
```
[Store] Loading stories...
[API] Fetching stories from API...
[API] ✅ Fetched 10 stories
[DB] Saving 10 stories...
[DB] ✅ Saved 10 stories
[Store] ✅ Stories loaded from API and cached
```

---

### Test 2: Offline - Fallback ke IndexedDB

**Setup:**
```
1. Go online first (load data)
2. Open DevTools → Network tab
3. Set to "Offline"
```

**Test:**
```
1. Refresh page (F5)
2. Check console
3. Should say "Using cached data"
4. Should still show 10 stories
5. Stories dari cache, bukan API
```

**Expected output di console:**
```
[Store] 📡 Currently offline, using cached data
[Store] Fetching from cache...
[DB] Fetching stories from cache...
[DB] ✅ Retrieved 10 stories from cache
[Store] ✅ Stories loaded from cache
```

---

### Test 3: DetailView (navigate ke story)

**Test:**
```
1. Click story card dari home
2. Should navigate ke /story/:id
3. DetailView should load
4. Click "Back" → back to home
```

---

### Test 4: Loading State

**Test:**
```
1. Open home page
2. Should see spinner + "Loading stories..."
3. After data loaded, spinner disappear
4. Stories shown
```

---

### Test 5: Error State

**Test:**
```
1. Disconnect internet (go offline)
2. Clear IndexedDB (DevTools → Application → IndexedDB → delete)
3. Load home page
4. Should show error: "Offline dan tidak ada data cached"
5. Retry button visible
6. Click "Go Online" in DevTools
7. Click "Retry" → reload from API
8. Stories should load
```

---

### Test 6: IndexedDB Storage

**DevTools Check:**
```
1. Open DevTools → Application
2. IndexedDB → pathshare-db → stories
3. Should see 10 stories
4. Click one story → see properties (id, title, description, etc)
5. All data stored correctly
```

---

## ⚙️ HOW IT WORKS - DETAILED

### 1. storyApi.js

**Purpose:** Fetch data dari API

**Functions:**
- `fetchStoriesFromAPI()` - Get all stories
- `fetchStoryByIdFromAPI(id)` - Get single story

**Key features:**
- Uses native `fetch()`
- Mock API: JSONPlaceholder
- Transform API response ke story object
- Error handling dengan throw

**Example API response transform:**
```javascript
// API response (JSONPlaceholder)
{
  id: 1,
  title: "...",
  body: "...",
  userId: 1
}

// Transform to
{
  id: "1",
  title: "...",
  description: "...",  // dari body
  location: "Location 1",
  image: "https://via.placeholder.com/...",
  createdAt: "2024-01-01T...",
  userId: "1"
}
```

---

### 2. db.js

**Purpose:** Manage IndexedDB offline cache

**Functions:**
- `initDB()` - Create/open database
- `saveStories(stories)` - Save array
- `getStories()` - Get all
- `getStoryById(id)` - Get single
- `clearStories()` - Clear cache
- `hasCachedStories()` - Check jika ada cache

**Database structure:**
```
Database: pathshare-db
├── Object Store: stories
│   ├── Key: id
│   ├── Index: userId
│   └── Data: { id, title, description, location, image, createdAt, userId }
```

**Implementation details:**
- Uses Promises (not callbacks)
- Wrap IndexedDB API ke Promise
- Clear existing sebelum save (avoid duplicates)
- Error handling robust

---

### 3. storyStore.js

**Purpose:** Orchestrate API + IndexedDB

**Main function:**
```javascript
loadStories():
1. Set loading = true
2. If online:
   a. Fetch dari API
   b. Save ke IndexedDB
   c. Update state
   d. Return
3. Else (offline or fail):
   a. Get dari IndexedDB
   b. Update state
   c. Return
```

**Reactive state:**
```javascript
state = {
  stories: [],        // Array of stories
  loading: false,     // Is loading?
  error: null,        // Error message
  lastFetchTime: null // Last fetch timestamp
}
```

**Online/offline listener:**
```javascript
window.addEventListener('online', () => {
  // Auto reload saat online
  loadStories()
})
```

---

### 4. HomeView.vue Update

**Key changes:**
- Import store functions
- Call `loadStories()` pada mount
- Display loading state (spinner)
- Display error state (error message + retry button)
- Display stories grid
- Show "Using cached data" badge saat offline

**Lifecycle:**
```vue
onMounted() {
  ├─ await initStore()
  ├─ setupOnlineListener()
  ├─ await loadStories()
  └─ Setup polling (every 30 sec)
}
```

**UI States:**
```
1. Loading
   └─ Spinner + "Loading stories..."

2. Error
   └─ Error message + "Retry" button

3. Success
   └─ Grid of stories

4. Empty
   └─ "No stories available" + "Try Again" button

5. Offline
   └─ Blue badge "💾 Using cached data"
```

---

## 🔍 DEBUGGING TIPS

### Issue: API not called

**Check:**
1. Dev server running?
2. Internet connected?
3. Check console: `[API] Fetching...`
4. Check Network tab: see API request?

**Fix:**
- Ensure `loadStories()` called in HomeView
- Check online status: `navigator.onLine`

---

### Issue: Data tidak muncul

**Check:**
1. Stories di state? `console.log(getState().stories)`
2. Stories di IndexedDB? Check DevTools → IndexedDB
3. Error di console?

**Fix:**
- Check `getStories()` returns correct data
- Check transform API response correctly

---

### Issue: IndexedDB error

**Check:**
1. Database created? DevTools → IndexedDB → pathshare-db
2. Object store exists? Check "stories" store
3. Data in store? Click store → see documents

**Fix:**
- Delete IndexedDB: DevTools → Application → Clear storage
- Reload page
- Should recreate database

---

### Issue: Offline not working

**Check:**
1. Go offline: DevTools → Network → Offline
2. Check console: `[Store] Currently offline`
3. Check IndexedDB has data

**Fix:**
- Must load data online first (populate cache)
- Then go offline
- Refresh page
- Should still show cached data

---

## 📊 PERFORMANCE METRICS

Expected after Phase 2:

```
| Metric | Value |
|--------|-------|
| API fetch time | ~200-500ms |
| IndexedDB save time | ~50-100ms |
| IndexedDB read time | ~10-30ms |
| Total load time (online) | ~500-700ms |
| Total load time (offline) | ~30-50ms |
| Bundle size | ~55 KB |
| Lighthouse score | 85+ |
```

---

## ✅ PHASE 2 COMPLETE

You have:
- ✅ API integration (fetch)
- ✅ IndexedDB offline cache
- ✅ Simple state management
- ✅ Error handling
- ✅ Online/offline detection
- ✅ Loading states
- ✅ Retry mechanism

---

## 🎯 NEXT: PHASE 3

After Phase 2 works perfectly:

**Phase 3 adds:**
- Dynamic offline data caching (all data cached)
- Better offline UI
- Service Worker improvements
- Cache invalidation

But first, **master Phase 2!**

---

## 📝 COMMON GOTCHAS

### ❌ Don't do this:

```javascript
// WRONG - Calling loadStories without await
mounted() {
  loadStories() // Missing await!
}

// WRONG - Not handling promise rejection
loadStories().then(...)  // No catch!

// WRONG - Fetching every time without caching
const stories = ref([])
watch(isOnline, () => fetchAPI())  // Spam API!
```

### ✅ Do this:

```javascript
// RIGHT - Await dan handle errors
async mounted() {
  try {
    await loadStories()
  } catch (error) {
    console.error('Load failed:', error)
  }
}

// RIGHT - Fetch once on mount
onMounted(async () => {
  await loadStories()
})

// RIGHT - Auto retry saat online (in store)
window.addEventListener('online', () => {
  loadStories()  // Only once, handled in store
})
```

---

## 🎓 WHAT YOU LEARNED

Phase 2 teaches:
- ✅ Native IndexedDB usage
- ✅ Async/await patterns
- ✅ Promise wrapping APIs
- ✅ Offline-first architecture
- ✅ Simple state management (without library)
- ✅ Error handling & retry
- ✅ Online/offline detection

These concepts apply **beyond this project.**

---

**Phase 2 is about resilience. System works online AND offline.**

Test thoroughly, especially offline mode!

Go! 🚀