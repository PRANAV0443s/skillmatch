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
    public ResponseEntity<?> createJob(@RequestBody Job job, @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.length() < 7) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }
            // Simple verification for role. Real app would use Spring Security's @PreAuthorize
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !user.getRole().name().equals("EMPLOYER")) {
            return ResponseEntity.status(403).body("Only employers can create jobs");
        }
        job.setEmployerId(user.getId());
        jobRepository.save(job);
        return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating job: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getJobs(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.length() < 7) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            List<Job> allJobs = jobRepository.findAll();
            
            if (user.getRole().name().equals("CANDIDATE")) {
                if (!user.isVerified()) {
                    return ResponseEntity.status(403).body("Upload resume to see matching jobs");
                }
                
                List<String> userSkills = user.getSkills();
                // Fallback: If user is verified but has no skills extracted yet, show all jobs
                if (userSkills == null || userSkills.isEmpty()) {
                    return ResponseEntity.ok(allJobs);
                }
                
                List<Job> matchedJobs = allJobs.stream()
                    .filter(job -> {
                        if (job.getRequiredSkills() == null || job.getRequiredSkills().isEmpty()) return true;
                        return job.getRequiredSkills().stream()
                            .anyMatch(skill -> userSkills.stream().anyMatch(us -> us.equalsIgnoreCase(skill)));
                    })
                    .collect(java.util.stream.Collectors.toList());
                
                // If no specific skill matches found, still return all jobs so the UI isn't empty
                return ResponseEntity.ok(matchedJobs.isEmpty() ? allJobs : matchedJobs);
            } else if (user.getRole().name().equals("EMPLOYER")) {
                List<Job> employerJobs = allJobs.stream()
                    .filter(job -> user.getId().equals(job.getEmployerId()))
                    .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(employerJobs);
            }
            
            return ResponseEntity.ok(allJobs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching jobs: " + e.getMessage());
        }
    }
}
