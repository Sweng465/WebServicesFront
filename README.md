# SalvageSearch — Frontend

A marketplace web application for buying and selling salvage vehicles and parts. Buyers can browse inventory, view business profiles, read reviews, and add items to a cart. Sellers can register a business and create vehicle or part listings.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
  - [Production Build](#production-build)
- [Docker](#docker)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Key Features](#key-features)

---

## Project Overview

SalvageSearch is a **React single-page application (SPA)** that serves as the front end for the SalvageSearch REST API. The application supports three user types:

| Role | Capabilities |
|------|-------------|
| **Guest** | Browse listings, view businesses and reviews, search vehicles/parts |
| **Buyer** | All guest actions + add items to cart, manage cart |
| **Seller** | All buyer actions + register a business, create/manage listings |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Browser (SPA)                   │
│                                                   │
│  React 19 + React Router v7                       │
│  ┌─────────────┐  ┌──────────────────────────┐   │
│  │  AuthContext │  │  Pages & Components      │   │
│  │  (JWT + RT) │  │  (TailwindCSS styling)   │   │
│  └──────┬──────┘  └────────────┬─────────────┘   │
│         │                      │                   │
│  ┌──────▼──────────────────────▼─────────────┐   │
│  │           src/config/api.js               │   │
│  │    (centralized API endpoint registry)    │   │
│  └──────────────────┬────────────────────────┘   │
└─────────────────────┼───────────────────────────┘
                       │  HTTP (Axios / fetch)
                       ▼
          ┌────────────────────────┐
          │   Backend REST API     │
          │  (VITE_API_URL)        │
          └────────────────────────┘
```

### Authentication Flow

- On sign-in the backend issues a short-lived **JWT access token** (stored in `localStorage`) and a **HttpOnly refresh token cookie**.
- `AuthProvider` automatically detects token expiry, calls `/api/auth/refresh`, and retries the original request — transparent to pages and components.
- Logging out calls `/api/auth/logout` to invalidate the refresh token cookie and clears the access token from local state.

> **Security note:** Storing the access token in `localStorage` makes it readable by any JavaScript running on the page. XSS defences (Content-Security-Policy, input sanitisation) are therefore important. A future improvement would be to store the access token in memory only, relying solely on the HttpOnly refresh-token cookie for session continuity.

### Routing

Routes are defined in `src/general/Router.jsx` using `react-router-dom`. Pages requiring authentication are wrapped with `ProtectedRoute` components that check the current `AuthContext` user state and redirect to `/sign-in` if unauthenticated.

### Cart

Cart contents are persisted per-user via browser cookies (`cart_<userId>`), so cart state survives page refreshes and browser restarts without any server-side storage. Cart cookies are set client-side and do not contain sensitive data — they hold only listing IDs and quantities.

### Maps

Business location pages display an interactive map powered by **Leaflet** with **OpenStreetMap** tiles. Addresses are geocoded on-demand using the free **Nominatim** API (no API key required).

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| UI Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite 7](https://vite.dev/) |
| Routing | [React Router DOM v7](https://reactrouter.com/) |
| Styling | [TailwindCSS v4](https://tailwindcss.com/) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Maps | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Dropdowns | [React-Select](https://react-select.com/) |
| Carousel | [React-Slick](https://react-slick.neostack.com/) |
| Error Boundaries | [react-error-boundary](https://github.com/bvaughn/react-error-boundary) |
| Linting | [ESLint 9](https://eslint.org/) |
| Code Formatting | [Prettier](https://prettier.io/) |
| Containerisation | [Docker](https://www.docker.com/) |
| CI/CD | GitHub Actions → Azure Web Apps |

---

## Getting Started

### Prerequisites

- **Node.js v22** (use [nvm](https://github.com/nvm-sh/nvm) — a `.nvmrc` file is included)
- **npm** (bundled with Node.js)

```bash
nvm install   # installs the version in .nvmrc
nvm use       # switches to v22
```

### Installation

```bash
git clone https://github.com/Sweng465/WebServicesFront.git
cd WebServicesFront
npm install
```

### Configuration

Copy the example environment file and update the values as needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of the backend REST API | `http://localhost:3000` |

> **Security note:** Never commit your `.env` file. It is listed in `.gitignore`.

### Running Locally

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will be available at **http://localhost:5173** by default.

The backend API must also be running (at the URL set in `VITE_API_URL`) for full functionality.

### Production Build

```bash
npm run build        # outputs optimised static files to dist/
npm run preview      # serves the dist/ folder locally to verify the build
```

### Linting

```bash
npm run check        # ESLint with zero-warnings policy
```

---

## Docker

Build and run the application in a container.

> **Important:** Because Vite bakes environment variables into the bundle **at build time**, `VITE_API_URL` must be supplied as a Docker build argument, not a runtime environment variable.

```bash
# Build image — pass the production API URL at build time
docker build --build-arg VITE_API_URL=https://your-api-url -t salvage-search .

# Run container (serves on port 3000)
docker run -p 3000:3000 salvage-search
```

The multi-stage `Dockerfile`:
1. **Builder stage** — installs dependencies and runs `npm run build` with the supplied `VITE_API_URL`
2. **Runtime stage** — serves the compiled `dist/` folder using [`serve`](https://github.com/vercel/serve) on port 3000

---

## Deployment

The project deploys automatically to **Azure Web Apps** via the included GitHub Actions workflow (`.github/workflows/main_salvagesearchweb.yml`).

**Trigger:** Push to the `main` branch

**Pipeline steps:**
1. Check out source code
2. Set up Node.js 22
3. `npm install && npm run build`
4. Upload build artifact
5. Authenticate with Azure (using OIDC — no long-lived credentials stored in the repo)
6. Deploy to the `SalvageSearchWeb` Azure Web App

Required GitHub secrets (set in repository Settings → Secrets):

| Secret | Purpose |
|--------|---------|
| `AZUREAPPSERVICE_CLIENTID_*` | Azure service principal client ID |
| `AZUREAPPSERVICE_TENANTID_*` | Azure AD tenant ID |
| `AZUREAPPSERVICE_SUBSCRIPTIONID_*` | Azure subscription ID |

These are referenced via `${{ secrets.* }}` and are **never stored in code or committed to the repository**.

---

## Project Structure

```
src/
├── main.jsx                # React entry point
├── App.jsx                 # Root component (Router + AuthProvider + Suspense)
├── index.css               # Global styles
├── assets/                 # Static images and icons
├── components/             # Reusable UI components
│   ├── forms/              # Form field components (address, bank, credit, phone)
│   ├── part/               # Part search and result card
│   └── vehicle/            # Vehicle search, result card, and vehicle card
├── config/
│   └── api.js              # Centralised API endpoint registry
├── context/
│   ├── AuthProvider.jsx    # JWT auth state, token refresh, cart state
│   └── useAuth.js          # useAuth hook for consuming AuthContext
├── general/
│   ├── Router.jsx          # Route definitions
│   ├── RoutePaths.jsx      # Route path constants
│   ├── Layout.jsx          # Page shell (header + outlet)
│   └── NotFound.jsx        # 404 page
├── pages/                  # Full-page route components
│   ├── Homepage.jsx
│   ├── SignIn.jsx / SignUp.jsx
│   ├── Profile.jsx / EditProfile.jsx
│   ├── BrowseVehicles.jsx / BrowseVehicleListings.jsx
│   ├── BrowseParts.jsx / BrowsePartListings.jsx
│   ├── VehicleListingDetails.jsx / PartListingDetails.jsx
│   ├── SellItems.jsx / SellerRegistration.jsx
│   ├── Businesses.jsx / BusinessDetails.jsx
│   ├── Reviews.jsx
│   └── ViewCart.jsx
├── utils/
│   └── cart.js             # Cookie-based per-user cart helpers
└── imageConversion/
    └── ImageConverter.js   # Base64 image encoding utility
```

---

## Key Features

- 🔍 **Vehicle search** — filter by year, make, model, and submodel
- 🔍 **Parts search** — filter by category, brand, and condition
- 🛒 **Shopping cart** — per-user persistence via browser cookies
- 🗺️ **Dealer map** — interactive Leaflet map with Nominatim geocoding (no API key required)
- 💼 **Business profiles** — listings, location map, and customer reviews
- 🔐 **JWT authentication** — silent token refresh keeps sessions alive without re-login
- 📱 **Responsive design** — TailwindCSS utility-first layout

