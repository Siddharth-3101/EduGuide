package com.skillbridge.learning.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.Course;
import com.skillbridge.common.model.LearningProgress;
import com.skillbridge.common.model.enums.LearningStatus;
import com.skillbridge.common.repository.CourseRepository;
import com.skillbridge.common.repository.LearningProgressRepository;
import com.skillbridge.learning.dto.ProgressUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LearningService {

    private final CourseRepository courseRepository;
    private final LearningProgressRepository progressRepository;

    public LearningService(CourseRepository courseRepository, LearningProgressRepository progressRepository) {
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));
    }

    public List<Course> getCoursesBySkillId(String skillId) {
        return courseRepository.findBySkillId(skillId);
    }

    public List<Course> getRecommendedCourses(Long userId) {
        return courseRepository.findAll();
    }

    @Transactional
    public LearningProgress updateProgress(Long userId, Long courseId, ProgressUpdateRequest request) {
        getCourseById(courseId);

        LearningProgress progress = progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> LearningProgress.builder()
                        .userId(userId)
                        .courseId(courseId)
                        .status(LearningStatus.NOT_STARTED)
                        .progressPercent(0)
                        .build());

        if (request != null) {
            if (request.getStatus() != null) progress.setStatus(request.getStatus());
            if (request.getProgressPercent() != null) {
                progress.setProgressPercent(request.getProgressPercent());
                if (request.getProgressPercent() >= 100) {
                    progress.setStatus(LearningStatus.COMPLETED);
                } else if (request.getProgressPercent() > 0 && progress.getStatus() == LearningStatus.NOT_STARTED) {
                    progress.setStatus(LearningStatus.IN_PROGRESS);
                }
            }
        }

        return progressRepository.save(progress);
    }
}
