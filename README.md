# EduGuide — SkillBridge Career-Readiness Platform

> **"Bridge the gap between your skills and your career."**

EduGuide (SkillBridge) is a student career-readiness web platform designed to help students systematically move from academic aspirations to verified engineering job offers.

```
Career Goal → Skill Analysis → Skill Verification → Skill Gap → Learning → Projects → Job Matching
```

---

## Repository Structure

```text
EduGuide/
├── frontend/               # React + Vite + Tailwind CSS Frontend Application
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # Reusable layout, UI primitives, and domain components
│   │   ├── context/        # AuthContext, CareerContext
│   │   ├── data/mock/      # Backend-ready mock schemas and data
│   │   ├── pages/          # Landing, Auth, Onboarding, Dashboard, Roadmap, Skills, Assessments, etc.
│   │   ├── routes/         # App routing and ProtectedRoute guard
│   │   ├── services/api/   # Axios client and API service abstraction layer
│   │   └── utils/
│   ├── .env.example        # Environment variable templates
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Tech Stack

- **React.js 19**
- **Vite 8**
- **Tailwind CSS v4**
- **React Router v7**
- **Lucide React** (icons)
- **Recharts** (charts & data visualization)
- **Axios** (API client with interceptors)
- **React Hook Form** (form validation)

---

## Getting Started (Frontend)

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL` to your backend endpoint (defaults to internal mock mode with `VITE_USE_MOCK_DATA=true`).

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## Backend API Integration

The frontend uses an abstracted API service architecture under `frontend/src/services/api/`. When the backend team is ready:
1. Set `VITE_USE_MOCK_DATA=false` in `.env`.
2. Set `VITE_API_BASE_URL=https://<your-backend-api-url>`.
3. The built-in Axios interceptor will automatically attach `Authorization: Bearer <jwt-token>` to all authenticated requests.
