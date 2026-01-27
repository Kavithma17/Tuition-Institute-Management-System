
package com.kavithma.Tutionweb.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "recording")
public class Recording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "video_url")
    private String videoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Course course;


    private String description;

    public Recording() {
    }

    public Recording(String title, String videoUrl, Course course, String description) {
        this.title = title;
        this.videoUrl = videoUrl;
        this.course = course;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    // Optional setter for id
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Recording{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", videoUrl='" + videoUrl + '\'' +
                ", course=" + (course != null ? course.getId() : null) +
                ", description='" + description + '\'' +
                '}';
    }
}
