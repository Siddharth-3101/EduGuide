package com.skillbridge.portfolio.dto;

public class PortfolioUpdateRequest {
    private String bio;
    private Boolean isPublic;
    private String username;

    public PortfolioUpdateRequest() {}

    public PortfolioUpdateRequest(String bio, Boolean isPublic, String username) {
        this.bio = bio;
        this.isPublic = isPublic;
        this.username = username;
    }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean public1) { isPublic = public1; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
