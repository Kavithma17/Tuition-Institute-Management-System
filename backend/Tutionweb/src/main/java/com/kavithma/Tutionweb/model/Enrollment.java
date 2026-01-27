package com.kavithma.Tutionweb.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer progress = 0;

    public Enrollment() {}

    public Enrollment(User user, Course course, String month, String status) {
        this.user = user;
        this.course = course;
        this.month = month;
        this.status = status;
        this.progress = 0;
        this.enrolledAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.enrolledAt == null) {
            this.enrolledAt = LocalDateTime.now();
        }
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }
}
