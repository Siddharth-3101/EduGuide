package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment_questions")
public class AssessmentQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long assessmentId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String optionsJson;

    @Column(nullable = false)
    private Integer correctOptionIndex;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    public AssessmentQuestion() {}

    public AssessmentQuestion(Long id, Long assessmentId, String questionText, String optionsJson, Integer correctOptionIndex, String explanation) {
        this.id = id;
        this.assessmentId = assessmentId;
        this.questionText = questionText;
        this.optionsJson = optionsJson;
        this.correctOptionIndex = correctOptionIndex;
        this.explanation = explanation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }

    public Integer getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(Integer correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public static AssessmentQuestionBuilder builder() { return new AssessmentQuestionBuilder(); }

    public static class AssessmentQuestionBuilder {
        private Long id;
        private Long assessmentId;
        private String questionText;
        private String optionsJson;
        private Integer correctOptionIndex;
        private String explanation;

        public AssessmentQuestionBuilder id(Long id) { this.id = id; return this; }
        public AssessmentQuestionBuilder assessmentId(Long assessmentId) { this.assessmentId = assessmentId; return this; }
        public AssessmentQuestionBuilder questionText(String questionText) { this.questionText = questionText; return this; }
        public AssessmentQuestionBuilder optionsJson(String optionsJson) { this.optionsJson = optionsJson; return this; }
        public AssessmentQuestionBuilder correctOptionIndex(Integer correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; return this; }
        public AssessmentQuestionBuilder explanation(String explanation) { this.explanation = explanation; return this; }

        public AssessmentQuestion build() {
            return new AssessmentQuestion(id, assessmentId, questionText, optionsJson, correctOptionIndex, explanation);
        }
    }
}
