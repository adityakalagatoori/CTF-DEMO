# CTF Workshop Platform

A complete full-stack Capture The Flag (CTF) platform for cybersecurity education. Built with React, Node.js/Express, and Supabase PostgreSQL.

## 🎯 Features

- **Student Registration**: Students can register and join the competition
- **Real-time Leaderboard**: Live leaderboard with 2-second polling updates
- **Flag Submission**: Students find hidden flags and submit them for scoring
- **Admin Dashboard**: Complete control over challenge status, statistics, and leaderboard
- **Mobile Responsive**: Dark hacker aesthetic, fully responsive design
- **Session Persistence**: localStorage fallback if connection drops

## 🏗️ Architecture

### Frontend (React + Vite)
- Landing page with registration
- Challenge page with flag submission
- Admin dashboard
- Real-time leaderboard component
- Mobile-first responsive design

### Backend (Node.js + Express)
- REST API on port 5000
- Supabase PostgreSQL database integration
- Admin authentication with password
- CORS enabled for frontend

### Database (Supabase PostgreSQL)
- `students` table: Stores registration, flag status, solve time
- `settings` table: Challenge unlock status and correct flag

## 🚀 Deployment Setup

### Step 1: Supabase Database (Do This First)

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for free account
3. Create new project
4. Wait for project initialization
5. Go to **SQL Editor**
6. Copy and run all SQL from `SQL_SETUP.sql`
7. Go to **Settings → API**
8. Copy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Step 2: Backend Setup (Render)

