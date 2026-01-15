# Take‑Home Assessment

Welcome, candidate! This project contains **intentional issues** that mimic real‑world scenarios.
Your task is to refactor, optimize, and fix these problems.

## Objectives

### 💻 Frontend (React)

1. **Memory Leak**  
   - `Items.js` leaks memory if the component unmounts before fetch completes. Fix it.

2. **Pagination & Search**  
   - Implement paginated list with server‑side search (`q` param). Contribute to both client and server.

3. **Performance**  
   - The list can grow large. Integrate **virtualization** (e.g., `react-window`) to keep UI smooth.

4. **UI/UX Polish(optional)**  
   - Feel free to enhance styling, accessibility, and add loading/skeleton states.

### 🔧 Backend (Node.js)

1. **Refactor blocking I/O**  
   - `src/routes/items.js` uses `fs.readFileSync`. Replace with non‑blocking async operations.

2. **Performance**  
   - `GET /api/stats` recalculates stats on every request. Cache results, watch file changes, or introduce a smarter strategy.


## ⏰ Time Expectation

- Estimated time to complete: **1–2 hours**.

## 📤 Submission

Once completed, submit one of the following:

- **short video** recording your work.
- **Github Link** where your assessment result were pushed.

---

## Quick Start

node version: 18.XX
```bash
nvm install 18
nvm use 18

# Terminal 1
cd backend
npm install
npm start

# Terminal 2
cd frontend
npm install
npm start
```

> The frontend proxies `/api` requests to `http://localhost:4001`.

---

## Implementation Notes

### Frontend (React) - All Complete

#### 1. Memory Leak

**Requirement:** Fix memory leak in Items.js if component unmounts before fetch completes

**Implementation:** Used `useRef` with mount status callback to prevent setState after unmount

**Files Modified:**
- `frontend/src/pages/Items.jsx` - Added `useRef(true)` to track component mount status
- `frontend/src/state/DataContext.jsx` - Modified `fetchItems` to accept `shouldUpdate` callback that checks mount status before calling `setItems`

**How it works:** The `active` ref tracks whether the component is still mounted. Before calling `setItems`, DataContext checks if the callback returns true. When component unmounts, `active.current` is set to false, preventing setState after unmount.

---

#### 2. Pagination & Search

**Requirement:** Implement paginated list with server-side search (`q` param), both client and server

**Implementation:**
- **Backend:** Pagination with `page`, `limit`, `q` params, returns metadata `{ items, page, limit, total }`
- **Frontend:** Search input, pagination controls (Previous/Next buttons)

**Files Modified:**
- `backend/src/routes/items.js` - Added pagination logic with default `page=1`, `limit=10`, search filtering by name, returns paginated response with metadata
- `frontend/src/state/DataContext.jsx` - Added state for `page`, `limit`, `totalItems`, `searchQuery`, dynamic query string building
- `frontend/src/pages/Items.jsx` - Added search input, Previous/Next buttons, page counter display

**Features:**
- Search box filters items by name in real-time
- Pagination controls navigate through pages (10 items per page)
- Page counter shows current page, total pages, and total items
- Previous button disabled on first page, Next button disabled on last page
- Search resets to page 1 automatically

---

#### 3. Performance

**Requirement:** Integrate virtualization (e.g., `react-window`) to keep UI smooth for large lists

**Implementation:** Integrated `react-window` FixedSizeList with 600px height, 50px item size

**Files Modified:**
- `frontend/package.json` - Added `"react-window": "^1.8.10"` dependency
- `frontend/src/pages/Items.jsx` - Replaced `<ul>` map with `<FixedSizeList>` component, created `Row` component for virtualized rendering

**Benefits:**
- Only visible items are rendered in DOM (typically 12-15 items for 600px height)
- Constant rendering performance regardless of list size
- Smooth scrolling even with hundreds of items
- Lower memory usage

---

#### 4. UI/UX Polish (Optional - Partially Implemented)

**Requirement:** Enhance styling, accessibility, and add loading/skeleton states

**Implementation:** Added loading states

**Files Modified:**
- `frontend/src/state/DataContext.jsx` - Added `loading` state, wrapped fetch in try-finally
- `frontend/src/pages/Items.jsx` - Added loading indicator, disabled pagination buttons during loading

**Features:**
- Shows "Loading..." text during data fetch
- Shows "No items found" when empty and not loading
- Pagination buttons disabled during loading to prevent race conditions
- Clear visual feedback for better UX

---

### Backend (Node.js) - All Complete

#### 1. Refactor blocking I/O

**Requirement:** Replace `fs.readFileSync` with non-blocking async operations

**Implementation:** Converted all sync operations to `fs.promises` with async/await

**Files Modified:**
- `backend/src/routes/items.js` - Changed `require('fs')` to `require('fs').promises`, converted `readData()` to async function, made all route handlers async, replaced `fs.readFileSync()` with `await fs.readFile()`, replaced `fs.writeFileSync()` with `await fs.writeFile()`

**Benefits:**
- Backend no longer blocks the event loop on file I/O operations
- Server can handle concurrent requests without waiting for disk operations
- Scalable for production use with multiple simultaneous requests

---

#### 2. Performance (Stats Caching)

**Requirement:** Cache stats results instead of recalculating on every request

**Implementation:** Module-level cache with invalidation on data changes

**Files Modified:**
- `backend/src/routes/stats.js` - Added `cachedStats` variable, created `invalidateStatsCache()` function, modified GET handler to return cached stats if available, exported invalidation function
- `backend/src/routes/items.js` - Imported `invalidateStatsCache`, called it after successful POST write

**How it works:**
- First call to `/api/stats` calculates and caches statistics
- Subsequent calls return cached results instantly (no recalculation)
- When new items are added via POST, cache is invalidated
- Next stats request recalculates with fresh data

**Benefits:**
- Reduced CPU usage on repeated stats requests
- Instant responses for cached data
- Automatic cache invalidation ensures data consistency