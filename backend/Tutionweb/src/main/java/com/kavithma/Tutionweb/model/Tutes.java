package com.kavithma.Tutionweb.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tutes")
public class Tutes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String fileUrl; // PDF or DOC link

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    public Tutes() {}

    public Tutes(String title, String fileUrl, Course course) {
        this.title = title;
        this.fileUrl = fileUrl;
        this.course = course;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}
