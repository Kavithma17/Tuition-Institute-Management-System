package com.kavithma.Tutionweb.repository;

import com.kavithma.Tutionweb.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.User;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUser_IdAndCourse_IdAndMonth(Long userId, Long courseId, String month);
    List<Enrollment> findByUser(User user);

    List<Enrollment> findByUser_IdOrderByEnrolledAtDesc(Long userId);
}
