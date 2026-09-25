package com.skillbridge.job.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.Job;
import com.skillbridge.common.model.StudentSkill;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.JobRepository;
import com.skillbridge.common.repository.StudentSkillRepository;
import com.skillbridge.job.dto.JobMatchDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final StudentSkillRepository studentSkillRepository;

    public JobService(JobRepository jobRepository, StudentSkillRepository studentSkillRepository) {
        this.jobRepository = jobRepository;
        this.studentSkillRepository = studentSkillRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));
    }

    public List<JobMatchDto> getRecommendedJobs(Long userId) {
        List<Job> jobs = getAllJobs();
        List<JobMatchDto> matches = new ArrayList<>();

        for (Job job : jobs) {
            matches.add(calculateJobMatch(userId, job.getId()));
        }

        matches.sort((a, b) -> Integer.compare(b.getCompetencyMatchPercentage(), a.getCompetencyMatchPercentage()));
        return matches;
    }

    public JobMatchDto calculateJobMatch(Long userId, Long jobId) {
        Job job = getJobById(jobId);
        List<StudentSkill> studentSkills = studentSkillRepository.findByUserId(userId);

        List<String> requiredSkills = parseSkills(job.getRequiredSkills());
        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        int satisfiedWeight = 0;
        int totalWeight = requiredSkills.isEmpty() ? 1 : requiredSkills.size() * 10;

        for (String req : requiredSkills) {
            Optional<StudentSkill> found = studentSkills.stream()
                    .filter(s -> s.getName().equalsIgnoreCase(req) || s.getSkillId().equalsIgnoreCase(req))
                    .findFirst();

            if (found.isPresent() && (found.get().getStatus() == SkillStatus.VERIFIED || found.get().getStatus() == SkillStatus.PARTIAL)) {
                matching.add(req);
                int score = found.get().getStatus() == SkillStatus.VERIFIED ? 10 : 5;
                satisfiedWeight += score;
            } else {
                missing.add(req);
            }
        }

        int percentage = Math.min(100, (int) Math.round(((double) satisfiedWeight / totalWeight) * 100));

        String category = percentage >= 80 ? "STRONG_COMPETENCY_MATCH" :
                (percentage >= 50 ? "MODERATE_COMPETENCY_MATCH" : "DEVELOPING_COMPETENCY_MATCH");

        return JobMatchDto.builder()
                .job(job)
                .competencyMatchPercentage(percentage)
                .matchingSkills(matching)
                .missingSkills(missing)
                .matchCategory(category)
                .build();
    }

    public Map<String, Object> getFilters() {
        return Map.of(
                "employmentTypes", Arrays.asList("Full-time", "Part-time", "Contract", "Internship"),
                "locations", Arrays.asList("Bengaluru, India", "Hyderabad, India", "Remote"),
                "experienceLevels", Arrays.asList("Entry Level (0-2 yrs)", "Associate", "Mid-Senior Level"),
                "remote", Arrays.asList("All", "Remote Only", "On-site")
        );
    }

    private List<String> parseSkills(String commaSeparated) {
        if (commaSeparated == null || commaSeparated.trim().isEmpty()) return Collections.emptyList();
        String[] parts = commaSeparated.split(",");
        List<String> result = new ArrayList<>();
        for (String p : parts) {
            result.add(p.trim());
        }
        return result;
    }
}
