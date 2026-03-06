package com.kavithma.Tutionweb.repository;

import com.kavithma.Tutionweb.model.Enrollment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.kavithma.Tutionweb.model.User;

import java.time.LocalDateTime;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUser_IdAndCourse_IdAndMonth(Long userId, Long courseId, String month);
    List<Enrollment> findByUser(User user);

    List<Enrollment> findByUser_IdOrderByEnrolledAtDesc(Long userId);

    @Query("select coalesce(sum(e.course.price), 0) from Enrollment e where e.enrolledAt >= :start and e.enrolledAt < :end")
    Double sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    interface CoursePopularity {
        Long getCourseId();
        String getCourseName();
        long getEnrollments();
    }

    @Query("select e.course.id as courseId, e.course.classname as courseName, count(e) as enrollments from Enrollment e group by e.course.id, e.course.classname order by enrollments desc")
    List<CoursePopularity> findMostPopularCourse(Pageable pageable);
}
