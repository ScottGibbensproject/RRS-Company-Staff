# RRS Website Projects Summary

Technical documentation for project handoff and management.

---

## Overview

| Website | Project Folder | Hosting | Purpose |
|---------|----------------|---------|---------|
| **myrateremover.com** | `rate-remover-software-new-website` | Siteground (hybrid React + WordPress) | General/software landing site |
| **shoprateremover.com** | `rate-remover-auto-repair-website` | Firebase Hosting | Auto repair industry vertical |

Both sites use React 19 + TypeScript + Vite + Tailwind CSS for the frontend.

---

## myrateremover.com

### Project Location
```
C:\Users\scott\Desktop\rate-remover-software-new-website
```

### Hosting (Hybrid Setup)

**Moved to Siteground on 1/11/2026**

| Service | Details |
|---------|---------|
| Platform | **Siteground** (as of 1/11/2026) |
| Previous Host | Firebase Hosting (`rate-remover-general-website`) |
| Architecture | **Hybrid: React + WordPress** |

### Hybrid Architecture

The site uses a **hybrid approach**:
- **New React pages**: Most landing pages use the new React/Vite build
- **WordPress pages**: Some pages still run on WordPress (needed for WooCommerce)

**Why WordPress is retained:**
- WooCommerce integration for SaaS subscription billing
- Existing checkout/payment flows

### Tech Stack (React Portion)
| Technology | Version |
|------------|---------|
| React | 19.0.0 |
| TypeScript | ~5.7.2 |
| Vite | 6.2.0 |
| Tailwind CSS | 4.0.12 |
| React Router | 7.2.0 |

### Tech Stack (WordPress Portion)
| Technology | Purpose |
|------------|---------|
| WordPress | CMS for legacy pages |
| WooCommerce | Subscription/payment processing |

### Repository
| Field | Value |
|-------|-------|
| Remote | `https://github.com/ScottGibbensproject/General-Version-Website.git` |
| Branch | `main` |

### Domain Configuration
- Domain DNS managed through Siteground
- Hybrid routing: some paths serve React build, others serve WordPress

### Project Structure
```
src/
├── components/          # 13 reusable UI components
│   ├── ChatBot.tsx     # Gemini AI chatbot
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── PricingSection.tsx
│   └── ...
├── pages/              # 21 page components
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Pricing.tsx
│   ├── states/         # State-specific landing pages
│   └── ...
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API for chatbot |

### Build Commands
```bash
npm install          # Install dependencies
npm run dev          # Local development (port 5173)
npm run build        # Production build to /dist
npm run preview      # Preview production build
```

### Deployment
**React build deployment to Siteground:**
```bash
npm run build
# Upload /dist folder contents to Siteground via FTP or File Manager
```

**WordPress changes:** Edit directly in WordPress admin or via Siteground File Manager

### Key Features
- 118 unique URL routes mapped (React portion)
- State-specific landing pages (all 50 states)
- Gemini AI chatbot integration
- WooCommerce for subscription payments
- Responsive design with Tailwind CSS

---

## shoprateremover.com

### Project Location
```
C:\Users\scott\Desktop\rate-remover-auto-repair-website
```

### Tech Stack
| Technology | Version |
|------------|---------|
| React | 19.0.0 |
| TypeScript | ~5.7.2 |
| Vite | 6.2.0 |
| Tailwind CSS | 4.0.17 |
| React Router | 7.3.0 |

### Hosting
| Service | Details |
|---------|---------|
| Platform | Firebase Hosting |
| Project ID | `rate-remover-software-website` |
| Site | `rate-remover-software-website` |
| Region | US (default) |

### Repository
| Field | Value |
|-------|-------|
| Remote | GitHub (via CI/CD) |
| Branch | `main` |

### Domain Configuration
| Type | Domain |
|------|--------|
| Custom Domain | `shoprateremover.com` |
| Firebase Default | `rate-remover-software-website.web.app` |

### CI/CD Pipeline
**Automated deployment via GitHub Actions**

File: `.github/workflows/firebase-hosting-merge.yml`

Triggers on push to `main` branch:
1. Checks out code
2. Installs dependencies (`npm ci`)
3. Builds project (`npm run build`)
4. Deploys to Firebase Hosting

### Project Structure
```
src/
├── components/          # 12 reusable UI components
│   ├── BlogCard.tsx
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── PricingCard.tsx
│   └── ...
├── pages/              # 20 page components
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── blog/           # 8 blog post pages
│   └── ...
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

### Analytics & Tracking
| Service | Implementation |
|---------|----------------|
| Firebase Analytics | Built-in with hosting |
| Meta Pixel | Integrated for Facebook ads |

### Build Commands
```bash
npm install          # Install dependencies
npm run dev          # Local development (port 5173)
npm run build        # Production build to /dist
npm run preview      # Preview production build
```

### Deployment
**Option 1: Automatic (Recommended)**
```bash
git add .
git commit -m "your changes"
git push origin main
# GitHub Actions automatically deploys
```

**Option 2: Manual**
```bash
npm run build
firebase deploy --only hosting
```

### Key Features
- Auto repair industry focused content
- 8 blog posts for SEO
- Contact form integration
- Meta Pixel tracking for ads
- Responsive design

---

## Firebase CLI Setup (shoprateremover.com only)

**Note:** myrateremover.com moved to Siteground on 1/11/2026. Only shoprateremover.com uses Firebase.

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Select project (run from project folder)
firebase use rate-remover-software-website   # for shoprateremover.com
```

### Firebase Console Access
- **shoprateremover.com**: [Firebase Console - rate-remover-software-website](https://console.firebase.google.com/project/rate-remover-software-website)

### Siteground Access (myrateremover.com)
- Login: Siteground control panel
- Manage: WordPress admin, File Manager, or FTP

---

## Common Maintenance Tasks

### Update Content
1. Edit relevant `.tsx` files in `src/pages/` or `src/components/`
2. Test locally with `npm run dev`
3. Deploy (push to main or manual deploy)

### Add New Page
1. Create new component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Header.tsx` if needed

### Update Dependencies
```bash
npm update              # Update to latest compatible versions
npm outdated            # Check for outdated packages
```

### Check Build Issues
```bash
npm run build           # Will show TypeScript/build errors
```

---

## Contact & Access

| Resource | Site | Contact |
|----------|------|---------|
| GitHub | Both | Scott Gibbens |
| Firebase Console | shoprateremover.com | Scott Gibbens |
| Siteground | myrateremover.com | Scott Gibbens |
| WordPress Admin | myrateremover.com | Scott Gibbens |

---

*Last Updated: January 2026*