#### Local Testing First:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with:
# SUPABASE_URL=<from step 1>
# SUPABASE_ANON_KEY=<from step 1>
# ADMIN_PASSWORD=admin123
# FRONTEND_URL=http://localhost:5173
npm run dev
```

#### Deploy to Render:
1. Push backend to your GitHub repo
2. Go to [https://render.com](https://render.com)
3. Click **New → Web Service**
4. Connect your GitHub account
5. Select your repo
6. Configure:
   - **Name**: ctf-workshop-backend
   - **Root directory**: backend
   - **Build command**: `npm install`
   - **Start command**: `npm start`
7. Add Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD=admin123`
   - `FRONTEND_URL` (you'll update this after Vercel deployment)
   - `NODE_ENV=production`
8. Deploy
9. Copy your backend URL (e.g., `https://ctf-workshop-backend.onrender.com`)

### Step 3: Frontend Setup (Vercel)

#### Local Testing First:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with:
# VITE_BACKEND_URL=http://localhost:5000
npm run dev
# Open http://localhost:5173
```

#### Deploy to Vercel:
1. Push frontend to your GitHub repo
2. Go to [https://vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your repo
5. Configure:
   - **Framework**: Vite
   - **Root directory**: frontend
   - **Build command**: `npm run build`
   - **Output directory**: dist
6. Add Environment Variable:
   - `VITE_BACKEND_URL=https://your-render-backend-url`
7. Deploy
8. Copy your frontend URL (e.g., `https://your-project.vercel.app`)

### Step 4: Update Backend CORS

1. Go back to Render
2. Update environment variable:
   - `FRONTEND_URL=https://your-frontend.vercel.app`

## 📊 Database Schema

### students table
```
id           UUID (Primary Key)
name         VARCHAR(50) UNIQUE NOT NULL
registered_at TIMESTAMP DEFAULT NOW()
flag_found   BOOLEAN DEFAULT FALSE
solved_time  TIMESTAMP (NULL if not solved)
submission_time_seconds INTEGER (solve duration in seconds)
created_at   TIMESTAMP DEFAULT NOW()
```

### settings table
```
id              UUID (Primary Key)
challenge_unlocked BOOLEAN DEFAULT FALSE
correct_flag    VARCHAR(100) DEFAULT 'BIOMOLECLUESS'
updated_at      TIMESTAMP DEFAULT NOW()
```

## 🔌 API Endpoints

### Student Routes
- `POST /api/students/register` - Register new student
  - Body: `{ name: string }`
  - Response: `{ studentId, name, registeredAt }`

- `POST /api/students/:id/submit-flag` - Submit flag
  - Body: `{ flag: string }`
  - Response: `{ success: boolean, message: string, submissionTime: number }`

- `GET /api/students` - Get all students

### Leaderboard
- `GET /api/leaderboard` - Get real-time leaderboard
  - Response: `[{ rank, name, flagFound, solvedTime, submissionTime, registeredAt }]`

### Challenge
- `GET /api/challenge/status` - Get challenge unlock status
  - Response: `{ unlocked: boolean }`

### Admin Routes (requires Authorization: Bearer <password>)
- `POST /api/admin/unlock` - Unlock challenge
- `POST /api/admin/lock` - Lock challenge
- `POST /api/admin/reset` - Reset all student data
- `GET /api/admin/stats` - Get admin statistics

## 🧪 Testing Checklist

- ✅ Student registration works
- ✅ Leaderboard updates every 2 seconds
- ✅ Admin login works (password: admin123)
- ✅ Unlock challenge changes status instantly
- ✅ Flag submission works (case-insensitive)
- ✅ Wrong flag shows error message
- ✅ Correct flag shows success + rank
- ✅ Mobile responsive on phones
- ✅ Real-time updates without page refresh
- ✅ Admin reset clears all data

## 🎓 The Challenge

Students must:
1. Open the Challenge page
2. Right-click → Inspect Element
3. Look through the HTML source code
4. Find the hidden flag: **BIOMOLECLUESS**
5. Submit it to capture the flag

### Hidden Flag Location (in frontend HTML)
Add a comment in the HTML:
```html
<!-- Secret flag: BIOMOLECLUESS -->
```

Or in JavaScript:
```javascript
// Flag: BIOMOLECLUESS
const SECRET = 'BIOMOLECLUESS'
```

Or in meta tags:
```html
<meta name="flag" content="BIOMOLECLUESS" />
```

## 💾 Cost Breakdown

- **Vercel**: FREE (100GB/month bandwidth)
- **Render**: FREE (750 hours/month)
- **Supabase**: FREE (up to 500MB, 2GB bandwidth)
- **Total**: $0

## 🔐 Admin Password

Default: `admin123`

Change in `.env`:
```
ADMIN_PASSWORD=your-secure-password
```

## 🛠️ Local Development

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### Testing
1. Open http://localhost:5173
2. Register a student
3. Go to admin panel (password: admin123)
4. Unlock challenge
5. Submit flag: BIOMOLECLUESS

## 📚 File Structure

```
ctf-workshop/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Challenge.jsx
│   │   │   └── Admin.jsx
│   │   ├── components/
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Header.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── routes/
│   │   ├── students.js
│   │   ├── leaderboard.js
│   │   ├── admin.js
│   │   └── challenge.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   └── errorHandler.js
│   ├── db/
│   │   └── supabase.js
│   ├── server.js
│   └── package.json
├── SQL_SETUP.sql
└── README.md
```

## 🚨 Troubleshooting

### Backend won't connect to Supabase
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Ensure Supabase project is active
- Check database tables exist (run SQL_SETUP.sql)

### Frontend can't reach backend
- Check `VITE_BACKEND_URL` in frontend `.env`
- Ensure backend is running
- Check CORS settings in backend `server.js`
- Verify `FRONTEND_URL` in backend `.env`

### Admin login fails
- Check `ADMIN_PASSWORD` in backend `.env`
- Ensure it matches frontend request

### Leaderboard not updating
- Check network tab in browser DevTools
- Verify API endpoint is responding: GET `/api/leaderboard`
- Check backend logs for errors

## 📝 Notes

- Flag is case-insensitive (handled by backend)
- Solve time is calculated from registration to flag submission
- Leaderboard sorted by flag status, then by solve time
- Admin can unlock/lock/reset at any time
- All data persists in Supabase (no data loss on restart)

## 🤝 Support

If you encounter issues:
1. Check the README section
2. Check backend logs: `npm run dev`
3. Check browser console and Network tab
4. Check Supabase dashboard for database issues

---

**Ready to deploy!** 🚀
