package com.skillbridge.evidence.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.skillbridge.common.model.enums.EvidenceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateEvidenceRequest {
    @JsonAlias({"skillId", "skill"})
    private String skillId;

    @NotBlank(message = "Evidence title/name is required")
    @JsonAlias({"name", "title", "evidenceName"})
    private String name;

    @NotNull(message = "Evidence type is required")
    private EvidenceType type;

    @JsonAlias({"fileUrl", "url", "link"})
    private String fileUrl;
    private String score;

    public CreateEvidenceRequest() {}

    public CreateEvidenceRequest(String skillId, String name, EvidenceType type, String fileUrl, String score) {
        this.skillId = skillId;
        this.name = name;
        this.type = type;
        this.fileUrl = fileUrl;
        this.score = score;
    }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public EvidenceType getType() { return type; }
    public void setType(EvidenceType type) { this.type = type; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }
}
