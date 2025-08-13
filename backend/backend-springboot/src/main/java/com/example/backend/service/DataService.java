package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.DashboardItem;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class DataService {
    private final ObjectMapper mapper = new ObjectMapper();

    private File getDbFile() throws IOException {
        return new ClassPathResource("db.json").getFile();
    }

    private File getDetailsFile() throws IOException {
        return new ClassPathResource("details.json").getFile();
    }

    // ===== USERS =====
    public List<User> getUsersFromDb() throws IOException {
        Map<String, List<User>> data = mapper.readValue(
                getDbFile(),
                new TypeReference<Map<String, List<User>>>() {}
        );
        return data.getOrDefault("users", new ArrayList<>());
    }

    public void saveUsersToDb(List<User> users) throws IOException {
        Map<String, List<User>> wrapper = new HashMap<>();
        wrapper.put("users", users);
        mapper.writerWithDefaultPrettyPrinter().writeValue(getDbFile(), wrapper);
    }

    // ===== DASHBOARD =====
    public List<DashboardItem> getDashboardForUser(String userId) throws IOException {
        Map<String, List<User>> data = mapper.readValue(
                getDetailsFile(),
                new TypeReference<Map<String, List<User>>>() {}
        );

        return data.getOrDefault("users", new ArrayList<>()).stream()
                .filter(u -> u.getUserid().equals(userId))
                .findFirst()
                .map(User::getDashboard)
                .orElse(new ArrayList<>());
    }

    public void saveDashboardForUser(String userId, List<DashboardItem> dashboard) throws IOException {
        Map<String, List<User>> data = mapper.readValue(
                getDetailsFile(),
                new TypeReference<Map<String, List<User>>>() {}
        );

        data.getOrDefault("users", new ArrayList<>()).forEach(user -> {
            if (user.getUserid().equals(userId)) {
                user.setDashboard(dashboard);
            }
        });

        mapper.writerWithDefaultPrettyPrinter().writeValue(getDetailsFile(), data);
    }

    public void addUserToDetails(User newUser) throws IOException {
        Map<String, List<User>> data = mapper.readValue(
                getDetailsFile(),
                new TypeReference<Map<String, List<User>>>() {}
        );

        if (!data.containsKey("users")) {
            data.put("users", new ArrayList<>());
        }

        newUser.setDashboard(new ArrayList<>());
        data.get("users").add(newUser);

        mapper.writerWithDefaultPrettyPrinter().writeValue(getDetailsFile(), data);
    }
}
