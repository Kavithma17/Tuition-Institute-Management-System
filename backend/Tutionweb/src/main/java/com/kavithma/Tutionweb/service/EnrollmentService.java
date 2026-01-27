package com.kavithma.Tutionweb.service;

import com.kavithma.Tutionweb.model.Course;
import com.kavithma.Tutionweb.model.Enrollment;
import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.repository.CourseRepository;
import com.kavithma.Tutionweb.repository.EnrollmentRepository;
import com.kavithma.Tutionweb.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public Enrollment enroll(Long userId, Long courseId, String month) {
        if (enrollmentRepository.existsByUser_IdAndCourse_IdAndMonth(userId, courseId, month)) {
            throw new RuntimeException("Already enrolled for this month");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = new Enrollment(user, course, month, "ENROLLED");
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getMyEnrollments(Long userId) {
        return enrollmentRepository.findByUser_IdOrderByEnrolledAtDesc(userId);
    }
}
