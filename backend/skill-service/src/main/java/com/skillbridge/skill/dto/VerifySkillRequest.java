package com.skillbridge.skill.dto;

public class VerifySkillRequest {
    private String type;
    private String name;
    private String score;

    public VerifySkillRequest() {}

    public VerifySkillRequest(String type, String name, String score) {
        this.type = type;
        this.name = name;
        this.score = score;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }
}
