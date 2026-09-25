# SkillBridge Backend API Implementation Plan & Complete Specification

This document details all implemented REST API endpoints across the 13 microservices in the **SkillBridge** platform.

---

## Service Architecture & Port Matrix

| Service | Port | Base Path | Description |
| :--- | :---: | :--- | :--- |
| **Authentication Service** | `8081` | `/api/auth` | User registration, authentication, JWT tokens |
| **Profile Service** | `8082` | `/api/profile` | Student profile, resume, certificates & evidence |
| **Career Service** | `8083` | `/api/careers` | Career roles, required competencies, roadmaps |
| **Skill Service** | `8084` | `/api/skills` | Skill taxonomy, student skills, manual/auto verification |
| **Evidence Service** | `8085` | `/api/evidence` | Practical evidence records, portfolio evidence |
| **Assessment Service** | `8086` | `/api/assessments` | Quizzes, scoring, and automatic skill verification |
| **Learning Service** | `8087` | `/api/learning` | Recommended learning tracks aligned to skill gaps |
| **Project Service** | `8088` | `/api/projects` | Practical projects, GitHub repository evaluation |
| **Job Service** | `8089` | `/api/jobs` | Job listings and competency match calculation |
| **Portfolio Service** | `8090` | `/api/portfolio` | Skill Passport aggregation and public sharing |
| **Notification Service** | `8091` | `/api/notifications` | Notifications and user alert preferences |
| **Analytics Service** | `8092` | `/api/analytics` | Dashboard data, competency trends, timeline |
| **Readiness Service** | `8093` | `/api/readiness` | **Core Engine**: Readiness coverage, gaps, next action |

---

## Detailed API Endpoints Specification

### 1. Authentication Service (Port 8081) — Base `/api/auth`

#### `POST /api/auth/register`
* **Purpose**: Register a new student.
* **Auth**: Public.
* **Request Body**:
  ```json
  {
    "fullName": "Sankari Ganeshan",
    "email": "student@example.com",
    "password": "password123"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "userId": 1,
      "fullName": "Sankari Ganeshan",
      "email": "student@example.com",
      "token": "eyJhbGciOiJIUzI1NiJ9..."
    }
  }
  ```

