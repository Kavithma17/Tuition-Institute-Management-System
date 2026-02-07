package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Reminder;
import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.repository.ReminderRepository;
import com.kavithma.Tutionweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    // ✅ Get all reminders for logged-in user
    @GetMapping
    public List<Reminder> getMyReminders(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return reminderRepository.findByUserIdOrderByRemindAtAsc(user.getId());
    }

    // ✅ Create reminder
    @PostMapping
    public Reminder createReminder(
            @RequestBody Reminder reminder,
            Authentication authentication
    ) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (reminder.getRemindAt() == null ||
                reminder.getRemindAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Reminder time must be in the future"
            );
        }

        reminder.setUser(user);
        return reminderRepository.save(reminder);
    }

    // ✅ Update reminder
    @PutMapping("/{id}")
    public Reminder updateReminder(
            @PathVariable Long id,
            @RequestBody Reminder updated,
            Authentication authentication
    ) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        reminder.setText(updated.getText());
        reminder.setRemindAt(updated.getRemindAt());

        return reminderRepository.save(reminder);
    }

    // ✅ Delete reminder
    @DeleteMapping("/{id}")
    public void deleteReminder(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        reminderRepository.delete(reminder);
    }
}
