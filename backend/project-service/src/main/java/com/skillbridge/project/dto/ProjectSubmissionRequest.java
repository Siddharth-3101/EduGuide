package com.skillbridge.project.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public class ProjectSubmissionRequest {
    @NotBlank(message = "GitHub repository URL is required")
    @JsonAlias({"githubRepoUrl", "repositoryUrl", "repoUrl", "url", "githubUrl"})
    private String githubRepoUrl;

    @JsonAlias({"submissionNotes", "notes", "description"})
    private String submissionNotes;

    public ProjectSubmissionRequest() {}

    public ProjectSubmissionRequest(String githubRepoUrl, String submissionNotes) {
        this.githubRepoUrl = githubRepoUrl;
        this.submissionNotes = submissionNotes;
    }

    public String getGithubRepoUrl() { return githubRepoUrl; }
    public void setGithubRepoUrl(String githubRepoUrl) { this.githubRepoUrl = githubRepoUrl; }

    public String getSubmissionNotes() { return submissionNotes; }
    public void setSubmissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; }
}
