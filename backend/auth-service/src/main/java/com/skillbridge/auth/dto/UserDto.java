package com.skillbridge.auth.dto;

public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String avatar;
    private String targetRole;

    public UserDto() {}

    public UserDto(Long id, String fullName, String email, String role, String avatar, String targetRole) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
        this.targetRole = targetRole;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public static UserDtoBuilder builder() { return new UserDtoBuilder(); }

    public static class UserDtoBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String avatar;
        private String targetRole;

        public UserDtoBuilder id(Long id) { this.id = id; return this; }
        public UserDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder role(String role) { this.role = role; return this; }
        public UserDtoBuilder avatar(String avatar) { this.avatar = avatar; return this; }
        public UserDtoBuilder targetRole(String targetRole) { this.targetRole = targetRole; return this; }

        public UserDto build() {
            return new UserDto(id, fullName, email, role, avatar, targetRole);
        }
    }
}
