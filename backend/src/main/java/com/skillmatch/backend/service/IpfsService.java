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
    @Value("${pinata.api.key:}")
    private String pinataApiKey;

    @Value("${pinata.api.secret:}")
    private String pinataApiSecret;

    @Value("${pinata.jwt:}")
    private String pinataJwt;

    private final String PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    @SuppressWarnings("rawtypes")
    public String uploadToPinata(MultipartFile file) throws Exception {
        // Use API Key/Secret if available, otherwise fallback to JWT
        boolean useApiKey = (pinataApiKey != null && !pinataApiKey.isEmpty()) &&
                (pinataApiSecret != null && !pinataApiSecret.isEmpty());

        if (!useApiKey && (pinataJwt == null || pinataJwt.isEmpty() || pinataJwt.equals("${pinata.jwt}"))) {
            System.out.println("Pinata credentials not configured. Returning mock CID for testing.");
            return "QmMockHash" + System.currentTimeMillis();
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        if (useApiKey) {
            headers.set("pinata_api_key", pinataApiKey);
            headers.set("pinata_secret_api_key", pinataApiSecret);
        } else {
            headers.setBearerAuth(pinataJwt);
        }

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(PINATA_URL, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (String) response.getBody().get("IpfsHash");
            }

            System.err.println(
                    "Pinata Upload Failed. Status: " + response.getStatusCode() + ", Body: " + response.getBody());
            throw new RuntimeException("Failed to upload to IPFS: " + response.getStatusCode());

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("Pinata API Error: " + e.getResponseBodyAsString());
            throw new RuntimeException("Pinata API Error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("Unexpected Error during Pinata Upload: " + e.getMessage());
            throw e;
        }
    }
}
