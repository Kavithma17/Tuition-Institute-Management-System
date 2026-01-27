package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.exception.ResourceNotFound;
import com.kavithma.Tutionweb.model.Course;
import com.kavithma.Tutionweb.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174"})

public class CourseController {
    @Autowired
    public CourseRepository courseRepository;
    private TeacherRepository teacherRepository;
    @Autowired
    private RecordingRepository recordingRepository;
    @Autowired
    private TutesRepository tutesRepository;
    @Autowired
    private LiveclassRepository liveclassRepository;

    //find courses
    @GetMapping
    public List<Course> getallcourses()
    {
        return courseRepository.findAll();
    }

    //add courses
    @PostMapping
    public Course createcourse(@RequestBody Course course)
    {
        return courseRepository.save(course);
    }

    //find by id
    @GetMapping("{id}")
    public ResponseEntity<Course> findbyidcourse(@PathVariable Long id)
    {
        Course course = courseRepository.findById(id).
                orElseThrow(()-> new ResourceNotFound("Course not exists by that id"+ id));
        return  ResponseEntity.ok(course);

    }
    //update course
    @PutMapping("{id}")
    public ResponseEntity<Course> updatecourse(@PathVariable long id, @RequestBody Course coursedetails)
    {
        Course updatecourse =courseRepository.findById(id).
                orElseThrow(()->new ResourceNotFound("Course not exists that id"+ id));
        updatecourse.setClassname(coursedetails.getClassname());
        updatecourse.setMonth(coursedetails.getMonth());
        updatecourse.setPrice(coursedetails.getPrice());
        updatecourse.setPhotourl(coursedetails.getPhotourl());
        updatecourse.setTeachername(coursedetails.getTeachername());

        courseRepository.save(updatecourse);
        return ResponseEntity.ok(updatecourse);

    }

    //delete

    @DeleteMapping("{id}")
    @Transactional
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Course not exists that id " + id));

        try {
            recordingRepository.deleteByCourseId(id);
            tutesRepository.deleteByCourseId(id);
            liveclassRepository.deleteByCourseId(id);

            courseRepository.delete(course);

            return ResponseEntity.ok("Course and all related content deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete course: " + e.getMessage());
        }
    }



}
