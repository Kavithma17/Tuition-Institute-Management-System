package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.DashboardDTO;
import com.kavithma.Tutionweb.model.*;
import com.kavithma.Tutionweb.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // Allow frontend calls
public class DashboardController {

    @Autowired
    private UserRepository userRepository;




    @Autowired
    private RecordingRepository recordingRepository;

    @Autowired
    private TutesRepository tutesRepository;

    @Autowired
    private LiveclassRepository liveclassRepository;

    @GetMapping("/{userId}")
    public List<DashboardDTO> getStudentDashboard(@PathVariable Long userId) {
        // Fetch the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<DashboardDTO> dashboardData = new ArrayList<>();

        // Make sure User has a method getEnrolledCourses()


        return dashboardData;
    }

}

