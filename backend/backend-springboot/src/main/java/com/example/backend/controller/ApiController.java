package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.DashboardItem;
import com.example.backend.service.DataService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class ApiController {

    private final DataService dataService;

    public ApiController(DataService dataService) {
        this.dataService = dataService;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User newUser) throws IOException {
        List<User> users = dataService.getUsersFromDb();
        newUser.setUserid(UUID.randomUUID().toString());
        newUser.setCreatedAt(new Date().toString());
        users.add(newUser);
        dataService.saveUsersToDb(users);
        dataService.addUserToDetails(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) throws IOException {
        String username = credentials.get("username");
        String password = credentials.get("password");

        return dataService.getUsersFromDb().stream()
                .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
                .findFirst()
                .map(user -> ResponseEntity.ok(Map.of(
                        "userid", user.getUserid(),
                        "username", user.getUsername(),
                        "email", user.getEmail()
                )))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials")));
    }

    @GetMapping("/details/{userId}")
    public List<DashboardItem> getUserDetails(@PathVariable String userId) throws IOException {
        return dataService.getDashboardForUser(userId);
    }

    @PostMapping("/details/{userId}")
    public ResponseEntity<DashboardItem> addDetail(
            @PathVariable String userId,
            @RequestBody DashboardItem newItem) throws IOException {

        List<DashboardItem> dashboard = dataService.getDashboardForUser(userId);
        newItem.setId(UUID.randomUUID().toString());
        newItem.setDate(new Date().toString());
        dashboard.add(newItem);

        dataService.saveDashboardForUser(userId, dashboard);
        return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
    }
}
