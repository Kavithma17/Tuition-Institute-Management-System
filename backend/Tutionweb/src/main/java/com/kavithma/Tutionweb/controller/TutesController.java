package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Course;
import com.kavithma.Tutionweb.model.Tutes;
import com.kavithma.Tutionweb.repository.CourseRepository;
import com.kavithma.Tutionweb.repository.TutesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TutesController {

    @Autowired
    private TutesRepository tutesRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Add a tute to a course
    @PostMapping
    public Tutes addTute(@RequestParam Long courseId,
                         @RequestParam String title,
                         @RequestParam String fileUrl) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Tutes tute = new Tutes(title, fileUrl, course);
        return tutesRepository.save(tute);
    }

    // Get all tutes for a course
    @GetMapping("/course/{courseId}")
    public List<Tutes> getTutesByCourse(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return tutesRepository.findByCourse(course);
    }

    // Update tute by ID
    @PutMapping("/{id}")
    public ResponseEntity<Tutes> updateTute(@PathVariable Long id,
                                            @RequestBody Tutes updatedTute) {
        return tutesRepository.findById(id)
                .map(tute -> {
                    tute.setTitle(updatedTute.getTitle());
                    tute.setFileUrl(updatedTute.getFileUrl());

                    if (updatedTute.getCourse() != null) {
                        tute.setCourse(updatedTute.getCourse());
                    }

                    Tutes saved = tutesRepository.save(tute);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete tute by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTute(@PathVariable Long id) {
        if (!tutesRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Tute not found");
        }
        tutesRepository.deleteById(id);
        return ResponseEntity.ok("Tute deleted successfully");
    }
}
