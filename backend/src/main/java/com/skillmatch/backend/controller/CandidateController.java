package com.skillmatch.backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.skillmatch.backend.model.Application;
import com.skillmatch.backend.model.Job;
import com.skillmatch.backend.model.User;
import com.skillmatch.backend.repository.ApplicationRepository;
import com.skillmatch.backend.repository.JobRepository;
import com.skillmatch.backend.repository.UserRepository;
import com.skillmatch.backend.security.JwtUtils;
import com.skillmatch.backend.service.BlockchainService;
import com.skillmatch.backend.service.EmailService;
import com.skillmatch.backend.service.IpfsService;
import com.skillmatch.backend.service.ResumeExtractionService;

@RestController
@RequestMapping("/api/candidate")
@CrossOrigin(origins = "*")
public class CandidateController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private IpfsService ipfsService;
    @Autowired
    private ResumeExtractionService resumeExtractionService;
    @Autowired
    private BlockchainService blockchainService;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private EmailService emailService;

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.length() < 7) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body("User profile not found. Please log in again.");
            }

            // 1. Store file on IPFS
            System.out.println("Uploading to IPFS...");
            String cid = ipfsService.uploadToPinata(file);
            System.out.println("IPFS Upload Success. CID: " + cid);

            // 2. Extract Skills
            System.out.println("Extracting skills...");
            var skills = resumeExtractionService.extractSkills(file);
            System.out.println("Skills extracted: " + skills);

            // 3. Store hash on Blockchain
            System.out.println("Storing hash on blockchain...");
            String txHash = blockchainService.storeResumeHash(user.getId(), cid);
            System.out.println("Blockchain storage complete. TX: " + txHash);

            // 4. Update user profile
            user.setResumeCid(cid);
            user.setResumeHashTx(txHash);
            user.setVerified(true);
            user.setSkills(skills);
            userRepository.save(user);
            System.out.println("User profile updated.");

            Map<String, Object> response = new HashMap<>();
            response.put("cid", cid);
            response.put("skills", skills);
            response.put("txHash", txHash);
            response.put("isVerified", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("UPLOAD FAILED: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to process resume: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.length() < 7) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body("User session expired or not found");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching profile: " + e.getMessage());
        }
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyForJob(@PathVariable String jobId,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.length() < 7) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null)
                return ResponseEntity.status(404).body("User not found");

            Job job = jobRepository.findById(jobId).orElse(null);
            if (job == null)
                return ResponseEntity.status(404).body("Job offer not found");

            if (!user.isVerified()) {
                return ResponseEntity.badRequest().body("Profile must be verified before applying.");
            }

            if (applicationRepository.findByJobIdAndCandidateId(jobId, user.getId()).isPresent()) {
                return ResponseEntity.badRequest().body("Already applied for this job.");
            }

            Application app = new Application();
            app.setJobId(jobId);
            app.setCandidateId(user.getId());
            app.setStatus("APPLIED");
            app.setAppliedAt(LocalDateTime.now());
            applicationRepository.save(app);

            // Calculate Match Score
            int matchScore = calculateMatchScore(user.getSkills(), job.getRequiredSkills());

            // Send Confirmation Email
            emailService.sendApplicationConfirmation(
                    user.getEmail(),
                    user.getName(),
                    job.getTitle(),
                    job.getCompanyName(),
                    app.getStatus(),
                    matchScore);

            return ResponseEntity.ok("Application submitted successfully! Confirmation email sent.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error applying for job: " + e.getMessage());
        }
    }

    private int calculateMatchScore(List<String> userSkills, List<String> jobSkills) {
        if (jobSkills == null || jobSkills.isEmpty())
            return 100;
        if (userSkills == null || userSkills.isEmpty())
            return 0;

        long matches = jobSkills.stream()
                .filter(js -> userSkills.stream().anyMatch(us -> us.equalsIgnoreCase(js)))
                .count();

        return (int) ((double) matches / jobSkills.size() * 100);
    }

    @GetMapping("/applied-jobs")
    public ResponseEntity<?> getAppliedJobs(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.length() < 7) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null)
                return ResponseEntity.status(401).body("User not found");

            List<Application> apps = applicationRepository.findByCandidateId(user.getId());
            List<String> jobIds = apps.stream().map(Application::getJobId).collect(Collectors.toList());
            return ResponseEntity.ok(jobIds);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching applied jobs: " + e.getMessage());
        }
    }
}
