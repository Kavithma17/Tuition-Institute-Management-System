package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Course;
import com.kavithma.Tutionweb.model.Recording;
import com.kavithma.Tutionweb.repository.CourseRepository;
import com.kavithma.Tutionweb.repository.RecordingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recordings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RecordingController {

    @Autowired
    private RecordingRepository recordingRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Add a recording to a course
    // Add a recording to a course
    @PostMapping
    public Recording addRecording(@RequestParam Long courseId,
                                  @RequestParam String title,
                                  @RequestParam String url,
                                  @RequestParam(required = false) String description) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Use the 4-parameter constructor, pass empty string if description is null
        Recording recording = new Recording(title, url, course, description != null ? description : "");

        return recordingRepository.save(recording);
    }

    // Get all recordings for a course
    @GetMapping("/course/{courseId}")
    public List<Recording> getRecordingsByCourse(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return recordingRepository.findByCourse(course);
    }

    // Update recording by ID
    @PutMapping("/{id}")
    public Recording updateRecording(@PathVariable Long id,
                                     @RequestBody Recording updatedRecording) {
        Recording recording = recordingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recording not found"));

        recording.setTitle(updatedRecording.getTitle());
        recording.setVideoUrl(updatedRecording.getVideoUrl());
        recording.setDescription(updatedRecording.getDescription());

        // Optional: update course if you want
        // recording.setCourse(updatedRecording.getCourse());

        return recordingRepository.save(recording);
    }

    // Delete recording by ID
    @DeleteMapping("/{id}")
    public void deleteRecording(@PathVariable Long id) {
        if (!recordingRepository.existsById(id)) {
            throw new RuntimeException("Recording not found");
        }
        recordingRepository.deleteById(id);
    }
}
