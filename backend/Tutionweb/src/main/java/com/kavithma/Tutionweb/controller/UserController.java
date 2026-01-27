package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.security.JwtUtil;
import com.kavithma.Tutionweb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // your React frontend port
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // remove "Bearer "
        String username = jwtUtil.validateTokenAndGetUsername(token);

        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        User user = userService.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        return ResponseEntity.ok(user); // returns username, email, etc.
    }

}
