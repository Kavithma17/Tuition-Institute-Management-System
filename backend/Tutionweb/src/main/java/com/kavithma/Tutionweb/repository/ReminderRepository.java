package com.kavithma.Tutionweb.repository;

import com.kavithma.Tutionweb.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUserIdOrderByRemindAtAsc(Long userId);
}
