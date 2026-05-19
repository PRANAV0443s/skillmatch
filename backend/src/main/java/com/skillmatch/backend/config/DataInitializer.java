package com.skillmatch.backend.config;

import com.skillmatch.backend.model.Job;
import com.skillmatch.backend.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(JobRepository repository) {
        return args -> {
            if (repository.count() < 4) {
                System.out.println("Seeding SkillMatch Jobs...");
                
                Job job1 = new Job();
                job1.setTitle("Full Stack Developer");
                job1.setCompanyName("TechVision Inc");
                job1.setDescription("Looking for a developer skilled in React and Spring Boot to build secure portals.");
                job1.setRequiredSkills(List.of("React", "Spring Boot", "Java", "JavaScript"));
                
                Job job2 = new Job();
                job2.setTitle("Blockchain Engineer");
                job2.setCompanyName("SecureChain");
                job2.setDescription("Work on decentralized identity and document verification systems using Ethereum.");
                job2.setRequiredSkills(List.of("Solidity", "Blockchain", "Ethereum", "Web3"));

                Job job3 = new Job();
                job3.setTitle("Backend Architect");
                job3.setCompanyName("DataFlow Systems");
                job3.setDescription("Scale our cloud infrastructure and manage MongoDB clusters.");
                job3.setRequiredSkills(List.of("Java", "MongoDB", "AWS", "Docker"));

                Job job4 = new Job();
                job4.setTitle("Frontend Developer");
                job4.setCompanyName("PixelPerfect");
                job4.setDescription("Design beautiful user interfaces with Tailwind CSS and Framer Motion.");
                job4.setRequiredSkills(List.of("React", "Tailwind CSS", "CSS", "UI/UX"));

                repository.saveAll(List.of(job1, job2, job3, job4));
                System.out.println("SkillMatch Jobs Seeded!");
            }
        };
    }
}
