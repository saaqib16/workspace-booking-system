package com.company.workspace.service;

import com.company.workspace.dto.AuthResponse;
import com.company.workspace.dto.LoginRequest;
import com.company.workspace.dto.RegisterRequest;
import com.company.workspace.model.User;
import com.company.workspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        Optional<User> existing = userRepository.findByEmail(email);

        if (existing.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(normalizeRole(request.getRole()));

        return AuthResponse.fromUser(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordMatches(request.getPassword(), user)) {
            throw new RuntimeException("Invalid password");
        }

        return AuthResponse.fromUser(user);
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String normalizeRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            return "EMPLOYEE";
        }

        return role.trim().toUpperCase();
    }

    private boolean passwordMatches(String rawPassword, User user) {
        String storedPassword = user.getPassword();

        if (storedPassword == null || rawPassword == null) {
            return false;
        }

        // Support older plain-text records and upgrade them on successful login.
        if (storedPassword.equals(rawPassword)) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            return true;
        }

        return passwordEncoder.matches(rawPassword, storedPassword);
    }
}
