package com.skillbridge.common.service.abstractions;

import com.skillbridge.common.model.Course;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

public interface LearningProvider {
    String getProviderName();
    List<Course> fetchCoursesForSkill(String skillId);
}

@Service("mockLearningProvider")
class MockLearningProvider implements LearningProvider {
    @Override
    public String getProviderName() {
        return "MockLearningProvider";
    }

    @Override
    public List<Course> fetchCoursesForSkill(String skillId) {
        return Collections.emptyList();
    }
}
