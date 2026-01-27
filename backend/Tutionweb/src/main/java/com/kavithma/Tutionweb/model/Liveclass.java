package com.kavithma.Tutionweb.model;

import jakarta.persistence.*;

@Entity
@Table(name = "liveclass")
public class Liveclass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String meetingUrl;
    private String dateTime; // can change to LocalDateTime if needed

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    public Liveclass() {}

    public Liveclass(String title, String meetingUrl, String dateTime, Course course) {
        this.title = title;
        this.meetingUrl = meetingUrl;
        this.dateTime = dateTime;
        this.course = course;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String meetingUrl) { this.meetingUrl = meetingUrl; }
    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}
