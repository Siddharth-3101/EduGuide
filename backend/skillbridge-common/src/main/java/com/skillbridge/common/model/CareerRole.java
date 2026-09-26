package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "career_roles")
public class CareerRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roleId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String importance;
    private Integer requiredSkillsCount;
    private String careerDomainId;
    private String sourcePdf;

    public CareerRole() {}

    public CareerRole(Long id, String roleId, String title, String description, String category, String importance, Integer requiredSkillsCount) {
        this(id, roleId, title, description, category, importance, requiredSkillsCount, null, null);
    }

    public CareerRole(Long id, String roleId, String title, String description, String category, String importance, Integer requiredSkillsCount, String careerDomainId, String sourcePdf) {
        this.id = id;
        this.roleId = roleId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.importance = importance;
        this.requiredSkillsCount = requiredSkillsCount;
        this.careerDomainId = careerDomainId;
        this.sourcePdf = sourcePdf;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }

    public Integer getRequiredSkillsCount() { return requiredSkillsCount; }
    public void setRequiredSkillsCount(Integer requiredSkillsCount) { this.requiredSkillsCount = requiredSkillsCount; }

    public String getCareerDomainId() { return careerDomainId; }
    public void setCareerDomainId(String careerDomainId) { this.careerDomainId = careerDomainId; }

    public String getSourcePdf() { return sourcePdf; }
    public void setSourcePdf(String sourcePdf) { this.sourcePdf = sourcePdf; }

    public static CareerRoleBuilder builder() { return new CareerRoleBuilder(); }

    public static class CareerRoleBuilder {
        private Long id;
        private String roleId;
        private String title;
        private String description;
        private String category;
        private String importance;
        private Integer requiredSkillsCount;
        private String careerDomainId;
        private String sourcePdf;

        public CareerRoleBuilder id(Long id) { this.id = id; return this; }
        public CareerRoleBuilder roleId(String roleId) { this.roleId = roleId; return this; }
        public CareerRoleBuilder title(String title) { this.title = title; return this; }
        public CareerRoleBuilder description(String description) { this.description = description; return this; }
        public CareerRoleBuilder category(String category) { this.category = category; return this; }
        public CareerRoleBuilder importance(String importance) { this.importance = importance; return this; }
        public CareerRoleBuilder requiredSkillsCount(Integer requiredSkillsCount) { this.requiredSkillsCount = requiredSkillsCount; return this; }
        public CareerRoleBuilder careerDomainId(String careerDomainId) { this.careerDomainId = careerDomainId; return this; }
        public CareerRoleBuilder sourcePdf(String sourcePdf) { this.sourcePdf = sourcePdf; return this; }

        public CareerRole build() {
            return new CareerRole(id, roleId, title, description, category, importance, requiredSkillsCount, careerDomainId, sourcePdf);
        }
    }
}
