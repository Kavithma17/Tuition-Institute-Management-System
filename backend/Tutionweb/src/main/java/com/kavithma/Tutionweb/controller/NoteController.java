package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Note;
import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.repository.NoteRepository;
import com.kavithma.Tutionweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    // ✅ Get all notes for logged-in user
    @GetMapping
    public List<Note> getMyNotes(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return noteRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
    }

    // ✅ Create note
    @PostMapping
    public Note createNote(@RequestBody Note note, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        note.setUser(user);
        return noteRepository.save(note);
    }

    // ✅ Update note
    @PutMapping("/{id}")
    public Note updateNote(
            @PathVariable Long id,
            @RequestBody Note updated,
            Authentication authentication
    ) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Note note = noteRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        note.setTitle(updated.getTitle());
        note.setBody(updated.getBody());

        return noteRepository.save(note);
    }

    // ✅ Delete note
    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Note note = noteRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        noteRepository.delete(note);
    }
}
