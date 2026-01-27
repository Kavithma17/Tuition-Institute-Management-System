package com.kavithma.Tutionweb.repository;

import com.kavithma.Tutionweb.model.Course;
import com.kavithma.Tutionweb.model.Liveclass;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LiveclassRepository extends JpaRepository<Liveclass, Long> {
    List<Liveclass> findByCourse(Course course);

    @Transactional
    @Modifying
    @Query("DELETE FROM Liveclass l WHERE l.course.id = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);
}
