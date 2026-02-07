package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Todo;
import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.repository.TodoRepository;
import com.kavithma.Tutionweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // ✅ Get all todos of logged-in user
    @GetMapping
    public List<Todo> getMyTodos(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return todoRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    // ✅ Create new todo
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo, Authentication authentication) {
        System.out.println("AUTH = " + authentication);
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        todo.setUser(user);
        return todoRepository.save(todo);
    }

    // ✅ Toggle / update todo
    @PutMapping("/{id}")
    public Todo updateTodo(
            @PathVariable Long id,
            @RequestBody Todo updated,
            Authentication authentication
    ) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!todo.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        todo.setText(updated.getText());
        todo.setDone(updated.isDone());

        return todoRepository.save(todo);
    }

    // ✅ Delete todo
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!todo.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        todoRepository.delete(todo);
    }
}
