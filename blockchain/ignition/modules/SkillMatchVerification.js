import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SkillMatchVerificationModule", (m) => {
  const contract = m.contract("SkillMatchVerification");
  return { contract };
});
