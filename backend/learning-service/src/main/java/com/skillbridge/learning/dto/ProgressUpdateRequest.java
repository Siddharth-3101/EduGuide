package com.skillbridge.learning.dto;

import com.skillbridge.common.model.enums.LearningStatus;

public class ProgressUpdateRequest {
    private LearningStatus status;
    private Integer progressPercent;

    public ProgressUpdateRequest() {}

    public ProgressUpdateRequest(LearningStatus status, Integer progressPercent) {
        this.status = status;
        this.progressPercent = progressPercent;
    }

    public LearningStatus getStatus() { return status; }
    public void setStatus(LearningStatus status) { this.status = status; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
}
