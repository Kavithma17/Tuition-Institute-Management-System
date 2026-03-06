package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.AdminDashboardStatsDTO;
import com.kavithma.Tutionweb.repository.EnrollmentRepository;
import com.kavithma.Tutionweb.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174"})
public class AdminStatsController {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AdminStatsController(UserRepository userRepository, EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping("/stats")
    public AdminDashboardStatsDTO getAdminStats() {
        long totalStudents = userRepository.count();

        LocalDate now = LocalDate.now();
        LocalDateTime monthStart = now.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
        LocalDateTime nextMonthStart = now.with(TemporalAdjusters.firstDayOfNextMonth()).atTime(LocalTime.MIDNIGHT);

        Double revenueThisMonth = enrollmentRepository.sumRevenueBetween(monthStart, nextMonthStart);
        if (revenueThisMonth == null) revenueThisMonth = 0.0;

        long totalEnrollments = enrollmentRepository.count();

        String mostPopularCourseName = null;
        long mostPopularCourseEnrollments = 0;

        List<EnrollmentRepository.CoursePopularity> popular = enrollmentRepository.findMostPopularCourse(PageRequest.of(0, 1));
        if (!popular.isEmpty()) {
            mostPopularCourseName = popular.get(0).getCourseName();
            mostPopularCourseEnrollments = popular.get(0).getEnrollments();
        }

        return new AdminDashboardStatsDTO(
                totalStudents,
                revenueThisMonth,
                totalEnrollments,
                mostPopularCourseName,
                mostPopularCourseEnrollments
        );
    }
}
