# SkillBridge Backend — Career Readiness & Skill Intelligence Ecosystem

> Bridge the gap between your skills and your career.

SkillBridge backend is a comprehensive Spring Boot application designed to compute student skill intelligence, track verified vs. partial vs. missing skills, evaluate assessment tests, match job competencies, and calculate career readiness coverage.

---

## 1. Project Overview & Architecture

The system takes a student's resume, certificates, skills, projects, assessment results, and target career goals to compute:
* Current skills & verification status (`VERIFIED`, `PARTIAL`, `MISSING`, `CLAIMED`)
* Target career competency coverage percentage
* Prioritized skill gap analysis (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
* Tailored learning & project recommendations
* Job competency match percentages
* Next Best Action calculation

The architecture uses a clean layered pattern:
```text
Controller → Service → Repository → Entity → MySQL
```

---

## 2. Ports & Microservice Breakdown

Each service can run independently on its designated port:

| Service | Port | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Authentication Service** | `8081` | `/api/auth` | Register, login, JWT token issuance |
| **Profile Service** | `8082` | `/api/profile` | Profile updates, resume & certificate uploads |
| **Career Service** | `8083` | `/api/careers` | Career roles, competencies, roadmaps |
| **Skill Service** | `8084` | `/api/skills` | Skill taxonomy and student skill tracking |
| **Evidence Service** | `8085` | `/api/evidence` | Skill evidence records & verification |
| **Assessment Service** | `8086` | `/api/assessments` | Skill quizzes, scoring & automatic skill verification |
| **Learning Service** | `8087` | `/api/learning` | Recommended learning tracks for skill gaps |
| **Project Service** | `8088` | `/api/projects` | Practical projects & GitHub evaluation |
| **Job Service** | `8089` | `/api/jobs` | Job postings & competency match % |
| **Portfolio Service** | `8090` | `/api/portfolio` | Skill Passport portfolio & public link sharing |
| **Notification Service** | `8091` | `/api/notifications` | User notifications and preferences |
| **Analytics Service** | `8092` | `/api/analytics` | Unified dashboard data & activity log |
| **Readiness Engine Service** | `8093` | `/api/readiness` | **Core Intelligence Engine** |
| **Unified Single Server** | `8080` | `/*` | Combined single-process runner |

---

## 3. Database Setup

* **Database Engine**: MySQL
* **Database Name**: `skillbridge` (auto-created if not exists)
* **Default Username**: `root` (override with `DB_USERNAME`)
* **Default Password**: `qwerty` (override with `DB_PASSWORD`)
* **Hibernate Config**: `spring.jpa.hibernate.ddl-auto=update`

The application automatically creates all required tables and seeds default realistic development data upon startup.

---

## 4. How to Build & Run

### Prerequisites
* Java 17 or higher
* Apache Maven 3.8+
* MySQL running on `localhost:3306`

### Option A: Run Unified Server on Port 8080 (Recommended for easy local testing)
```bash
cd backend
mvn clean install
mvn spring-boot:run -pl skillbridge-runner
```

### Option B: Run Individual Microservices (Ports 8081 - 8093)
```bash
cd backend
mvn clean install

# Example: Run Auth Service (Port 8081)
mvn spring-boot:run -pl auth-service

# Example: Run Career Readiness Service (Port 8093)
mvn spring-boot:run -pl readiness-service
```

---

## 5. Swagger / OpenAPI Documentation

When any service is running, Swagger UI is available at:
* **Unified Runner (8080)**: `http://localhost:8080/swagger-ui/index.html`
* **Auth Service (8081)**: `http://localhost:8081/swagger-ui/index.html`
* **Readiness Service (8093)**: `http://localhost:8093/swagger-ui/index.html`

---

## 6. Core Readiness Algorithm Formula

The system uses a transparent, weighted calculation formula:

$$\text{Competency Coverage (\%)} = \left(\frac{\sum \text{Satisfied Competency Weights}}{\sum \text{Required Competency Weights}}\right) \times 100$$

* **VERIFIED Skill**: Weight factor = `1.0`
* **PARTIAL / CLAIMED Skill**: Weight factor = `0.5`
* **MISSING Skill**: Weight factor = `0.0`

> **Note**: This percentage represents **Competency Coverage**. It does **NOT** represent hiring or interview probability.

---

## 7. Service Abstractions

* `SkillExtractionService`: Abstracted skill extraction from resumes/certificates (Mock initial implementation, RAG/LLM ready).
* `JobProvider`: Abstracted external job board integration (Mock provider, LinkedIn & Naukri ready).
* `LearningProvider`: Abstracted course provider (Mock provider, LMS ready).
* `GitHubIntegrationService`: Abstracted GitHub repository submission and evaluation.

---

## 8. Running Backend Tests

```bash
cd backend
mvn test
```
