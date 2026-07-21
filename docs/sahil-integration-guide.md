# Sahil Integration Plan

Saved 2026-07-21 for merging collaborator Towsif Abrar Sahil's force-pushed work
back into the repo in logical chunks.

## Branch Layout

| Branch | Purpose |
|--------|---------|
| `main` | Our history with Phases 1-3 (10 commits) |
| `archive/sahil-work` | Sahil's squashed commit `01ffb27` (preserved forever) |
| `review/sahil-integration` | Working branch for cherry-picking Sahil's changes |

## How to Apply Sahil's Changes

Sahil added/modified 68 files (+5070 / -1203). The changes fall into natural groups
that can be cherry-picked from `archive/sahil-work` one at a time.

### Group 1 — New Models (clean import)
```bash
git checkout archive/sahil-work -- backend/models/Policy.js backend/models/Category.js backend/models/Counter.js
git commit -m "feat: add Policy, Category, and Counter models"
```

### Group 2 — New Backend Routes & Controllers (clean import)
```bash
git checkout archive/sahil-work -- backend/controllers/policyController.js backend/routes/policy.js backend/utils/invoiceNumber.js
git commit -m "feat: add policy CRUD and invoice number utility"
```

### Group 3 — Seed & Utility Scripts (clean import)
```bash
git checkout archive/sahil-work -- backend/seed.js backend/seedDemo.js backend/fixImages.js backend/updateVehicles.js
git commit -m "feat: add seed scripts, image fixer, and vehicle updater"
```

### Group 4 — UI Component Library (clean import)
```bash
git checkout archive/sahil-work -- frontend/src/components/ui/
git commit -m "feat: add reusable UI component library"
```

### Group 5 — New Frontend Pages (clean import)
```bash
git checkout archive/sahil-work -- frontend/src/pages/NotFound.jsx frontend/src/pages/Policies.jsx frontend/src/components/Footer.jsx
git commit -m "feat: add NotFound, Policies, and Footer pages"
```

### Group 6 — Deployment Config (clean import)
```bash
git checkout archive/sahil-work -- render.yaml frontend/src/index.css
git commit -m "feat: add Render deployment config and Tailwind theme"
```

### Group 7 — Package & Config Updates (needs manual merge)
These files have changes that need to be reconciled with our versions:
```bash
# Check the diff first:
git diff main -- frontend/package.json frontend/package-lock.json backend/package.json backend/package-lock.json
```

### Group 8 — Overlapping Files (manual merge required)
Files modified by **both** us and Sahil. Must decide per-file:
- **Take ours** → ignore his changes
- **Take his** → `git checkout archive/sahil-work -- <file>`
- **Merge** → manually combine

| File | Notes |
|------|-------|
| `frontend/src/pages/Checkout.jsx` | Heavy rewrite both sides |
| `frontend/src/pages/AdminDashboard.jsx` | Heavy rewrite both sides |
| `frontend/src/pages/Invoice.jsx` | Heavy rewrite both sides |
| `frontend/src/pages/Home.jsx` | Heavy rewrite both sides |
| `frontend/src/pages/BikeDetails.jsx` | Modified both sides |
| `frontend/src/pages/RenterDashboard.jsx` | Modified both sides |
| `frontend/src/pages/PaymentCancelled.jsx` | Sahil rewrote |
| `frontend/src/pages/PaymentFailed.jsx` | Sahil rewrote |
| `frontend/src/App.jsx` | Route changes both sides |
| `frontend/src/components/Navbar.jsx` | Sahil added new layout |
| `frontend/src/components/Login.jsx` | Sahil reworked |
| `frontend/src/components/Signup.jsx` | Sahil reworked |
| `frontend/src/context/AuthContext.jsx` | Modified both sides |
| `frontend/src/components/Toast.jsx` | Sahil rewrote |
| `frontend/src/components/Spinner.jsx` | **Deleted** — replaced by `ui/Spinner.jsx` |
| `frontend/src/hooks/useToast.js` | **Deleted** — moved to `components/useToast.js` |
| `backend/controllers/bookingController.js` | Modified both sides |
| `backend/controllers/dashboardController.js` | Heavy rewrite |
| `backend/controllers/couponController.js` | Modified both sides |
| `backend/server.js` | Route additions both sides |
| `backend/routes/dashboard.js` | Route additions both sides |
| `backend/models/Bike.js` | Minor field changes |
| `backend/models/Booking.js` | Minor field changes |
| `backend/models/User.js` | Minor field changes |
| `backend/routes/booking.js` | Route additions both sides |
| `backend/routes/coupon.js` | Minor changes |
| `backend/middleware/uploadMiddleware.js` | Sahil rewrote |
| `backend/.env.example` | Sahil added vars |
| `frontend/.env.example` | Sahil added vars |
| `frontend/index.html` | Sahil updated |

### Suggested Merge Strategy for Overlaps

1. Start with our `main` as the base
2. Apply Groups 1-6 (clean imports) first
3. For Group 8, take our version for files we heavily reworked,
   and cherry-pick specific Sahil features we want
4. Run `npm run lint` after each group
5. Test the app after the merge is complete
