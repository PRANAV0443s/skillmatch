# SkillMatch - Blockchain-Based Job Portal

SkillMatch is a revolutionary, blockchain-powered hiring platform designed to solve the modern hiring crisis. By leveraging Web3 technologies, SkillMatch eliminates fake resumes through immutable verification, ensuring a secure, credible, and transparent environment for both candidates and employers.

## 🚀 Features

- **Blockchain Verification:** Immutable storage and verification of candidate credentials and resumes to prevent fraud.
- **Smart Contracts:** Built with Solidity and Hardhat, integrating decentralized validation for authentic work experiences and skills.
- **IPFS Integration:** Secure and decentralized storage for user resumes utilizing Pinata.
- **Role-Based Portals:** Dedicated and dynamic dashboards tailored for Candidates and Employers/Recruiters.
- **Automated Notifications:** Robust email notification system for job applications and status updates.
- **Modern UI:** High-fidelity, responsive frontend built with React, Vite, and TailwindCSS for a premium user experience.

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- TailwindCSS
- Ethers.js (Web3 Integration)

### Backend
- Java 17
- Spring Boot
- Spring Security (JWT Authentication)
- Spring Data JPA
- JavaMailSender (Email notifications)

### Blockchain
- Solidity
- Hardhat
- IPFS (Pinata for decentralized storage)

## 📋 Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v16 or higher)
- Java 17+
- Maven
- MetaMask (or another Web3 Wallet) for blockchain interactions

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PRANAV0443s/skillmatch.git
   cd skillmatch
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   - Update your database credentials and API keys (SMTP, IPFS) in `backend/src/main/resources/application.properties`.
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

4. **Blockchain Setup (Local Node):**
   ```bash
   cd blockchain
   npm install
   npx hardhat node
   
   # In a new terminal, deploy the smart contract
   npx hardhat ignition deploy ./ignition/modules/SkillMatchVerification.js --network localhost
   ```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page and submit a Pull Request.

## 📜 License

This project is licensed under the MIT License.
