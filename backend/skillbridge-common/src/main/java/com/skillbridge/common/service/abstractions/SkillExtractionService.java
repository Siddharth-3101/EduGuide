package com.skillbridge.common.service.abstractions;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

public interface SkillExtractionService {

    class ExtractedSkill {
        private String skillId;
        private String skillName;
        private String category;
        private String level;
        private Integer confidenceScore;

        public ExtractedSkill() {}

        public ExtractedSkill(String skillId, String skillName, String category, String level, Integer confidenceScore) {
            this.skillId = skillId;
            this.skillName = skillName;
            this.category = category;
            this.level = level;
            this.confidenceScore = confidenceScore;
        }

        public String getSkillId() { return skillId; }
        public void setSkillId(String skillId) { this.skillId = skillId; }

        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }

        public Integer getConfidenceScore() { return confidenceScore; }
        public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }

        public static ExtractedSkillBuilder builder() { return new ExtractedSkillBuilder(); }

        public static class ExtractedSkillBuilder {
            private String skillId;
            private String skillName;
            private String category;
            private String level;
            private Integer confidenceScore;

            public ExtractedSkillBuilder skillId(String skillId) { this.skillId = skillId; return this; }
            public ExtractedSkillBuilder skillName(String skillName) { this.skillName = skillName; return this; }
            public ExtractedSkillBuilder category(String category) { this.category = category; return this; }
            public ExtractedSkillBuilder level(String level) { this.level = level; return this; }
            public ExtractedSkillBuilder confidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; return this; }

            public ExtractedSkill build() { return new ExtractedSkill(skillId, skillName, category, level, confidenceScore); }
        }
    }

    class ExtractedSkillResponse {
        private String documentName;
        private String documentType;
        private List<ExtractedSkill> extractedSkills;
        private String summary;

        public ExtractedSkillResponse() {}

        public ExtractedSkillResponse(String documentName, String documentType, List<ExtractedSkill> extractedSkills, String summary) {
            this.documentName = documentName;
            this.documentType = documentType;
            this.extractedSkills = extractedSkills;
            this.summary = summary;
        }

        public String getDocumentName() { return documentName; }
        public void setDocumentName(String documentName) { this.documentName = documentName; }

        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }

        public List<ExtractedSkill> getExtractedSkills() { return extractedSkills; }
        public void setExtractedSkills(List<ExtractedSkill> extractedSkills) { this.extractedSkills = extractedSkills; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        public static ExtractedSkillResponseBuilder builder() { return new ExtractedSkillResponseBuilder(); }

        public static class ExtractedSkillResponseBuilder {
            private String documentName;
            private String documentType;
            private List<ExtractedSkill> extractedSkills;
            private String summary;

            public ExtractedSkillResponseBuilder documentName(String documentName) { this.documentName = documentName; return this; }
            public ExtractedSkillResponseBuilder documentType(String documentType) { this.documentType = documentType; return this; }
            public ExtractedSkillResponseBuilder extractedSkills(List<ExtractedSkill> extractedSkills) { this.extractedSkills = extractedSkills; return this; }
            public ExtractedSkillResponseBuilder summary(String summary) { this.summary = summary; return this; }

            public ExtractedSkillResponse build() { return new ExtractedSkillResponse(documentName, documentType, extractedSkills, summary); }
        }
    }

    ExtractedSkillResponse extractSkills(String documentName, String documentType, byte[] content);
}

@Service
class MockSkillExtractionService implements SkillExtractionService {

    @Override
    public ExtractedSkillResponse extractSkills(String documentName, String documentType, byte[] content) {
        List<ExtractedSkill> mockSkills = Arrays.asList(
                ExtractedSkill.builder().skillId("java").skillName("Java").category("Backend").level("Intermediate").confidenceScore(92).build(),
                ExtractedSkill.builder().skillId("spring-boot").skillName("Spring Boot").category("Backend").level("Intermediate").confidenceScore(88).build(),
                ExtractedSkill.builder().skillId("rest-api").skillName("REST API").category("Backend").level("Advanced").confidenceScore(95).build(),
                ExtractedSkill.builder().skillId("docker").skillName("Docker").category("Cloud").level("Beginner").confidenceScore(75).build(),
                ExtractedSkill.builder().skillId("sql").skillName("SQL").category("Database").level("Intermediate").confidenceScore(85).build()
        );

        return ExtractedSkillResponse.builder()
                .documentName(documentName)
                .documentType(documentType)
                .extractedSkills(mockSkills)
                .summary("Successfully extracted 5 technical skills from document using evidence intelligence engine.")
                .build();
    }
}
