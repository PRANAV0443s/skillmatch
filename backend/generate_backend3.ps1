$baseDir = "src/main/java/com/skillmatch/backend"

# AuthController
Set-Content -Path "$baseDir/controller/AuthController.java" -Value @"
package com.skillmatch.backend.controller;

import com.skillmatch.backend.dto.AuthRequest;
import com.skillmatch.backend.dto.AuthResponse;
import com.skillmatch.backend.model.User;
import com.skillmatch.backend.repository.UserRepository;
import com.skillmatch.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use!");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Note: For simplicity, converting string to enum, add try-catch in production
        user.setRole(com.skillmatch.backend.model.Role.valueOf(request.getRole().toUpperCase()));
        
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Bad credentials");
        }

        String jwt = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(jwt, user.getRole().name(), user.getName()));
    }
}
"@

# JobController
Set-Content -Path "$baseDir/controller/JobController.java" -Value @"
package com.skillmatch.backend.controller;

import com.skillmatch.backend.model.Job;
import com.skillmatch.backend.model.User;
import com.skillmatch.backend.repository.JobRepository;
import com.skillmatch.backend.repository.UserRepository;
import com.skillmatch.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {
    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtils jwtUtils;

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job, @RequestHeader("Authorization") String token) {
        // Simple verification for role. Real app would use Spring Security's @PreAuthorize
        String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !user.getRole().name().equals("EMPLOYER")) {
            return ResponseEntity.status(403).body("Only employers can create jobs");
        }
        job.setEmployerId(user.getId());
        jobRepository.save(job);
        return ResponseEntity.ok(job);
    }

    @GetMapping
    public ResponseEntity<?> getJobs(@RequestHeader("Authorization") String token) {
        String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        if (user.getRole().name().equals("CANDIDATE") && !user.isVerified()) {
             return ResponseEntity.status(403).body("Upload resume to see matching jobs");
        }
        return ResponseEntity.ok(jobRepository.findAll());
    }
}
"@

# CandidateController
Set-Content -Path "$baseDir/controller/CandidateController.java" -Value @"
package com.skillmatch.backend.controller;

import com.skillmatch.backend.model.User;
import com.skillmatch.backend.repository.UserRepository;
import com.skillmatch.backend.security.JwtUtils;
import com.skillmatch.backend.service.IpfsService;
import com.skillmatch.backend.service.ResumeExtractionService;
import com.skillmatch.backend.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/candidate")
@CrossOrigin(origins = "*")
public class CandidateController {
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private IpfsService ipfsService;
    @Autowired private ResumeExtractionService resumeExtractionService;
    @Autowired private BlockchainService blockchainService;

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            
            // 1. Store file on IPFS
            String cid = ipfsService.uploadToPinata(file);
            
            // 2. Extract Skills
            var skills = resumeExtractionService.extractSkills(file);
            
            // 3. Store hash on Blockchain
            String txHash = blockchainService.storeResumeHash(user.getId(), cid);
            
            // 4. Update user profile
            user.setResumeCid(cid);
            user.setResumeHashTx(txHash);
            user.setVerified(true);
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("cid", cid);
            response.put("skills", skills);
            response.put("txHash", txHash);
            response.put("isVerified", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
             return ResponseEntity.badRequest().body("Failed to process resume: " + e.getMessage());
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByEmail(email).orElse(null);
        return ResponseEntity.ok(user);
    }
}
"@
