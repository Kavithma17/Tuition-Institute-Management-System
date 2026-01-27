package com.kavithma.Tutionweb.security;

import com.kavithma.Tutionweb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.validateTokenAndGetUsername(token);
                System.out.println("✅ Token valid. Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("❌ Invalid JWT: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ No Bearer token found in request");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userOpt = userService.findByUsername(username);
            if (userOpt.isPresent()) {
                System.out.println("✅ User found in DB: " + username);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userOpt.get(), null, null);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("❌ User not found in DB: " + username);
            }
        }

        chain.doFilter(request, response);
    }
}
