package com.kavithma.Tutionweb;

import com.kavithma.Tutionweb.model.*;

import java.util.List;

public class DashboardDTO {
    private Course course;
    private List<Recording> recordings;
    private List<Tutes> tutes;
    private List<Liveclass> liveclasses;

    public DashboardDTO(Course course, List<Recording> recordings, List<Tutes> tutes, List<Liveclass> liveclasses) {
        this.course = course;
        this.recordings = recordings;
        this.tutes = tutes;
        this.liveclasses = liveclasses;
    }

    public Course getCourse() { return course; }
    public List<Recording> getRecordings() { return recordings; }
    public List<Tutes> getTutes() { return tutes; }
    public List<Liveclass> getLiveclasses() { return liveclasses; }
}
