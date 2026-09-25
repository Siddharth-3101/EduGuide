package com.skillbridge.project.dto;

import com.skillbridge.common.model.enums.ProjectStatus;

public class ProjectProgressRequest {
    private ProjectStatus status;
    private Integer progressPercent;
    private String githubRepoUrl;

    public ProjectProgressRequest() {}

    public ProjectProgressRequest(ProjectStatus status, Integer progressPercent, String githubRepoUrl) {
        this.status = status;
        this.progressPercent = progressPercent;
        this.githubRepoUrl = githubRepoUrl;
    }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }

    public String getGithubRepoUrl() { return githubRepoUrl; }
    public void setGithubRepoUrl(String githubRepoUrl) { this.githubRepoUrl = githubRepoUrl; }
}
