$baseDir = "src/main/java/com/skillmatch/backend"
New-Item -ItemType Directory -Force -Path "$baseDir/config"
New-Item -ItemType Directory -Force -Path "$baseDir/controller"
New-Item -ItemType Directory -Force -Path "$baseDir/model"
New-Item -ItemType Directory -Force -Path "$baseDir/repository"
New-Item -ItemType Directory -Force -Path "$baseDir/security"
New-Item -ItemType Directory -Force -Path "$baseDir/service"
New-Item -ItemType Directory -Force -Path "$baseDir/dto"

# User Model
Set-Content -Path "$baseDir/model/User.java" -Value @"
package com.skillmatch.backend.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = `"users`")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String resumeCid; // IPFS CID
    private String resumeHashTx; // Blockchain TX hash
    private boolean isVerified;
}

enum Role { CANDIDATE, EMPLOYER }
"@

# Job Model
Set-Content -Path "$baseDir/model/Job.java" -Value @"
package com.skillmatch.backend.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = `"jobs`")
public class Job {
    @Id
    private String id;
    private String title;
    private String description;
    private List<String> requiredSkills;
    private String employerId;
}
"@

# Auth DTOs
Set-Content -Path "$baseDir/dto/AuthRequest.java" -Value @"
package com.skillmatch.backend.dto;
import lombok.Data;
@Data
public class AuthRequest {
    private String email;
    private String password;
    private String name;
    private String role;
}
"@

Set-Content -Path "$baseDir/dto/AuthResponse.java" -Value @"
package com.skillmatch.backend.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String name;
}
"@

# Repositories
Set-Content -Path "$baseDir/repository/UserRepository.java" -Value @"
package com.skillmatch.backend.repository;
import com.skillmatch.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
"@

Set-Content -Path "$baseDir/repository/JobRepository.java" -Value @"
package com.skillmatch.backend.repository;
import com.skillmatch.backend.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRepository extends MongoRepository<Job, String> {
}
"@

# Note: We still need to write Security, Services (IPFS, Blockchain, Resume), and Controllers
