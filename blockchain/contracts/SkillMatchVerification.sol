// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SkillMatchVerification {
    // Mapping from user address to their IPFS Resume CID hash
    mapping(address => string) private userResumeHashes;

    // Event emitted when a hash is stored
    event ResumeHashStored(address indexed user, string resumeHash);

    /**
     * @dev Stores the IPFS CID hash of the user's resume
     * @param _hash The IPFS CID string
     */
    function storeResumeHash(string memory _hash) public {
        require(bytes(_hash).length > 0, "Hash cannot be empty");
        userResumeHashes[msg.sender] = _hash;
        emit ResumeHashStored(msg.sender, _hash);
    }

    /**
     * @dev Retrieves the stored resume hash for a specific user
     * @param _user The address of the user
     * @return The IPFS CID string
     */
    function getResumeHash(address _user) public view returns (string memory) {
        return userResumeHashes[_user];
    }
}
