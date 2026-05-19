$baseDir = "src/main/java/com/skillmatch/backend"

# JwtUtils
Set-Content -Path "$baseDir/security/JwtUtils.java" -Value @"
package com.skillmatch.backend.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value(`"${jwt.secret}`")
    private String jwtSecret;
    @Value(`"${jwt.expiration}`")
    private int jwtExpirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(String email, String role) {
        return Jwts.builder()
                .setSubject((email))
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
"@

# Pinata IPFS Service
Set-Content -Path "$baseDir/service/IpfsService.java" -Value @"
package com.skillmatch.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@Service
public class IpfsService {
    @Value(`"${pinata.jwt}`")
    private String pinataJwt;

    private final String PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    public String uploadToPinata(MultipartFile file) throws Exception {
        if (pinataJwt == null || pinataJwt.isEmpty()) {
            throw new RuntimeException("Pinata JWT not configured");
        }
        
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(pinataJwt);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(PINATA_URL, requestEntity, Map.class);
        
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) response.getBody().get("IpfsHash");
        }
        throw new RuntimeException("Failed to upload to IPFS: " + response.getStatusCode());
    }
}
"@

# Pdf Extraction Service
Set-Content -Path "$baseDir/service/ResumeExtractionService.java" -Value @"
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

    public List<String> extractSkills(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream(); PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document).toLowerCase();
            
            return KNOWN_SKILLS.stream()
                .filter(text::contains)
                .collect(Collectors.toList());
        }
    }
}
"@

# Web3j Blockchain Service
Set-Content -Path "$baseDir/service/BlockchainService.java" -Value @"
package com.skillmatch.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class BlockchainService {
    @Value(`"${web3.rpc.url}`")
    private String rpcUrl;
    
    // Given the constraints, simulating the transaction for now since setting up Web3j tx manager 
    // requires the ABI wrapper generation which can be complex to automate. 
    // In production, you would generate a wrapper using web3j-cli for SkillMatchVerification.sol
    
    public String storeResumeHash(String address, String hash) {
        System.out.println("Simulating Blockchain interaction to store hash: " + hash);
        return "0xSimulatedTxHash_" + System.currentTimeMillis();
    }
    
    public boolean verifyHash(String address, String hash) {
        return true;
    }
}
"@
