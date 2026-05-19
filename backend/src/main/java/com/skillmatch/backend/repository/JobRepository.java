package com.skillmatch.backend.repository;
import com.skillmatch.backend.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRepository extends MongoRepository<Job, String> {
}
