package com.skillmatch.backend.repository;

import com.skillmatch.backend.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<String> findJobIdsByCandidateId(String candidateId);
    Optional<Application> findByJobIdAndCandidateId(String jobId, String candidateId);
    List<Application> findByCandidateId(String candidateId);
}
