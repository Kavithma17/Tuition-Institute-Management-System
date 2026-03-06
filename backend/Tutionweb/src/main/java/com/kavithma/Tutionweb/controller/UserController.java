package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.security.JwtUtil;
import com.kavithma.Tutionweb.repository.UserRepository;
import com.kavithma.Tutionweb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5174") // your React frontend port
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public static class UpdateSettingsRequest {
        private String email;
        private String currentPassword;
        private String newPassword;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

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

        return ResponseEntity.ok(
            Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
            )
        );
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateSettingsRequest request
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.validateTokenAndGetUsername(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        User user = userService.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Update email (optional)
        if (request.getEmail() != null) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.isEmpty() && !newEmail.equalsIgnoreCase(user.getEmail())) {
                var existing = userRepository.findByEmail(newEmail);
                if (existing.isPresent() && !existing.get().getId().equals(user.getId())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already registered!");
                }
                user.setEmail(newEmail);
            }
        }

        // Update password (optional)
        boolean wantsPasswordChange = request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty();
        if (wantsPasswordChange) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is required");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(
                Map.of(
                        "username", saved.getUsername(),
                        "email", saved.getEmail()
                )
        );
    }

}
