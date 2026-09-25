package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String jobTitle;

    @Column(nullable = false)
    private String company;

    private String location;
    private String employmentType;
    private String salary;
    private String requiredSkills;
    private String applicationUrl;
    private Boolean remote = false;
    private String experienceLevel;

    public Job() {}

    public Job(Long id, String jobTitle, String company, String location, String employmentType, String salary, String requiredSkills, String applicationUrl, Boolean remote, String experienceLevel) {
        this.id = id;
        this.jobTitle = jobTitle;
        this.company = company;
        this.location = location;
        this.employmentType = employmentType;
        this.salary = salary;
        this.requiredSkills = requiredSkills;
        this.applicationUrl = applicationUrl;
        this.remote = remote != null ? remote : false;
        this.experienceLevel = experienceLevel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getApplicationUrl() { return applicationUrl; }
    public void setApplicationUrl(String applicationUrl) { this.applicationUrl = applicationUrl; }

    public Boolean getRemote() { return remote; }
    public void setRemote(Boolean remote) { this.remote = remote; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public static JobBuilder builder() { return new JobBuilder(); }

    public static class JobBuilder {
        private Long id;
        private String jobTitle;
        private String company;
        private String location;
        private String employmentType;
        private String salary;
        private String requiredSkills;
        private String applicationUrl;
        private Boolean remote = false;
        private String experienceLevel;

        public JobBuilder id(Long id) { this.id = id; return this; }
        public JobBuilder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public JobBuilder company(String company) { this.company = company; return this; }
        public JobBuilder location(String location) { this.location = location; return this; }
        public JobBuilder employmentType(String employmentType) { this.employmentType = employmentType; return this; }
        public JobBuilder salary(String salary) { this.salary = salary; return this; }
        public JobBuilder requiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public JobBuilder applicationUrl(String applicationUrl) { this.applicationUrl = applicationUrl; return this; }
        public JobBuilder remote(Boolean remote) { this.remote = remote; return this; }
        public JobBuilder experienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; return this; }

        public Job build() {
            return new Job(id, jobTitle, company, location, employmentType, salary, requiredSkills, applicationUrl, remote, experienceLevel);
        }
    }
}
