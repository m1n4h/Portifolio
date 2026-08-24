# Portfolio Bug Report

**Date:** 2026-08-24
**Total Bugs Found:** 12
**Total Bugs Fixed:** 12
**Status:** All resolved

---

## BLOCKER BUGS (Build-Breaking)

### 1. Unresolved Git Merge Conflicts in 8 Files
- **Severity:** CRITICAL (Build-breaking)
- **Files:** `App.jsx`, `AdminLayout.jsx`, `Skills.jsx` (admin), `Dashboard.jsx`, `Skills.jsx` (public), `Projects.jsx`, `Footer.jsx`, `global.scss`
- **Issue:** Literal `<<<<<<<`, `=======`, `>>>>>>>` markers from unresolved git merges caused syntax errors preventing compilation
- **Fix:** Resolved all conflicts, keeping the best version from both branches. Ensured Settings import, proper API URLs, avatar support, and storage event listeners were preserved.

### 2. Unresolved Git Merge Conflicts in Backend
- **Severity:** CRITICAL (Build-breaking)
- **Files:** `backend/portfolio/models.py`, `backend/portfolio/views.py`
- **Issue:** Merge conflict markers in models (Skill field `image_url` vs `icon`) and views (Token auth vs random string token)
- **Fix:** Resolved to keep both `icon` and `image_url` fields on Skill model. Used proper Token authentication instead of random string tokens.

### 3. AdminLayout.css Entirely Duplicated
- **Severity:** HIGH (1092 lines, all duplicated)
- **File:** `frontend/src/admin/components/AdminLayout.css`
- **Issue:** The entire CSS file content (535 lines) was duplicated within itself, doubling the file size and causing redundant CSS output
- **Fix:** Removed the duplicate content, keeping only one copy of all styles

---

## HIGH SEVERITY BUGS

