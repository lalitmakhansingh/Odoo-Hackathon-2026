package com.stocksense.auth;

import com.stocksense.common.ApiResponse;
import com.stocksense.security.JwtUtils;
import com.stocksense.user.Role;
import com.stocksense.user.RoleRepository;
import com.stocksense.user.User;
import com.stocksense.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, RoleRepository roleRepository,
                          OtpRepository otpRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signup(@Valid @RequestBody SignupReq req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        String roleName = req.getRole() != null ? req.getRole() : "WAREHOUSE_STAFF";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));

        User user = new User(
                req.getName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                role
        );

        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", "Registration Successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginReq req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole().getName()
                )
        ), "Login Successful"));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpToken token = new OtpToken(email, otp, LocalDateTime.now().plusMinutes(10));
        otpRepository.save(token);

        return ResponseEntity.ok(ApiResponse.success(otp, "OTP sent successfully (Simulated)"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        boolean isValid = otpRepository.findByEmailAndOtp(email, otp)
                .map(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElse(false);

        if (!isValid) throw new RuntimeException("Invalid or expired OTP");
        return ResponseEntity.ok(ApiResponse.success(true, "OTP verified successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password updated", "Password Reset Successful"));
    }

    public static class SignupReq {
        private String name;
        private String email;
        private String password;
        private String role;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class LoginReq {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}