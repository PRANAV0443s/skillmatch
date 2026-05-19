package com.skillmatch.backend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeExtractionService {
    
    // Basic set of skills to match against
    private final List<String> KNOWN_SKILLS = Arrays.asList(
        "java", "spring", "react", "javascript", "python", "mongodb", "sql", "blockchain", "solidity", "node"
    );

    public List<String> extractSkills(MultipartFile file) {
        try (InputStream is = file.getInputStream(); PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document).toLowerCase();
            
            return KNOWN_SKILLS.stream()
                .filter(text::contains)
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Failed to extract skills: " + e.getMessage());
            return List.of(); // Return empty list on failure
        }
    }
}
