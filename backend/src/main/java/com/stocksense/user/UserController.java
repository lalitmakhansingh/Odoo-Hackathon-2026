package com.stocksense.user;

import com.stocksense.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(user, "Profile loaded"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateProfile(Authentication auth, @RequestBody User req) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(req.getName());
        return ResponseEntity.ok(ApiResponse.success(userRepository.save(user), "Profile updated successfully"));
    }
}