package com.skillbridge.common.model;

import com.skillbridge.common.model.enums.SkillStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "student_skills")
public class StudentSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String skillId;

    private String name;
    private String category;
    private String level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillStatus status;

    private Integer score = 0;
    private Integer evidenceCount = 0;

    @Column(columnDefinition = "TEXT")
    private String evidenceListJson;

    public StudentSkill() {}

    public StudentSkill(Long id, Long userId, String skillId, String name, String category, String level, SkillStatus status, Integer score, Integer evidenceCount, String evidenceListJson) {
        this.id = id;
        this.userId = userId;
        this.skillId = skillId;
        this.name = name;
        this.category = category;
        this.level = level;
        this.status = status;
        this.score = score != null ? score : 0;
        this.evidenceCount = evidenceCount != null ? evidenceCount : 0;
        this.evidenceListJson = evidenceListJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public SkillStatus getStatus() { return status; }
    public void setStatus(SkillStatus status) { this.status = status; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getEvidenceCount() { return evidenceCount; }
    public void setEvidenceCount(Integer evidenceCount) { this.evidenceCount = evidenceCount; }

    public String getEvidenceListJson() { return evidenceListJson; }
    public void setEvidenceListJson(String evidenceListJson) { this.evidenceListJson = evidenceListJson; }

    public static StudentSkillBuilder builder() { return new StudentSkillBuilder(); }

    public static class StudentSkillBuilder {
        private Long id;
        private Long userId;
        private String skillId;
        private String name;
        private String category;
        private String level;
        private SkillStatus status;
        private Integer score = 0;
        private Integer evidenceCount = 0;
        private String evidenceListJson;

        public StudentSkillBuilder id(Long id) { this.id = id; return this; }
        public StudentSkillBuilder userId(Long userId) { this.userId = userId; return this; }
        public StudentSkillBuilder skillId(String skillId) { this.skillId = skillId; return this; }
        public StudentSkillBuilder name(String name) { this.name = name; return this; }
        public StudentSkillBuilder category(String category) { this.category = category; return this; }
        public StudentSkillBuilder level(String level) { this.level = level; return this; }
        public StudentSkillBuilder status(SkillStatus status) { this.status = status; return this; }
        public StudentSkillBuilder score(Integer score) { this.score = score; return this; }
        public StudentSkillBuilder evidenceCount(Integer evidenceCount) { this.evidenceCount = evidenceCount; return this; }
        public StudentSkillBuilder evidenceListJson(String evidenceListJson) { this.evidenceListJson = evidenceListJson; return this; }

        public StudentSkill build() {
            return new StudentSkill(id, userId, skillId, name, category, level, status, score, evidenceCount, evidenceListJson);
        }
    }
}
