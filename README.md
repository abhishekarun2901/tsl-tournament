# Thekkinkad Super League (TSL)

A professional football tournament website with live score updates, built with React + Vite + Tailwind CSS frontend and Node.js + Express + MongoDB backend.

![TSL Logo](./frontend/public/favicon.svg)

## Features

### Public Website
- 🏠 **Landing Page** - Hero section, live matches, today's fixtures, upcoming matches
- 📅 **Fixtures** - Complete schedule grouped by matchday
- 📊 **Points Table** - Auto-calculated standings with position indicators
- 👥 **Teams** - All teams with detailed squad information
- ⚽ **Top Scorers** - Golden Boot leaderboard
- 🔄 **Live Updates** - Auto-refresh every 10 seconds

### Hidden Organizer Page (`/update-tournament`)
- Secret key authentication
- Update match scores
- Add goal scorers with minute
- Change match status (upcoming/live/finished)
- Auto-recalculate standings

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: Secret key based (no login UI)

## Project Structure

```
TSLv1/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeder
│   └── .env.example     # Environment template
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom React hooks
    │   └── services/    # API services
    ├── tailwind.config.js
    └── .env.example
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### 1. Clone and Setup

```bash
cd TSLv1
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and admin secret
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/tsl
ADMIN_SECRET=your-secret-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database

```bash
npm run seed
```

This creates:
- 8 teams (4 in Pool A, 4 in Pool B)
- 56 players
- 9 fixtures
- Initial standings

### 4. Start Backend

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file (optional - uses proxy in dev)
cp .env.example .env
```

### 6. Start Frontend

```bash
npm run dev
```

App runs on `http://localhost:5173`

## API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get all teams |
| GET | `/api/teams/:id` | Get team with players |
| GET | `/api/matches` | Get all matches |
| GET | `/api/matches/live` | Get live matches |
| GET | `/api/standings` | Get points table |
| GET | `/api/players` | Get all players |
| GET | `/api/topscorers` | Get top scorers |

### Admin Routes (require `x-admin-secret` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/verify` | Verify secret key |
| POST | `/api/admin/team` | Create team |
| POST | `/api/admin/player` | Create player |
| POST | `/api/admin/match` | Create match |
| PATCH | `/api/admin/match/:id/status` | Update match status |
| PATCH | `/api/admin/match/:id/score` | Update score |
| POST | `/api/admin/match/:id/goal` | Add goal scorer |

## Deployment

### Deploy Backend to Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `ADMIN_SECRET`
   - `FRONTEND_URL` (your Vercel URL)

### Deploy Frontend to Vercel

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`

## Teams in Tournament

### Pool A
- Liverpool FC (Manager: Amal Sidhan)
- Inter Milan (Manager: Sarang)
- Fiorentina (Manager: Abdul Majeed)
- Lazio (Manager: Sanin)

### Pool B
- Arsenal (Manager: Jithin B)
- Força FC (Manager: Arun Vellodan)
- São Paulo FC (Manager: Akash)
- AS Monaco (Manager: Shyam)

## Points System

- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

**Tiebreaker Order**:
1. Points
2. Goal Difference
3. Goals For
4. Head-to-Head

## License

© 2024 Thekkinkad Super League. All rights reserved.
