package com.kavithma.Tutionweb.repository;

import com.kavithma.Tutionweb.model.Course;
import com.kavithma.Tutionweb.model.Recording;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecordingRepository extends JpaRepository<Recording, Long> {
    List<Recording> findByCourse(Course course);
    @Transactional
    @Modifying
    @Query("DELETE FROM Recording r WHERE r.course.id = :courseId")
    void deleteByCourseId(Long courseId);
}
