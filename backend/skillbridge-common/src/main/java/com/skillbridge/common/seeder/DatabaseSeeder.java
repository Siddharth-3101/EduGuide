package com.skillbridge.common.seeder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.*;
import com.skillbridge.common.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

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
    private final PathwayRepository pathwayRepository;
    private final RoadmapStageRepository roadmapStageRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public DatabaseSeeder(UserRepository userRepository,
                          StudentProfileRepository studentProfileRepository,
                          CareerRoleRepository careerRoleRepository,
                          CareerCompetencyRepository careerCompetencyRepository,
                          SkillRepository skillRepository,
                          StudentSkillRepository studentSkillRepository,
                          AssessmentRepository assessmentRepository,
                          AssessmentQuestionRepository assessmentQuestionRepository,
                          CourseRepository courseRepository,
                          ProjectRepository projectRepository,
                          JobRepository jobRepository,
                          PathwayRepository pathwayRepository,
                          RoadmapStageRepository roadmapStageRepository,
                          PasswordEncoder passwordEncoder,
                          ObjectMapper objectMapper) {
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
        this.pathwayRepository = pathwayRepository;
        this.roadmapStageRepository = roadmapStageRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking SkillBridge Database Seed Status...");
        seedCanonicalSkills();
        seedCareerRolesAndPathways();
        seedAssessments();
        seedProjects();
        seedCourses();
        seedJobs();
        seedDemoUser();
        log.info("SkillBridge Database Initialization Complete!");
    }

    private void seedCanonicalSkills() {
        if (skillRepository.count() >= 222) {
            log.info("Skills already seeded: {}", skillRepository.count());
            return;
        }

        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("data/skillsync_skill_dataset_enriched.csv");
            if (is == null) {
                log.warn("Could not find data/skillsync_skill_dataset_enriched.csv on classpath. Seeding baseline skills.");
                seedBaselineSkills();
                return;
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                String header = reader.readLine(); // skip header
                String line;
                int count = 0;
                while ((line = reader.readLine()) != null) {
                    if (line.trim().isEmpty()) continue;
                    List<String> parts = parseCsvLine(line);
                    if (parts.size() >= 7) {
                        String skillId = parts.get(0).trim();
                        String skillName = parts.get(1).trim();
                        String category = parts.get(2).trim();
                        String description = parts.get(5).trim();
                        String aliases = parts.get(6).trim();

                        if (skillRepository.findBySkillId(skillId).isEmpty()) {
                            Skill skill = Skill.builder()
                                    .skillId(skillId)
                                    .name(skillName)
                                    .category(category)
                                    .description(description)
                                    .tier(2)
                                    .aliases(aliases)
                                    .build();
                            skillRepository.save(skill);
                            count++;
                        }
                    }
                }
                log.info("Successfully seeded {} canonical skills from CSV. Total: {}", count, skillRepository.count());
            }
        } catch (Exception e) {
            log.error("Failed to seed skills from CSV: {}", e.getMessage(), e);
            seedBaselineSkills();
        }
    }

    private void seedBaselineSkills() {
        List<Skill> fallback = Arrays.asList(
                Skill.builder().skillId("SKL-0011").name("Java").category("Programming").aliases("java;core java").build(),
                Skill.builder().skillId("SKL-0012").name("Python").category("Programming").aliases("python;python3").build(),
                Skill.builder().skillId("SKL-0013").name("JavaScript").category("Frontend").aliases("javascript;js").build(),
                Skill.builder().skillId("SKL-0014").name("TypeScript").category("Frontend").aliases("typescript;ts").build(),
                Skill.builder().skillId("SKL-0027").name("React").category("Frontend").aliases("react;reactjs").build(),
                Skill.builder().skillId("SKL-0030").name("Next.js").category("Frontend").aliases("nextjs;next.js").build(),
                Skill.builder().skillId("SKL-0039").name("Spring Boot").category("Backend").aliases("spring-boot;spring boot").build(),
                Skill.builder().skillId("SKL-0041").name("REST API").category("Backend").aliases("rest-api;rest api").build(),
                Skill.builder().skillId("SKL-0047").name("SQL").category("Database").aliases("sql").build(),
                Skill.builder().skillId("SKL-0049").name("PostgreSQL").category("Database").aliases("postgresql;postgres").build(),
                Skill.builder().skillId("SKL-0114").name("Docker").category("Cloud").aliases("docker;containers").build(),
                Skill.builder().skillId("SKL-0097").name("Amazon Web Services").category("Cloud").aliases("aws;amazon web services").build()
        );
        for (Skill s : fallback) {
            if (skillRepository.findBySkillId(s.getSkillId()).isEmpty()) {
                skillRepository.save(s);
            }
        }
    }

    private void seedCareerRolesAndPathways() {
        if (careerRoleRepository.count() >= 10 && pathwayRepository.count() >= 15) {
            log.info("Career roles and pathways already seeded.");
            return;
        }

        Map<String, String> roleMapping = Map.of(
                "CAR-AI-ENG", "ai-engineer",
                "CAR-AWS-CLD", "cloud-engineer",
                "CAR-BACKEND", "backend-developer",
                "CAR-BLOCKCHAIN", "blockchain-developer",
                "CAR-CYBERSEC", "cybersecurity-analyst",
                "CAR-DATA-ANALYST", "data-analyst",
                "CAR-DEVOPS", "devops-engineer",
                "CAR-FRONTEND", "frontend-developer",
                "CAR-FULLSTACK", "fullstack-developer",
                "CAR-IOS", "ios-developer"
        );

        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("data/structured_roadmaps.json");
            if (is == null) {
                log.warn("Could not find data/structured_roadmaps.json on classpath.");
                return;
            }

            JsonNode root = objectMapper.readTree(is);
            if (root.isArray()) {
                for (JsonNode careerNode : root) {
                    String careerId = careerNode.path("career_id").asText();
                    String careerName = careerNode.path("career_name").asText();
                    String category = careerNode.path("category").asText("Engineering");
                    String description = careerNode.path("description").asText();
                    String sourcePdf = careerNode.path("provenance").path("source").asText(careerId.toLowerCase() + ".pdf");
                    String roleSlug = roleMapping.getOrDefault(careerId, careerId.toLowerCase());

                    CareerRole role = careerRoleRepository.findByRoleId(roleSlug)
                            .orElseGet(() -> CareerRole.builder()
                                    .roleId(roleSlug)
                                    .careerDomainId(careerId)
                                    .sourcePdf(sourcePdf)
                                    .title(careerName)
                                    .category(category)
                                    .description(description)
                                    .importance("High")
                                    .requiredSkillsCount(8)
                                    .build());
                    role.setCareerDomainId(careerId);
                    role.setSourcePdf(sourcePdf);
                    careerRoleRepository.save(role);

                    // Seed pathways & stages for this career
                    JsonNode pathways = careerNode.path("pathways");
                    if (pathways.isArray()) {
                        for (JsonNode pNode : pathways) {
                            String pathwayId = pNode.path("pathway_id").asText();
                            String pathwayTitle = pNode.path("pathway_name").asText();
                            String pathwayDesc = pNode.path("description").asText();
                            JsonNode stages = pNode.path("recommended_stages");

                            Pathway pathway = Pathway.builder()
                                    .id(pathwayId)
                                    .careerRoleId(roleSlug)
                                    .title(pathwayTitle)
                                    .description(pathwayDesc)
                                    .stageCount(stages.size())
                                    .skillCount(stages.size() * 3)
                                    .build();
                            pathwayRepository.save(pathway);

                            // Stages
                            if (stages.isArray()) {
                                for (JsonNode stageNode : stages) {
                                    int stageOrder = stageNode.path("stage_order").asInt(1);
                                    String stageTitle = stageNode.path("title").asText();
                                    String stageDesc = stageNode.path("description").asText();
                                    JsonNode skills = stageNode.path("skills");

                                    List<String> skillNamesList = new ArrayList<>();
                                    if (skills.isArray()) {
                                        for (JsonNode sk : skills) {
                                            String skId = sk.path("skill_id").asText();
                                            String skName = sk.path("skill_name").asText();
                                            skillNamesList.add(skName);

                                            // Save career competency
                                            if (careerCompetencyRepository.findByRoleId(roleSlug).stream().noneMatch(c -> c.getSkillId().equalsIgnoreCase(skId))) {
                                                CareerCompetency cc = CareerCompetency.builder()
                                                        .roleId(roleSlug)
                                                        .skillId(skId)
                                                        .skillName(skName)
                                                        .requiredLevel("Intermediate")
                                                        .importanceWeight(sk.path("importance").asText().equalsIgnoreCase("CRITICAL") ? 1.0 : 0.8)
                                                        .build();
                                                careerCompetencyRepository.save(cc);
                                            }
                                        }
                                    }

                                    RoadmapStage rs = RoadmapStage.builder()
                                            .pathwayId(pathwayId)
                                            .stageNumber(stageOrder)
                                            .stageName(stageTitle)
                                            .description(stageDesc)
                                            .estimatedDuration("4–6 weeks")
                                            .skillsJson(objectMapper.writeValueAsString(skillNamesList))
                                            .build();
                                    roadmapStageRepository.save(rs);
                                }
                            }
                        }
                    }
                }
            }

            // Seed aliases: software-engineer and data-scientist
            if (careerRoleRepository.findByRoleId("software-engineer").isEmpty()) {
                careerRoleRepository.save(CareerRole.builder()
                        .roleId("software-engineer")
                        .careerDomainId("CAR-BACKEND")
                        .title("Software Engineer")
                        .category("Engineering")
                        .importance("High")
                        .requiredSkillsCount(8)
                        .description("Build scalable software systems")
                        .build());
            }
            if (careerRoleRepository.findByRoleId("data-scientist").isEmpty()) {
                careerRoleRepository.save(CareerRole.builder()
                        .roleId("data-scientist")
                        .careerDomainId("CAR-AI-ENG")
                        .title("Data Scientist")
                        .category("AI/Data")
                        .importance("High")
                        .requiredSkillsCount(6)
                        .description("Train predictive ML models and process big data")
                        .build());
            }

            log.info("Seeded Career Roles: {}, Pathways: {}, Roadmap Stages: {}",
                    careerRoleRepository.count(), pathwayRepository.count(), roadmapStageRepository.count());

        } catch (Exception e) {
            log.error("Failed to seed career roles and pathways: {}", e.getMessage(), e);
        }
    }

    private void seedAssessments() throws Exception {
        if (assessmentRepository.count() >= 5) return;

        Assessment dockerAssessment = Assessment.builder()
                .skillId("SKL-0114")
                .title("Docker Fundamentals & Containers")
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

        Assessment sqlAssessment = Assessment.builder()
                .skillId("SKL-0047")
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
                .skillId("SKL-0011")
                .title("Java Fundamentals")
                .description("Evaluate core Java principles, OOP, collections, and multi-threading.")
                .questionCount(5)
                .durationMinutes(15)
                .difficulty("Intermediate")
                .passScore(70)
                .build();
        assessmentRepository.save(javaAssessment);

        Assessment springAssessment = Assessment.builder()
                .skillId("SKL-0039")
                .title("Spring Boot Microservices")
                .description("Evaluate Spring IoC container, Dependency Injection, REST controllers, and JPA.")
                .questionCount(5)
                .durationMinutes(15)
                .difficulty("Advanced")
                .passScore(70)
                .build();
        assessmentRepository.save(springAssessment);

        Assessment pythonAssessment = Assessment.builder()
                .skillId("SKL-0012")
                .title("Python Core & Concurrency")
                .description("Evaluate Python memory management, GIL, async/await event loops, and typing.")
                .questionCount(5)
                .durationMinutes(15)
                .difficulty("Intermediate")
                .passScore(70)
                .build();
        assessmentRepository.save(pythonAssessment);

        log.info("Seeded assessments. Total: {}", assessmentRepository.count());
    }

    private void seedProjects() {
        if (projectRepository.count() >= 10) return;

        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("data/project_catalog.json");
            if (is != null) {
                JsonNode root = objectMapper.readTree(is);
                if (root.isArray()) {
                    for (JsonNode pNode : root) {
                        String title = pNode.path("title").asText();
                        String desc = pNode.path("description").asText();
                        String diff = pNode.path("difficulty").asText("Intermediate");

                        List<String> practiced = new ArrayList<>();
                        for (JsonNode sk : pNode.path("skills_practiced")) {
                            practiced.add(sk.asText());
                        }

                        List<String> outcomes = new ArrayList<>();
                        for (JsonNode out : pNode.path("expected_outcomes")) {
                            outcomes.add(out.asText());
                        }

                        Project project = Project.builder()
                                .title(title)
                                .objective(desc)
                                .skillsCovered(String.join(", ", practiced))
                                .requirements(String.join(". ", outcomes))
                                .architecture("Modular, scalable architecture adhering to production standards.")
                                .estimatedTime("8–12 hours")
                                .difficulty(diff)
                                .evaluationCriteria("Passing automated unit tests, clean git commit history, and deterministic execution.")
                                .submissionRequirements("Public GitHub repository link.")
                                .build();
                        projectRepository.save(project);
                    }
                }
            }
            log.info("Seeded projects. Total: {}", projectRepository.count());
        } catch (Exception e) {
            log.error("Failed to seed projects from catalog: {}", e.getMessage());
        }
    }

    private void seedCourses() {
        if (courseRepository.count() >= 20) return;

        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("data/learning_resources.json");
            if (is != null) {
                JsonNode root = objectMapper.readTree(is);
                if (root.isArray()) {
                    for (JsonNode rNode : root) {
                        String title = rNode.path("title").asText();
                        String provider = rNode.path("provider").asText("SkillSync Recommended");
                        String desc = rNode.path("description").asText();
                        String url = rNode.path("url").asText();
                        String skillId = rNode.path("skill_id").asText();
                        String diff = rNode.path("difficulty").asText("Intermediate");
                        double hours = rNode.path("estimated_hours").asDouble(6.0);

                        Course course = Course.builder()
                                .title(title)
                                .platform(provider)
                                .description(desc)
                                .duration(String.format("%.0f hours", hours))
                                .difficulty(diff)
                                .skillsCovered(skillId)
                                .competenciesCovered("Core Technical Proficiency")
                                .isFree(true)
                                .recommendationReason("Curated canonical resource directly addressing skill gap for " + skillId)
                                .url(url)
                                .skillId(skillId)
                                .build();
                        courseRepository.save(course);
                    }
                }
            }
            log.info("Seeded courses. Total: {}", courseRepository.count());
        } catch (Exception e) {
            log.error("Failed to seed courses: {}", e.getMessage());
        }
    }

    private void seedJobs() {
        if (jobRepository.count() >= 5) return;

        List<Job> jobs = Arrays.asList(
                Job.builder()
                        .jobTitle("Junior Backend Developer")
                        .company("TechNova Systems")
                        .location("Bengaluru, India")
                        .employmentType("Full-time")
                        .salary("₹8,00,000 - ₹12,00,000")
                        .requiredSkills("Java, Spring Boot, SQL, REST API, Docker")
                        .applicationUrl("https://careers.technova.example/jobs/101")
                        .remote(false)
                        .experienceLevel("Entry Level (0-2 yrs)")
                        .build(),
                Job.builder()
                        .jobTitle("Cloud & Platform Engineer")
                        .company("CloudScale Dynamics")
                        .location("Remote")
                        .employmentType("Full-time")
                        .salary("₹10,00,000 - ₹15,00,000")
                        .requiredSkills("Docker, Kubernetes, AWS, Git, Linux")
                        .applicationUrl("https://careers.cloudscale.example/jobs/204")
                        .remote(true)
                        .experienceLevel("Associate")
                        .build(),
                Job.builder()
                        .jobTitle("AI Application Developer")
                        .company("NeuroPath AI")
                        .location("Bengaluru, India")
                        .employmentType("Full-time")
                        .salary("₹12,00,000 - ₹18,00,000")
                        .requiredSkills("Python, FastAPI, LangChain, PyTorch, SQL")
                        .applicationUrl("https://careers.neuropath.example/jobs/305")
                        .remote(true)
                        .experienceLevel("Mid-Level (1-3 yrs)")
                        .build()
        );

        jobRepository.saveAll(jobs);
        log.info("Seeded jobs. Total: {}", jobRepository.count());
    }

    private void seedDemoUser() {
        if (!userRepository.existsByEmail("student@example.com")) {
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
                    StudentSkill.builder().userId(student.getId()).skillId("SKL-0011").name("Java").category("Backend").level("Intermediate").status(SkillStatus.ASSESSMENT_VERIFIED).score(85).evidenceCount(2).build(),
                    StudentSkill.builder().userId(student.getId()).skillId("SKL-0039").name("Spring Boot").category("Backend").level("Intermediate").status(SkillStatus.ASSESSMENT_VERIFIED).score(80).evidenceCount(1).build(),
                    StudentSkill.builder().userId(student.getId()).skillId("SKL-0041").name("REST API").category("Backend").level("Advanced").status(SkillStatus.ASSESSMENT_VERIFIED).score(90).evidenceCount(3).build(),
                    StudentSkill.builder().userId(student.getId()).skillId("SKL-0047").name("SQL").category("Database").level("Intermediate").status(SkillStatus.EVIDENCE_BACKED).score(65).evidenceCount(1).build(),
                    StudentSkill.builder().userId(student.getId()).skillId("SKL-0114").name("Docker").category("DevOps").level("Beginner").status(SkillStatus.MISSING).score(0).evidenceCount(0).build(),
                    StudentSkill.builder().userId(student.getId()).skillId("SKL-0012").name("Python").category("Backend").level("Beginner").status(SkillStatus.CLAIMED).score(50).evidenceCount(0).build()
            );
            studentSkillRepository.saveAll(studentSkills);
            log.info("Seeded demo user student@example.com with canonical skill IDs and 3-tier verification statuses");
        }

        if (!userRepository.existsByEmail("alex.chen@university.edu")) {
            User alex = User.builder()
                    .fullName("Alex Chen")
                    .email("alex.chen@university.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role("ROLE_STUDENT")
                    .build();
            alex = userRepository.save(alex);

            StudentProfile alexProfile = StudentProfile.builder()
                    .userId(alex.getId())
                    .fullName("Alex Chen")
                    .email("alex.chen@university.edu")
                    .phone("+91 9876543211")
                    .education("B.Tech in Computer Science and Engineering")
                    .experienceLevel("Student")
                    .targetRoleId("backend-developer")
                    .targetRoleTitle("Backend Developer")
                    .resumeUrl("https://skillbridge.dev/resumes/alex_chen_resume.pdf")
                    .build();
            studentProfileRepository.save(alexProfile);

            List<StudentSkill> alexSkills = Arrays.asList(
                    StudentSkill.builder().userId(alex.getId()).skillId("SKL-0012").name("Python").category("Backend").level("Advanced").status(SkillStatus.ASSESSMENT_VERIFIED).score(89).evidenceCount(3).build(),
                    StudentSkill.builder().userId(alex.getId()).skillId("SKL-0047").name("SQL").category("Database").level("Advanced").status(SkillStatus.ASSESSMENT_VERIFIED).score(92).evidenceCount(2).build(),
                    StudentSkill.builder().userId(alex.getId()).skillId("SKL-0041").name("REST API").category("Backend").level("Advanced").status(SkillStatus.ASSESSMENT_VERIFIED).score(94).evidenceCount(4).build(),
                    StudentSkill.builder().userId(alex.getId()).skillId("SKL-0038").name("FastAPI").category("Backend").level("Intermediate").status(SkillStatus.EVIDENCE_BACKED).score(85).evidenceCount(2).build(),
                    StudentSkill.builder().userId(alex.getId()).skillId("SKL-0114").name("Docker").category("DevOps").level("Beginner").status(SkillStatus.MISSING).score(0).evidenceCount(0).build()
            );
            studentSkillRepository.saveAll(alexSkills);
            log.info("Seeded demo user alex.chen@university.edu with canonical skill IDs");
        }
    }

    private List<String> parseCsvLine(String line) {
        List<String> tokens = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                tokens.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        tokens.add(sb.toString());
        return tokens;
    }
}
