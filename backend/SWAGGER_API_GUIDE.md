# SkillBridge — Swagger OpenAPI Documentation Guide

This document explains how to view, test, and integrate with the **Swagger / OpenAPI 3.0 API Documentation** for the **SkillBridge** backend platform.

---

## 1. Accessing Interactive Swagger UI

When the backend application is running, the interactive Swagger UI interface is accessible in your browser at:

### **Unified Swagger UI (Port 8080)**
```text
http://localhost:8080/swagger-ui.html
```

### **Individual Microservices Swagger UIs**
| Service | Port | Interactive Swagger UI URL | OpenAPI JSON Endpoint |
| :--- | :---: | :--- | :--- |
| **Unified Application** | `8080` | `http://localhost:8080/swagger-ui.html` | `http://localhost:8080/v3/api-docs` |
| **Auth Service** | `8081` | `http://localhost:8081/swagger-ui.html` | `http://localhost:8081/v3/api-docs` |
| **Profile Service** | `8082` | `http://localhost:8082/swagger-ui.html` | `http://localhost:8082/v3/api-docs` |
| **Career Service** | `8083` | `http://localhost:8083/swagger-ui.html` | `http://localhost:8083/v3/api-docs` |
| **Skill Service** | `8084` | `http://localhost:8084/swagger-ui.html` | `http://localhost:8084/v3/api-docs` |
| **Evidence Service** | `8085` | `http://localhost:8085/swagger-ui.html` | `http://localhost:8085/v3/api-docs` |
| **Assessment Service** | `8086` | `http://localhost:8086/swagger-ui.html` | `http://localhost:8086/v3/api-docs` |
| **Learning Service** | `8087` | `http://localhost:8087/swagger-ui.html` | `http://localhost:8087/v3/api-docs` |
| **Project Service** | `8088` | `http://localhost:8088/swagger-ui.html` | `http://localhost:8088/v3/api-docs` |
| **Job Service** | `8089` | `http://localhost:8089/swagger-ui.html` | `http://localhost:8089/v3/api-docs` |
| **Portfolio Service** | `8090` | `http://localhost:8090/swagger-ui.html` | `http://localhost:8090/v3/api-docs` |
| **Notification Service** | `8091` | `http://localhost:8091/swagger-ui.html` | `http://localhost:8091/v3/api-docs` |
| **Analytics Service** | `8092` | `http://localhost:8092/swagger-ui.html` | `http://localhost:8092/v3/api-docs` |
| **Readiness Engine** | `8093` | `http://localhost:8093/swagger-ui.html` | `http://localhost:8093/v3/api-docs` |

---

## 2. Generated OpenAPI Specification File

The complete, machine-readable OpenAPI 3.0 specification has been exported and saved directly in the project repository at:

```text
backend/openapi-spec.json
```