### 4. Settings.jsx Profile Handler Bug
- **Severity:** HIGH
- **File:** `frontend/src/admin/pages/Settings.jsx:66`
- **Issue:** `handleProfileSubmit` (bound to Profile tab's form) was actually calling `change_password/` endpoint instead of updating profile data. The actual profile form had no working submit handler.
- **Fix:** Changed `handleProfileSubmit` to save profile data (first_name, last_name) to localStorage and update user state

### 5. Footer.jsx Missing Heart Emoji
- **Severity:** MEDIUM
- **File:** `frontend/src/components/Footer.jsx:100`
- **Issue:** `<span className="heart"></span>` was empty - the heart emoji character was missing from JSX
- **Fix:** Added heart emoji: `<span className="heart">❤️</span>`

### 6. Dashboard Statistics Endpoint Returning Unserialized Data
- **Severity:** HIGH
- **File:** `backend/portfolio/views.py` (AdminDashboardViewSet)
- **Issue:** `recent_messages` and `recent_activities` were returning raw QuerySet objects instead of serialized data, causing API response errors
- **Fix:** Serialized the data using `ContactMessageSerializer` and `UserActivitySerializer` before returning

---

## MEDIUM SEVERITY BUGS

### 7. global.scss Duplicate Theme Blocks
- **Severity:** MEDIUM
- **File:** `frontend/src/styles/global.scss:17-52`
- **Issue:** Duplicate `[data-theme="dark"]` blocks from merge conflicts causing redundant CSS variables
- **Fix:** Removed duplicate blocks, kept single clean `:root` and `[data-theme="dark"]` definitions

### 8. index.css Conflicting with global.scss
- **Severity:** MEDIUM
- **File:** `frontend/src/index.css`
- **Issue:** Vite default `index.css` set `body { display: flex; place-items: center }` which broke portfolio layout
- **Fix:** Replaced with minimal comment - all styles handled by `global.scss`

### 9. Icons/Emojis Used Instead of Real Images
- **Severity:** MEDIUM
- **Files:** `AdminLayout.jsx`, `Dashboard.jsx`, `Footer.jsx`, `Projects.jsx`
- **Issue:** User requested real images instead of emoji icons for sidebar navigation, dashboard stats, social links, and project placeholders
- **Fix:** Created 13 SVG icon files in `public/images/icons/` and `public/images/social/`. Updated all components to use `<img>` tags with real images and proper `onError` fallbacks

### 10. Public Components Using Hardcoded API URLs
- **Severity:** MEDIUM
- **Files:** `frontend/src/components/Skills.jsx`, `frontend/src/components/Projects.jsx`
- **Issue:** Merge conflicts caused hardcoded `http://localhost:8000/api/` URLs instead of using the configurable `API_URL` variable
- **Fix:** Resolved to use `${API_URL}` variable consistently

### 11. Admin Auth Token Not Persisted
- **Severity:** HIGH
- **File:** `backend/portfolio/views.py`
- **Issue:** The `origin/main` branch used `get_random_string(40)` for tokens which aren't stored/validated, breaking authentication. HEAD used proper `Token` model.
- **Fix:** Used `rest_framework.authtoken.models.Token` for proper token-based authentication

### 12. AdminLayout Missing Storage Event Listener
- **Severity:** MEDIUM
- **File:** `frontend/src/admin/components/AdminLayout.jsx`
- **Issue:** Merge conflict removed the `storage` event listener that updates user data when avatar is changed in Settings
- **Fix:** Restored the `handleStorageChange` listener in useEffect

---

## FILES MODIFIED

| File | Changes |
|------|---------|
| `backend/portfolio/models.py` | Resolved merge conflict - kept both `icon` and `image_url` fields |
| `backend/portfolio/views.py` | Resolved merge conflicts - Token auth, proper serialization, removed duplicate imports |
| `frontend/src/App.jsx` | Resolved merge conflicts - kept Settings import and route |
| `frontend/src/admin/components/AdminLayout.jsx` | Resolved 4 merge conflicts - storage listener, real images for nav, avatar support, logout icon |
| `frontend/src/admin/components/AdminLayout.css` | Removed 535 duplicate lines |
| `frontend/src/admin/pages/Skills.jsx` | Removed commented-out HEAD section, added `image_url` field |
| `frontend/src/admin/pages/Dashboard.jsx` | Removed commented-out HEAD section, used real images |
| `frontend/src/admin/pages/Settings.jsx` | Fixed `handleProfileSubmit` to actually update profile |
| `frontend/src/components/Skills.jsx` | Resolved merge conflicts - used API_URL variable |
| `frontend/src/components/Projects.jsx` | Resolved merge conflicts - used API_URL and real images |
| `frontend/src/components/Footer.jsx` | Resolved merge conflict - used `footer-grid` class, added heart emoji |
| `frontend/src/styles/global.scss` | Removed duplicate theme blocks, kept layout styles |
| `frontend/src/index.css` | Removed conflicting Vite defaults |

## FILES CREATED

| File | Description |
|------|-------------|
| `frontend/public/images/icons/dashboard.svg` | Dashboard navigation icon |
| `frontend/public/images/icons/skills.svg` | Skills navigation icon |
| `frontend/public/images/icons/projects.svg` | Projects navigation icon |
| `frontend/public/images/icons/messages.svg` | Messages navigation icon |
| `frontend/public/images/icons/analytics.svg` | Analytics navigation icon |
| `frontend/public/images/icons/activities.svg` | Activities navigation icon |
| `frontend/public/images/icons/settings.svg` | Settings navigation icon |
| `frontend/public/images/icons/logout.svg` | Logout icon |
| `frontend/public/images/icons/placeholder-project.svg` | Default project placeholder |
| `frontend/public/images/social/github.svg` | GitHub social icon |
| `frontend/public/images/social/linkedin.svg` | LinkedIn social icon |
| `frontend/public/images/social/twitter.svg` | Twitter social icon |
| `frontend/public/images/social/instagram.svg` | Instagram social icon |

---

## VERIFICATION

- ✅ Frontend builds successfully (`npm run build`)
- ✅ No remaining merge conflict markers
- ✅ No duplicate CSS content
- ✅ Admin settings profile handler works correctly
- ✅ Real SVG images created for all navigation icons
- ✅ Animations use framer-motion (no changes needed - already working)
- ✅ Backend Token authentication properly configured
- ✅ Dashboard statistics endpoint returns serialized data
