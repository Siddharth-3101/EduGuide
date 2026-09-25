package com.skillbridge.common.service.abstractions;

import com.skillbridge.common.model.Job;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

public interface JobProvider {
    String getProviderName();
    List<Job> fetchJobs(String keyword, String location);
}

@Service("mockJobProvider")
class MockJobProvider implements JobProvider {
    @Override
    public String getProviderName() {
        return "MockJobProvider";
    }

    @Override
    public List<Job> fetchJobs(String keyword, String location) {
        return Collections.emptyList(); // Repository backed mock jobs used in service layer
    }
}

@Service("linkedInJobProvider")
class LinkedInJobProvider implements JobProvider {
    @Override
    public String getProviderName() {
        return "LinkedInJobProvider";
    }

    @Override
    public List<Job> fetchJobs(String keyword, String location) {
        // Placeholder for official LinkedIn API integration (Environment variable configured)
        return Collections.emptyList();
    }
}

@Service("naukriJobProvider")
class NaukriJobProvider implements JobProvider {
    @Override
    public String getProviderName() {
        return "NaukriJobProvider";
    }

    @Override
    public List<Job> fetchJobs(String keyword, String location) {
        // Placeholder for official Naukri API integration
        return Collections.emptyList();
    }
}