### How to use `openapi-spec.json`:
1. **Postman**: Click **Import** $\rightarrow$ Select `backend/openapi-spec.json`. Postman will automatically generate a complete API Collection with pre-configured requests.
2. **Insomnia / Bruno**: Import `openapi-spec.json` directly into your workspace.
3. **Swagger Editor**: Paste the content into [editor.swagger.io](https://editor.swagger.io/) to render interactive documentation and client code generators.

---

## 3. Summary of API Endpoints by Service Tag

### 🔐 1. Authentication Service (`/api/auth`)
- `POST /api/auth/register` — Register new student account
- `POST /api/auth/login` — Authenticate user and issue JWT Bearer Token
- `GET /api/auth/me` — Fetch currently authenticated user
- `POST /api/auth/logout` — Revoke user session
- `POST /api/auth/refresh` — Refresh expired JWT token
- `POST /api/auth/forgot-password` — Password reset request (mocked)

### 👤 2. Profile Service (`/api/profile`)
- `GET /api/profile` — Get current student profile
- `PUT /api/profile` — Update profile metadata
- `POST /api/profile/resume` — Upload resume document & trigger skill extraction
- `POST /api/profile/certificates` — Add certificate evidence
- `GET /api/profile/evidence` — Fetch all student evidence
- `DELETE /api/profile/evidence/{id}` — Delete evidence entry

### 🎯 3. Career Service (`/api/careers`)
- `GET /api/careers` — List all target career roles (Software Engineer, Backend Dev, Data Analyst, etc.)
- `GET /api/careers/{roleId}` — Get detailed career role breakdown
- `GET /api/careers/{roleId}/competencies` — List required competencies & importance weights
- `GET /api/careers/{roleId}/roadmap` — Fetch career progression roadmap
- `POST /api/careers/target` — Set student's target career role

### 🧠 4. Skill Intelligence Service (`/api/skills`)
- `GET /api/skills` — List all system skills
- `GET /api/skills/{skillId}` — Get specific skill details
- `GET /api/skills/categories` — List 9 skill categories
- `GET /api/skills/search` — Search skills by keyword
- `GET /api/skills/student` — List current student's skills & verification statuses
- `GET /api/skills/student/{skillId}` — Get student's status for a specific skill

### 📄 5. Evidence Service (`/api/evidence`)
- `POST /api/evidence` — Submit new evidence item
- `GET /api/evidence` — Get all evidence for student
- `GET /api/evidence/{id}` — Get evidence details
- `GET /api/evidence/skill/{skillId}` — Get evidence associated with a skill
- `DELETE /api/evidence/{id}` — Delete evidence entry

### 📝 6. Assessment Service (`/api/assessments`)
- `GET /api/assessments` — List all available skill assessments
- `GET /api/assessments/{id}` — Get assessment details
- `POST /api/assessments/{id}/start` — Start assessment attempt
- `GET /api/assessments/{id}/questions` — Get MCQ questions for assessment
- `POST /api/assessments/{id}/submit` — Submit answers, grade attempt & trigger skill verification
- `GET /api/assessments/results/{resultId}` — Fetch specific assessment result
- `GET /api/assessments/history` — Get student's assessment attempt history

### 📚 7. Learning Service (`/api/learning`)
- `GET /api/learning` — List all learning tracks & courses
- `GET /api/learning/recommended` — Get personalized course recommendations based on skill gaps
- `GET /api/learning/{courseId}` — Get course details
- `GET /api/learning/skill/{skillId}` — Find courses covering a specific skill
- `POST /api/learning/{courseId}/progress` — Update student course progress

### 🛠️ 8. Project Service (`/api/projects`)
- `GET /api/projects` — List practical project ideas
- `GET /api/projects/recommended` — Get project recommendations based on verified competencies
- `GET /api/projects/{projectId}` — Get project requirements & architecture
- `POST /api/projects/{projectId}/start` — Start a project
- `PUT /api/projects/{projectId}/progress` — Update project completion progress
- `POST /api/projects/{projectId}/submit` — Submit project GitHub URL for evaluation
- `GET /api/projects/{projectId}/evaluation` — Get project evaluation score & feedback

### 💼 9. Job Service (`/api/jobs`)
- `GET /api/jobs` — List all job postings
- `GET /api/jobs/recommended` — Get job recommendations sorted by Competency Match %
- `GET /api/jobs/{jobId}` — Get job listing details
- `GET /api/jobs/{jobId}/match` — Calculate student's competency match percentage for job
- `GET /api/jobs/filters` — Filter jobs by role, remote, experience, salary

### 🎓 10. Portfolio / Skill Passport Service (`/api/portfolio`)
- `GET /api/portfolio` — Fetch current student's portfolio / skill passport
- `GET /api/portfolio/public/{username}` — Public view of student's verified skills & projects
- `PUT /api/portfolio` — Update portfolio bio & visibility
- `POST /api/portfolio/share` — Generate shareable public link

### 🔔 11. Notification Service (`/api/notifications`)
- `GET /api/notifications` — Fetch user notifications
- `PUT /api/notifications/{id}/read` — Mark notification as read
- `PUT /api/notifications/read-all` — Mark all notifications as read
- `GET /api/notifications/preferences` — Get notification settings
- `PUT /api/notifications/preferences` — Update notification preferences

### 📊 12. Analytics Service (`/api/analytics`)
- `GET /api/analytics/dashboard` — Unified dashboard endpoint supplying data for frontend widgets
- `GET /api/analytics/activity` — Timeline of student activities
- `GET /api/analytics/skill-progress` — Skill acquisition velocity over time
- `GET /api/analytics/career-progress` — Competency coverage progression over time

### ⚡ 13. Career Readiness & Skill Gap Engine (`/api/readiness`)
- `GET /api/readiness` — Calculate student's overall competency coverage % & formula explanation
- `GET /api/readiness/role/{roleId}` — Calculate readiness for a specific career role
- `GET /api/readiness/skills` — Get breakdown of verified, partial, and missing skills
- `GET /api/readiness/gaps` — Get prioritized skill gaps (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
- `GET /api/readiness/next-action` — Calculate student's Next Best Action
- `GET /api/readiness/recommendations` — Fetch courses & projects aligned with skill gaps

---

## 4. Authentication in Swagger UI

Private endpoints require JWT authorization:

1. Send a request to `POST /api/auth/login` (or `/api/auth/register`).
2. Copy the `token` string from the JSON response.
3. In Swagger UI ([http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)), click the **Authorize** button at the top right.
4. Enter `Bearer <YOUR_JWT_TOKEN>` into the Value field and click **Authorize**.
5. All requests sent through Swagger UI will now automatically include the `Authorization: Bearer <JWT_TOKEN>` header.
