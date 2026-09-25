package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "career_competencies")
public class CareerCompetency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roleId;

    @Column(nullable = false)
    private String skillId;

    private String skillName;
    private String requiredLevel;
    private Double importanceWeight = 1.0;

    public CareerCompetency() {}

    public CareerCompetency(Long id, String roleId, String skillId, String skillName, String requiredLevel, Double importanceWeight) {
        this.id = id;
        this.roleId = roleId;
        this.skillId = skillId;
        this.skillName = skillName;
        this.requiredLevel = requiredLevel;
        this.importanceWeight = importanceWeight != null ? importanceWeight : 1.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getRequiredLevel() { return requiredLevel; }
    public void setRequiredLevel(String requiredLevel) { this.requiredLevel = requiredLevel; }

    public Double getImportanceWeight() { return importanceWeight; }
    public void setImportanceWeight(Double importanceWeight) { this.importanceWeight = importanceWeight; }

    public static CareerCompetencyBuilder builder() { return new CareerCompetencyBuilder(); }

    public static class CareerCompetencyBuilder {
        private Long id;
        private String roleId;
        private String skillId;
        private String skillName;
        private String requiredLevel;
        private Double importanceWeight = 1.0;

        public CareerCompetencyBuilder id(Long id) { this.id = id; return this; }
        public CareerCompetencyBuilder roleId(String roleId) { this.roleId = roleId; return this; }
        public CareerCompetencyBuilder skillId(String skillId) { this.skillId = skillId; return this; }
        public CareerCompetencyBuilder skillName(String skillName) { this.skillName = skillName; return this; }
        public CareerCompetencyBuilder requiredLevel(String requiredLevel) { this.requiredLevel = requiredLevel; return this; }
        public CareerCompetencyBuilder importanceWeight(Double importanceWeight) { this.importanceWeight = importanceWeight; return this; }

        public CareerCompetency build() {
            return new CareerCompetency(id, roleId, skillId, skillName, requiredLevel, importanceWeight);
        }
    }
}
