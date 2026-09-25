package com.skillbridge.assessment.dto;

import com.skillbridge.common.model.AssessmentAttempt;

public class AssessmentResultDto {
    private AssessmentAttempt attempt;
    private String skillVerificationStatus;
    private String message;

    public AssessmentResultDto() {}

    public AssessmentResultDto(AssessmentAttempt attempt, String skillVerificationStatus, String message) {
        this.attempt = attempt;
        this.skillVerificationStatus = skillVerificationStatus;
        this.message = message;
    }

    public AssessmentAttempt getAttempt() { return attempt; }
    public void setAttempt(AssessmentAttempt attempt) { this.attempt = attempt; }

    public String getSkillVerificationStatus() { return skillVerificationStatus; }
    public void setSkillVerificationStatus(String skillVerificationStatus) { this.skillVerificationStatus = skillVerificationStatus; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public static AssessmentResultDtoBuilder builder() { return new AssessmentResultDtoBuilder(); }

    public static class AssessmentResultDtoBuilder {
        private AssessmentAttempt attempt;
        private String skillVerificationStatus;
        private String message;

        public AssessmentResultDtoBuilder attempt(AssessmentAttempt attempt) { this.attempt = attempt; return this; }
        public AssessmentResultDtoBuilder skillVerificationStatus(String skillVerificationStatus) { this.skillVerificationStatus = skillVerificationStatus; return this; }
        public AssessmentResultDtoBuilder message(String message) { this.message = message; return this; }

        public AssessmentResultDto build() {
            return new AssessmentResultDto(attempt, skillVerificationStatus, message);
        }
    }
}
