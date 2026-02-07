package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Enrollment;
import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.repository.UserRepository;
import com.kavithma.Tutionweb.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5174")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserRepository userRepository;

    public EnrollmentController(
            EnrollmentService enrollmentService,
            UserRepository userRepository
    ) {
        this.enrollmentService = enrollmentService;
        this.userRepository = userRepository;
    }

    // 🔐 ENROLL (JWT REQUIRED)
    @PostMapping
    public Enrollment enroll(
            @RequestParam Long courseId,
            @RequestParam String month,
            Authentication authentication
    ) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return enrollmentService.enroll(user.getId(), courseId, month);
    }

    // 🔐 GET MY ENROLLMENTS
    @GetMapping("/my")
    public List<Enrollment> myEnrollments(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return enrollmentService.getMyEnrollments(user.getId());
    }
}
