package com.skillbridge.career.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public class TargetRoleRequest {
    @NotBlank(message = "Role ID is required")
    @JsonAlias({"roleId", "careerRoleId", "targetRoleId", "id"})
    private String roleId;

    public TargetRoleRequest() {}

    public TargetRoleRequest(String roleId) {
        this.roleId = roleId;
    }

    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
}

