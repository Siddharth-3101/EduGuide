package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String skillId;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Skill() {}

    public Skill(Long id, String skillId, String name, String category, String description) {
        this.id = id;
        this.skillId = skillId;
        this.name = name;
        this.category = category;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static SkillBuilder builder() { return new SkillBuilder(); }

    public static class SkillBuilder {
        private Long id;
        private String skillId;
        private String name;
        private String category;
        private String description;

        public SkillBuilder id(Long id) { this.id = id; return this; }
        public SkillBuilder skillId(String skillId) { this.skillId = skillId; return this; }
        public SkillBuilder name(String name) { this.name = name; return this; }
        public SkillBuilder category(String category) { this.category = category; return this; }
        public SkillBuilder description(String description) { this.description = description; return this; }

        public Skill build() {
            return new Skill(id, skillId, name, category, description);
        }
    }
}
