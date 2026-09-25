package com.skillbridge.common.seeder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.*;
import com.skillbridge.common.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CareerRoleRepository careerRoleRepository;
    private final CareerCompetencyRepository careerCompetencyRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository assessmentQuestionRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public DatabaseSeeder(UserRepository userRepository, StudentProfileRepository studentProfileRepository, CareerRoleRepository careerRoleRepository, CareerCompetencyRepository careerCompetencyRepository, SkillRepository skillRepository, StudentSkillRepository studentSkillRepository, AssessmentRepository assessmentRepository, AssessmentQuestionRepository assessmentQuestionRepository, CourseRepository courseRepository, ProjectRepository projectRepository, JobRepository jobRepository, PasswordEncoder passwordEncoder, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.careerRoleRepository = careerRoleRepository;
        this.careerCompetencyRepository = careerCompetencyRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentQuestionRepository = assessmentQuestionRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking SkillBridge Database Seed Status...");
        seedSkills();
        seedCareerRoles();
        seedAssessments();
        seedProjects();
        seedCourses();
        seedJobs();
        seedDemoUser();
        log.info("SkillBridge Database Initialization Complete!");
    }

    private void seedSkills() {
        if (skillRepository.count() >= 24) return;

        List<Skill> skills = Arrays.asList(
                Skill.builder().skillId("java").name("Java").category("Programming").description("Object-oriented programming language").build(),
                Skill.builder().skillId("python").name("Python").category("Programming").description("High-level interpreted language").build(),
                Skill.builder().skillId("javascript").name("JavaScript").category("Frontend").description("Web scripting language").build(),
                Skill.builder().skillId("typescript").name("TypeScript").category("Frontend").description("Typed JavaScript superset").build(),
                Skill.builder().skillId("react").name("React").category("Frontend").description("Frontend UI library").build(),
                Skill.builder().skillId("nextjs").name("Next.js").category("Frontend").description("React framework for SSR & full-stack apps").build(),
                Skill.builder().skillId("spring-boot").name("Spring Boot").category("Backend").description("Java microservice framework").build(),
                Skill.builder().skillId("rest-api").name("REST API").category("Backend").description("Web API architecture style").build(),
                Skill.builder().skillId("graphql").name("GraphQL").category("Backend").description("Query language for APIs").build(),
                Skill.builder().skillId("kafka").name("Apache Kafka").category("Backend").description("Distributed event streaming platform").build(),
                Skill.builder().skillId("sql").name("SQL").category("Database").description("Relational database query language").build(),
                Skill.builder().skillId("mysql").name("MySQL").category("Database").description("Relational database management system").build(),
                Skill.builder().skillId("postgresql").name("PostgreSQL").category("Database").description("Advanced open-source relational database").build(),
                Skill.builder().skillId("mongodb").name("MongoDB").category("Database").description("NoSQL document database").build(),
                Skill.builder().skillId("docker").name("Docker").category("Cloud").description("Containerization platform").build(),
                Skill.builder().skillId("kubernetes").name("Kubernetes").category("Cloud").description("Container orchestration platform").build(),
                Skill.builder().skillId("aws").name("AWS").category("Cloud").description("Amazon Web Services cloud platform").build(),
                Skill.builder().skillId("git").name("Git").category("DevOps").description("Distributed version control system").build(),
                Skill.builder().skillId("github").name("GitHub").category("DevOps").description("Code hosting & collaboration platform").build(),
                Skill.builder().skillId("machine-learning").name("Machine Learning").category("AI/ML").description("Predictive algorithms and models").build(),
                Skill.builder().skillId("tensorflow").name("TensorFlow").category("AI/ML").description("Open source machine learning framework").build(),
                Skill.builder().skillId("data-analysis").name("Data Analysis").category("Data").description("Data processing and visualization").build(),
                Skill.builder().skillId("cybersecurity").name("Cybersecurity").category("Cybersecurity").description("Network & application security").build(),
                Skill.builder().skillId("tailwind").name("Tailwind CSS").category("Frontend").description("Utility-first CSS framework").build()
        );

        for (Skill s : skills) {
            if (skillRepository.findBySkillId(s.getSkillId()).isEmpty()) {
                skillRepository.save(s);
            }
        }
        log.info("Seeded skills. Total in database: {}", skillRepository.count());
    }

    private void seedCareerRoles() {
        if (careerRoleRepository.count() >= 9) return;

        List<CareerRole> roles = Arrays.asList(
                CareerRole.builder().roleId("software-engineer").title("Software Engineer").category("Engineering").importance("High").requiredSkillsCount(8).description("Build scalable software systems").build(),
                CareerRole.builder().roleId("backend-developer").title("Backend Developer").category("Engineering").importance("High").requiredSkillsCount(7).description("Develop server-side REST APIs and database architectures").build(),
                CareerRole.builder().roleId("frontend-developer").title("Frontend Developer").category("Engineering").importance("High").requiredSkillsCount(6).description("Craft responsive user interfaces and modern web applications").build(),
                CareerRole.builder().roleId("devops-engineer").title("DevOps Engineer").category("Infrastructure").importance("High").requiredSkillsCount(7).description("Automate CI/CD pipelines and manage cloud container clusters").build(),
                CareerRole.builder().roleId("data-analyst").title("Data Analyst").category("Analytics").importance("Medium").requiredSkillsCount(5).description("Analyze business metrics and construct insight dashboards").build(),
                CareerRole.builder().roleId("data-scientist").title("Data Scientist").category("AI/Data").importance("High").requiredSkillsCount(6).description("Train predictive ML models and process big data").build(),
                CareerRole.builder().roleId("cloud-engineer").title("Cloud Engineer").category("Infrastructure").importance("High").requiredSkillsCount(6).description("Deploy and manage cloud infrastructure and microservices").build(),
                CareerRole.builder().roleId("cybersecurity-analyst").title("Cybersecurity Analyst").category("Security").importance("High").requiredSkillsCount(5).description("Monitor vulnerabilities and secure enterprise infrastructure").build(),
                CareerRole.builder().roleId("ai-engineer").title("AI / ML Engineer").category("AI/ML").importance("High").requiredSkillsCount(6).description("Design neural networks, LLM workflows, and intelligent automation systems").build()
        );
        
        for (CareerRole r : roles) {
            if (careerRoleRepository.findByRoleId(r.getRoleId()).isEmpty()) {
                careerRoleRepository.save(r);
            }
        }

        List<CareerCompetency> backendCompetencies = Arrays.asList(
                CareerCompetency.builder().roleId("backend-developer").skillId("java").skillName("Java").requiredLevel("Advanced").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("backend-developer").skillId("spring-boot").skillName("Spring Boot").requiredLevel("Intermediate").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("backend-developer").skillId("rest-api").skillName("REST API").requiredLevel("Advanced").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("backend-developer").skillId("sql").skillName("SQL").requiredLevel("Intermediate").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("backend-developer").skillId("mysql").skillName("MySQL").requiredLevel("Intermediate").importanceWeight(0.8).build(),
                CareerCompetency.builder().roleId("backend-developer").skillId("docker").skillName("Docker").requiredLevel("Intermediate").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("backend-developer").skillId("git").skillName("Git").requiredLevel("Intermediate").importanceWeight(0.8).build()
        );
        careerCompetencyRepository.saveAll(backendCompetencies);

        List<CareerCompetency> seCompetencies = Arrays.asList(
                CareerCompetency.builder().roleId("software-engineer").skillId("java").skillName("Java").requiredLevel("Advanced").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("software-engineer").skillId("python").skillName("Python").requiredLevel("Intermediate").importanceWeight(0.8).build(),
                CareerCompetency.builder().roleId("software-engineer").skillId("sql").skillName("SQL").requiredLevel("Intermediate").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("software-engineer").skillId("rest-api").skillName("REST API").requiredLevel("Intermediate").importanceWeight(1.0).build(),
                CareerCompetency.builder().roleId("software-engineer").skillId("docker").skillName("Docker").requiredLevel("Intermediate").importanceWeight(0.8).build(),
                CareerCompetency.builder().roleId("software-engineer").skillId("git").skillName("Git").requiredLevel("Intermediate").importanceWeight(0.8).build()
        );
        careerCompetencyRepository.saveAll(seCompetencies);

        log.info("Seeded career roles and competencies. Total roles: {}", careerRoleRepository.count());
    }

    private void seedAssessments() throws Exception {
        if (assessmentRepository.count() >= 5) return;

        if (assessmentRepository.count() == 0) {
            Assessment dockerAssessment = Assessment.builder()
                    .skillId("docker")
                    .title("Docker Fundamentals")
                    .description("Test your containerization knowledge, Dockerfiles, compose, and container networking.")
                    .questionCount(5)
                    .durationMinutes(15)
                    .difficulty("Intermediate")
                    .passScore(70)
                    .build();
            dockerAssessment = assessmentRepository.save(dockerAssessment);

            List<String> q1Opts = Arrays.asList("EXPOSE", "RUN", "COPY", "FROM");
            AssessmentQuestion q1 = AssessmentQuestion.builder()
                    .assessmentId(dockerAssessment.getId())
                    .questionText("Which Dockerfile instruction sets the base image for subsequent instructions?")
                    .optionsJson(objectMapper.writeValueAsString(q1Opts))
                    .correctOptionIndex(3)
                    .explanation("FROM specifies the base container image.")
                    .build();

            List<String> q2Opts = Arrays.asList("docker ps", "docker run", "docker images", "docker build");
            AssessmentQuestion q2 = AssessmentQuestion.builder()
                    .assessmentId(dockerAssessment.getId())
                    .questionText("Which command lists all currently running Docker containers?")
                    .optionsJson(objectMapper.writeValueAsString(q2Opts))
                    .correctOptionIndex(0)
                    .explanation("docker ps displays running containers.")
                    .build();

            assessmentQuestionRepository.saveAll(Arrays.asList(q1, q2));
        }

        Assessment sqlAssessment = Assessment.builder()
                .skillId("sql")
                .title("SQL & Relational Databases")
                .description("Test relational query knowledge, JOINs, indexing, and normalization.")
                .questionCount(5)
                .durationMinutes(15)
                .difficulty("Intermediate")
                .passScore(70)
                .build();
        sqlAssessment = assessmentRepository.save(sqlAssessment);

        List<String> sq1Opts = Arrays.asList("INNER JOIN", "GROUP BY", "WHERE", "HAVING");
        AssessmentQuestion sq1 = AssessmentQuestion.builder()
                .assessmentId(sqlAssessment.getId())
                .questionText("Which SQL clause filters aggregated data generated by GROUP BY?")
                .optionsJson(objectMapper.writeValueAsString(sq1Opts))
                .correctOptionIndex(3)
                .explanation("HAVING filters aggregated groups, whereas WHERE filters individual rows before grouping.")
                .build();
        assessmentQuestionRepository.save(sq1);

        Assessment javaAssessment = Assessment.builder()
                .skillId("java")
                .title("Java Fundamentals")
                .description("Evaluate core Java principles, OOP, collections, and multi-threading.")
                .questionCount(5)
                .durationMinutes(15)
                .difficulty("Intermediate")
                .passScore(70)
                .build();
        assessmentRepository.save(javaAssessment);

        Assessment springAssessment = Assessment.builder()
                .skillId("spring-boot")
                .title("Spring Boot Microservices")
                .description("Evaluate Spring IoC container, Dependency Injection, REST controllers, and JPA.")
                .questionCount(5)
                .durationMinutes(15)
                .difficulty("Advanced")
                .passScore(70)
                .build();
        assessmentRepository.save(springAssessment);

        log.info("Seeded assessments and questions. Total assessments: {}", assessmentRepository.count());
    }

    private void seedProjects() {
        if (projectRepository.count() >= 4) return;

        List<Project> projects = Arrays.asList(
                Project.builder()
                        .title("Containerized REST API")
                        .objective("Build and containerize a Spring Boot REST API backed by PostgreSQL.")
                        .skillsCovered("Docker, REST API, PostgreSQL")
                        .requirements("Implement CRUD endpoints, Dockerfile, and docker-compose.yml.")
                        .architecture("Spring Boot microservice containerized with Docker.")
                        .estimatedTime("6–8 hours")
                        .difficulty("Intermediate")
                        .evaluationCriteria("Clean API design, valid Dockerfile, healthy compose stack.")
                        .submissionRequirements("Public GitHub repository link containing source code.")
                        .build(),
                Project.builder()
                        .title("Student Career Management System")
                        .objective("Construct a Spring Boot application with JPA and authentication.")
                        .skillsCovered("Java, Spring Boot, MySQL, REST API")
                        .requirements("Implement user authentication and profile management endpoints.")
                        .architecture("Layered Spring Boot MVC/REST architecture.")
                        .estimatedTime("4–6 hours")
                        .difficulty("Beginner")
                        .evaluationCriteria("Passing unit tests and functional endpoints.")
                        .submissionRequirements("GitHub repository URL.")
                        .build(),
                Project.builder()
                        .title("Event-Driven Streaming Pipeline")
                        .objective("Build a real-time event processing pipeline using Spring Boot and Apache Kafka.")
                        .skillsCovered("Kafka, Spring Boot, Java, Microservices")
                        .requirements("Implement producers, consumers, and topic partitions.")
                        .architecture("Distributed event-driven architecture.")
                        .estimatedTime("8–10 hours")
                        .difficulty("Advanced")
                        .evaluationCriteria("High message throughput and robust error handling.")
                        .submissionRequirements("GitHub repository URL.")
                        .build(),
                Project.builder()
                        .title("Full-Stack Dashboard with React & Next.js")
                        .objective("Design a responsive full-stack analytics portal with JWT Auth.")
                        .skillsCovered("React, Next.js, TypeScript, REST API")
                        .requirements("Implement server-side rendering, responsive Tailwind CSS grid, and state management.")
                        .architecture("Next.js frontend connected to Spring Boot REST backend.")
                        .estimatedTime("8–12 hours")
                        .difficulty("Intermediate")
                        .evaluationCriteria("Responsive UI design and smooth state management.")
                        .submissionRequirements("GitHub repository URL & live Vercel demo link.")
                        .build()
        );

        projectRepository.saveAll(projects);
        log.info("Seeded projects. Total: {}", projectRepository.count());
    }

    private void seedCourses() {
        if (courseRepository.count() >= 4) return;

        List<Course> courses = Arrays.asList(
                Course.builder()
                        .title("Docker Mastery: Containerize Anything")
                        .platform("SkillBridge Academy")
                        .description("Comprehensive guide to containers, compose, and deployment.")
                        .duration("6 hours")
                        .difficulty("Intermediate")
                        .skillsCovered("Docker, DevOps")
                        .competenciesCovered("Containerization, Deployment")
                        .isFree(true)
                        .recommendationReason("Fills your critical Docker skill gap for Backend Developer role.")
                        .url("https://learning.skillbridge.internal/courses/docker-mastery")
                        .skillId("docker")
                        .build(),
                Course.builder()
                        .title("Spring Boot 3 & Spring Security Guide")
                        .platform("SkillBridge Academy")
                        .description("Master Java REST APIs, Spring Data JPA, and JWT Authentication.")
                        .duration("10 hours")
                        .difficulty("Intermediate")
                        .skillsCovered("Java, Spring Boot, REST API")
                        .competenciesCovered("Backend Development, API Design")
                        .isFree(true)
                        .recommendationReason("Recommended for elevating Spring Boot competency to Advanced.")
                        .url("https://learning.skillbridge.internal/courses/spring-boot-guide")
                        .skillId("spring-boot")
                        .build(),
                Course.builder()
                        .title("SQL & Database Architecture Masterclass")
                        .platform("SkillBridge Academy")
                        .description("Master relational queries, indexing strategies, transactions, and performance tuning.")
                        .duration("8 hours")
                        .difficulty("Intermediate")
                        .skillsCovered("SQL, MySQL, PostgreSQL")
                        .competenciesCovered("Database Design, Query Optimization")
                        .isFree(true)
                        .recommendationReason("Upgrades your PARTIAL SQL skill to VERIFIED status.")
                        .url("https://learning.skillbridge.internal/courses/sql-masterclass")
                        .skillId("sql")
                        .build(),
                Course.builder()
                        .title("Kubernetes for Cloud Developers")
                        .platform("SkillBridge Academy")
                        .description("Learn cluster management, pod deployments, services, ingress controllers, and Helm charts.")
                        .duration("12 hours")
                        .difficulty("Advanced")
                        .skillsCovered("Kubernetes, Docker, Cloud")
                        .competenciesCovered("Cloud Infrastructure, Orchestration")
                        .isFree(false)
                        .recommendationReason("Essential for Cloud and DevOps career tracks.")
                        .url("https://learning.skillbridge.internal/courses/k8s-cloud")
                        .skillId("kubernetes")
                        .build()
        );

        courseRepository.saveAll(courses);
        log.info("Seeded courses. Total: {}", courseRepository.count());
    }

    private void seedJobs() {
        if (jobRepository.count() >= 5) return;

        List<Job> jobs = Arrays.asList(
                Job.builder()
                        .jobTitle("Junior Backend Developer")
                        .company("TechCorp Solutions")
                        .location("Bengaluru, India")
                        .employmentType("Full-time")
                        .salary("₹8,00,000 - ₹12,00,000")
                        .requiredSkills("Java, Spring Boot, REST API, SQL, Docker")
                        .applicationUrl("https://careers.techcorp.example/jobs/101")
                        .remote(true)
                        .experienceLevel("Entry Level (0-2 yrs)")
                        .build(),
                Job.builder()
                        .jobTitle("Cloud Engineer Associate")
                        .company("CloudScale Systems")
                        .location("Hyderabad, India")
                        .employmentType("Full-time")
                        .salary("₹10,00,000 - ₹14,00,000")
                        .requiredSkills("Docker, AWS, Linux, Python")
                        .applicationUrl("https://careers.cloudscale.example/jobs/204")
                        .remote(false)
                        .experienceLevel("Associate")
                        .build(),
                Job.builder()
                        .jobTitle("Full-Stack Software Engineer")
                        .company("InnoTech Digital")
                        .location("Pune, India")
                        .employmentType("Full-time")
                        .salary("₹12,00,000 - ₹18,00,000")
                        .requiredSkills("Java, React, Spring Boot, TypeScript, REST API")
                        .applicationUrl("https://careers.innotech.example/jobs/305")
                        .remote(true)
                        .experienceLevel("Mid-Level (2-4 yrs)")
                        .build(),
                Job.builder()
                        .jobTitle("DevOps & Infrastructure Specialist")
                        .company("Nexus Infrastructure")
                        .location("Chennai, India")
                        .employmentType("Full-time")
                        .salary("₹14,00,000 - ₹20,00,000")
                        .requiredSkills("Kubernetes, Docker, AWS, Git, Kafka")
                        .applicationUrl("https://careers.nexus.example/jobs/409")
                        .remote(true)
                        .experienceLevel("Senior")
                        .build(),
                Job.builder()
                        .jobTitle("Data & Analytics Engineer")
                        .company("DataInsights Global")
                        .location("Mumbai, India")
                        .employmentType("Full-time")
                        .salary("₹9,00,000 - ₹13,00,000")
                        .requiredSkills("Python, SQL, Data Analysis, Machine Learning")
                        .applicationUrl("https://careers.datainsights.example/jobs/512")
                        .remote(false)
                        .experienceLevel("Associate")
                        .build()
        );

        jobRepository.saveAll(jobs);
        log.info("Seeded jobs. Total: {}", jobRepository.count());
    }

    private void seedDemoUser() {
        if (userRepository.existsByEmail("student@example.com")) return;

        User student = User.builder()
                .fullName("Sankari Ganeshan")
                .email("student@example.com")
                .password(passwordEncoder.encode("password123"))
                .role("ROLE_STUDENT")
                .build();
        student = userRepository.save(student);

        StudentProfile profile = StudentProfile.builder()
                .userId(student.getId())
                .fullName("Sankari Ganeshan")
                .email("student@example.com")
                .phone("+91 9876543210")
                .education("B.Tech Computer Science")
                .experienceLevel("Intermediate (1-2 years)")
                .targetRoleId("backend-developer")
                .targetRoleTitle("Backend Developer")
                .resumeUrl("https://skillbridge.internal/resumes/sankari_resume.pdf")
                .build();
        studentProfileRepository.save(profile);

        List<StudentSkill> studentSkills = Arrays.asList(
                StudentSkill.builder().userId(student.getId()).skillId("java").name("Java").category("Programming").level("Intermediate").status(SkillStatus.VERIFIED).score(85).evidenceCount(2).build(),
                StudentSkill.builder().userId(student.getId()).skillId("spring-boot").name("Spring Boot").category("Backend").level("Intermediate").status(SkillStatus.VERIFIED).score(80).evidenceCount(1).build(),
                StudentSkill.builder().userId(student.getId()).skillId("rest-api").name("REST API").category("Backend").level("Advanced").status(SkillStatus.VERIFIED).score(90).evidenceCount(3).build(),
                StudentSkill.builder().userId(student.getId()).skillId("sql").name("SQL").category("Database").level("Intermediate").status(SkillStatus.PARTIAL).score(65).evidenceCount(1).build(),
                StudentSkill.builder().userId(student.getId()).skillId("docker").name("Docker").category("Cloud").level("Beginner").status(SkillStatus.MISSING).score(0).evidenceCount(0).build()
        );
        studentSkillRepository.saveAll(studentSkills);

        log.info("Seeded demo user student@example.com with profile and student skills");
    }

}
