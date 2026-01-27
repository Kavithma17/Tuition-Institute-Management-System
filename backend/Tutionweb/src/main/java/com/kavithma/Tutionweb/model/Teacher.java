package com.kavithma.Tutionweb.model;

import jakarta.persistence.*;

@Entity
@Table(name = "teacher")  // Use the exact table name in your DB
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teachername")
    private String name;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "subject")
    private String subject;

    @Column(name = "photo_url")  // or "photo" if you store as blob or base64 string
    private String photoUrl;

    public Teacher() {}

    public Teacher(String name, String qualification, String subject, String photoUrl) {
        this.name = name;
        this.qualification = qualification;
        this.subject = subject;
        this.photoUrl = photoUrl;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
