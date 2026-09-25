package com.skillbridge.common.service.abstractions;

import org.springframework.stereotype.Service;

public interface GitHubIntegrationService {

    class EvaluationResult {
        private boolean passed;
        private int score;
        private String feedback;

        public EvaluationResult() {}

        public EvaluationResult(boolean passed, int score, String feedback) {
            this.passed = passed;
            this.score = score;
            this.feedback = feedback;
        }

        public boolean isPassed() { return passed; }
        public void setPassed(boolean passed) { this.passed = passed; }

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }

        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }

        public static EvaluationResultBuilder builder() { return new EvaluationResultBuilder(); }

        public static class EvaluationResultBuilder {
            private boolean passed;
            private int score;
            private String feedback;

            public EvaluationResultBuilder passed(boolean passed) { this.passed = passed; return this; }
            public EvaluationResultBuilder score(int score) { this.score = score; return this; }
            public EvaluationResultBuilder feedback(String feedback) { this.feedback = feedback; return this; }

            public EvaluationResult build() { return new EvaluationResult(passed, score, feedback); }
        }
    }

    boolean validateRepositoryUrl(String repoUrl);
    EvaluationResult evaluateSubmission(String repoUrl, Long projectId);
}

@Service
class MockGitHubIntegrationService implements GitHubIntegrationService {

    @Override
    public boolean validateRepositoryUrl(String repoUrl) {
        return repoUrl != null && repoUrl.toLowerCase().contains("github.com");
    }

    @Override
    public EvaluationResult evaluateSubmission(String repoUrl, Long projectId) {
        return EvaluationResult.builder()
                .passed(true)
                .score(90)
                .feedback("Repository structure matches project guidelines. Dockerfile and REST endpoints verified.")
                .build();
    }
}
