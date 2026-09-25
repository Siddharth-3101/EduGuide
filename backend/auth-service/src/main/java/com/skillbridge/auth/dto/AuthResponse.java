package com.skillbridge.auth.dto;

public class AuthResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String token;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(Long userId, String fullName, String email, String token, UserDto user) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.token = token;
        this.user = user;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }

    public static class AuthResponseBuilder {
        private Long userId;
        private String fullName;
        private String email;
        private String token;
        private UserDto user;

        public AuthResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder user(UserDto user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(userId, fullName, email, token, user);
        }
    }
}
