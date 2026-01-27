package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.User;
import com.kavithma.Tutionweb.security.JwtUtil;
import com.kavithma.Tutionweb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        var optionalUser = userService.findByUsername(user.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        User dbUser = optionalUser.get();

        if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        String token = jwtUtil.generateToken(dbUser.getUsername());

        // ✅ RETURN JSON (not plain string)
        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "username", dbUser.getUsername()
                )
        );
    }
}