#### `POST /api/auth/login`
* **Purpose**: Authenticate user and issue JWT token.
* **Auth**: Public.
* **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "password123"
  }
  ```

#### `GET /api/auth/me`
* **Purpose**: Get current logged-in user profile.
* **Auth**: Bearer JWT Token required.

#### `POST /api/auth/logout`
* **Purpose**: Logout session.

#### `POST /api/auth/refresh`
* **Purpose**: Refresh expired or expiring JWT token.

#### `POST /api/auth/forgot-password`
* **Purpose**: Mocked password reset link trigger.

---

### 2. Profile Service (Port 8082) — Base `/api/profile`

* `GET /api/profile` — Retrieve current student profile.
* `PUT /api/profile` — Update contact, target role, education.
* `POST /api/profile/resume` — Upload resume document for skill extraction.
* `POST /api/profile/certificates` — Upload certificate evidence.
* `GET /api/profile/evidence` — Retrieve all evidence records for profile.
* `DELETE /api/profile/evidence/{id}` — Delete evidence record.

---

### 3. Career Service (Port 8083) — Base `/api/careers`

* `GET /api/careers` — List all career roles (Software Engineer, Backend Developer, Data Analyst, Data Scientist, Cloud Engineer, Cybersecurity Analyst).
* `GET /api/careers/{roleId}` — Get details for a specific career role.
* `GET /api/careers/{roleId}/competencies` — List required competencies and weights for target role.
* `GET /api/careers/{roleId}/roadmap` — Retrieve structured learning roadmap stages.
* `POST /api/careers/target` — Set student's active target role goal.

---

### 4. Skill Service (Port 8084) — Base `/api/skills`

* `GET /api/skills` — Search and filter master skill catalog.
* `GET /api/skills/categories` — Get list of skill categories.
* `GET /api/skills/search` — Search skills by query.
* `GET /api/skills/{skillId}` — Get master skill details.
* `GET /api/skills/student` — Get authenticated student's tracked skills.
* `GET /api/skills/student/{skillId}` — Get specific student skill status (`VERIFIED`, `PARTIAL`, `MISSING`, `CLAIMED`).
* `POST /api/skills/{skillId}/verify` — Manually/automatically mark skill as verified.

---

### 5. Evidence & Verification Service (Port 8085) — Base `/api/evidence`

* `POST /api/evidence` — Create new evidence record (Resume, Certificate, Project, Assessment).
* `GET /api/evidence` — Get all user evidence items.
* `GET /api/evidence/{id}` — Get evidence details.
* `GET /api/evidence/skill/{skillId}` — Get evidence supporting a specific skill.
* `DELETE /api/evidence/{id}` — Remove evidence.

---

### 6. Assessment Service (Port 8086) — Base `/api/assessments`

* `GET /api/assessments` — List available skill assessments.
* `GET /api/assessments/{id}` — Get assessment meta.
* `POST /api/assessments/{id}/start` — Start assessment quiz session.
* `GET /api/assessments/{id}/questions` — Retrieve quiz questions.
* `POST /api/assessments/{id}/submit` — Submit answers, calculate score percentage, and automatically mark relevant skill as `VERIFIED` if pass score is met!
* `GET /api/assessments/results/{resultId}` — Get detailed attempt result.
* `GET /api/assessments/history` — Get student assessment history.

---

### 7. Learning Service (Port 8087) — Base `/api/learning`

* `GET /api/learning` — List all learning courses.
* `GET /api/learning/recommended` — Get learning recommendations targeting missing/partial skills.
* `GET /api/learning/{courseId}` — Get course details.
* `GET /api/learning/skill/{skillId}` — Get courses covering a specific skill.
* `POST /api/learning/{courseId}/progress` — Update course completion percentage.

---

### 8. Project Service (Port 8088) — Base `/api/projects`

* `GET /api/projects` — List practical projects.
* `GET /api/projects/recommended` — Get recommended projects for target role.
* `GET /api/projects/{projectId}` — Get project requirements and evaluation criteria.
* `POST /api/projects/{projectId}/start` — Initialize project progress.
* `PUT /api/projects/{projectId}/progress` — Update project progress.
* `POST /api/projects/{projectId}/submit` — Submit GitHub repo URL for automated evaluation.
* `GET /api/projects/{projectId}/evaluation` — View evaluation score and feedback.

---

### 9. Job Service (Port 8089) — Base `/api/jobs`

* `GET /api/jobs` — Get job postings.
* `GET /api/jobs/recommended` — Get jobs ranked by Competency Match Percentage.
* `GET /api/jobs/{jobId}` — Get job details.
* `GET /api/jobs/{jobId}/match` — Calculate exact competency match % for job requirements.
* `GET /api/jobs/filters` — Get search filter options.

---

### 10. Portfolio / Skill Passport Service (Port 8090) — Base `/api/portfolio`

* `GET /api/portfolio` — Get aggregated Skill Passport data.
* `GET /api/portfolio/public/{username}` — Public Skill Passport endpoint.
* `PUT /api/portfolio` — Update bio and visibility.
* `POST /api/portfolio/share` — Generate share token and link.

---

### 11. Notification Service (Port 8091) — Base `/api/notifications`

* `GET /api/notifications` — List in-app notifications.
* `PUT /api/notifications/{id}/read` — Mark notification as read.
* `PUT /api/notifications/read-all` — Mark all notifications as read.
* `GET /api/notifications/preferences` — Get notification alert settings.
* `PUT /api/notifications/preferences` — Update notification preferences.

---

### 12. Analytics Service (Port 8092) — Base `/api/analytics`

* `GET /api/analytics/dashboard` — Complete unified dashboard payload for frontend.
* `GET /api/analytics/activity` — Timeline of recent user actions.
* `GET /api/analytics/skill-progress` — Skill distribution metrics.
* `GET /api/analytics/career-progress` — Readiness coverage history over time.

---

### 13. Career Readiness / Skill Gap Engine Service (Port 8093) — Base `/api/readiness`

* `GET /api/readiness` — Full career readiness analysis for current target role.
* `GET /api/readiness/role/{roleId}` — Career readiness analysis for specified role.
* `GET /api/readiness/skills` — Skill status breakdown (`VERIFIED`, `PARTIAL`, `MISSING`).
* `GET /api/readiness/gaps` — Prioritized skill gap list (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
* `GET /api/readiness/next-action` — Calculates Next Best Action for student.
* `GET /api/readiness/recommendations` — Recommended courses and projects.

---

## Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Request successful"
}
```

**Error:**
```json
{
  "success": false,
  "data": null,
  "message": "Skill not found with ID: docker",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```
