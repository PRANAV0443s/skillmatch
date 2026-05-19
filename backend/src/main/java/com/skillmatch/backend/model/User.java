package com.skillmatch.backend.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String resumeCid; // IPFS CID
    private String resumeHashTx; // Blockchain TX hash
    private boolean verified;
    private List<String> skills;
}
