package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Enrollment;
import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5174")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // 🔐 ENROLL (JWT REQUIRED)
    @PostMapping
    public Enrollment enroll(
            @RequestParam Long courseId,
            @RequestParam String month,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return enrollmentService.enroll(user.getId(), courseId, month);
    }

    // 🔐 GET MY ENROLLMENTS
    @GetMapping("/my")
    public List<Enrollment> myEnrollments(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return enrollmentService.getMyEnrollments(user.getId());
    }
}

