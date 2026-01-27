package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Course;
import com.kavithma.Tutionweb.model.Liveclass;
import com.kavithma.Tutionweb.repository.CourseRepository;
import com.kavithma.Tutionweb.repository.LiveclassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/liveclasses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class LiveclassController {

    @Autowired
    private LiveclassRepository liveclassRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Add a live class to a course
    @PostMapping
    public Liveclass addLiveclass(@RequestParam Long courseId,
                                  @RequestParam String title,
                                  @RequestParam String meetingUrl,
                                  @RequestParam String dateTime) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Liveclass liveclass = new Liveclass(title, meetingUrl, dateTime, course);
        return liveclassRepository.save(liveclass);
    }

    // Get all live classes for a course
    @GetMapping("/course/{courseId}")
    public List<Liveclass> getLiveclassesByCourse(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return liveclassRepository.findByCourse(course);
    }

    // Update live class by ID
    @PutMapping("/{id}")
    public ResponseEntity<Liveclass> updateLiveclass(
            @PathVariable Long id,
            @RequestBody Liveclass updatedLiveclass) {

        return liveclassRepository.findById(id)
                .map(liveclass -> {
                    liveclass.setTitle(updatedLiveclass.getTitle());
                    liveclass.setMeetingUrl(updatedLiveclass.getMeetingUrl());
                    liveclass.setDateTime(updatedLiveclass.getDateTime());

                    if (updatedLiveclass.getCourse() != null) {
                        liveclass.setCourse(updatedLiveclass.getCourse());
                    }

                    Liveclass saved = liveclassRepository.save(liveclass);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete live class by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLiveclass(@PathVariable Long id) {
        if (!liveclassRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Live class not found");
        }
        liveclassRepository.deleteById(id);
        return ResponseEntity.ok("Live class deleted successfully");
    }
}
