package com.company.workspace.controller;
import jakarta.validation.Valid;
import com.company.workspace.model.User;
import com.company.workspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    // Register API
    @PostMapping("/register")
    public User register(@Valid @RequestBody User user) {
        return userService.register(user);
    }

    // Login API
    @PostMapping("/login")
    public User login(@RequestParam String email,
                      @RequestParam String password) {

        return userService.login(email, password);
    }
}
