import { ethers } from "ethers";
import * as readlineSync from "readline-sync";
import * as dotenv from "dotenv";
dotenv.config();

const contractABI = require("../artifacts/contracts/VotingDApp.sol/Voting.json").abi;

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(process.env.VOTING_CONTRACT!, contractABI, wallet);

  while (true) {
    console.log("\n=== VOTING MENU ===");
    console.log("1. Them ung vien");
    console.log("2. Xoa ung vien");
    console.log("3. Bo phieu");
    console.log("4. Xem ung vien");
    console.log("5. Thoat");

    const choice = readlineSync.question("Chon thao tac: ");

    try {
      switch (choice) {
        case "1": {
          const name = readlineSync.question("Ten ung vien: ");
          const tx = await contract.addCandidate(name);
          await tx.wait();
          console.log("Đa tham ung vien.");
          break;
        }
        case "2": {
          const id = readlineSync.questionInt("ID ung vien can xoa: ");
          const tx = await contract.removeCandidate(id);
          await tx.wait();
          console.log("Đa xoa ung vien.");
          break;
        }
        case "3": {
          const id = readlineSync.questionInt("ID ung vien bạn muon vote: ");
          const tx = await contract.vote(id);
          await tx.wait();
          console.log("Đã vote.");
          break;
        }
        case "4": {
          const count = 10;
          for (let i = 0; i < count; i++) {
            try {
              const [name, voteCount, exists] = await contract.getCandidate(i);
              if (exists) {
                console.log(`ID ${i} | ${name} - ${voteCount} votes`);
              }
            } catch {
              break;
            }
          }
          break;
        }
        case "5":
          console.log("Thoat...");
          process.exit(0);
        default:
          console.log("Lua chon khong hop le.");
      }
    } catch (err) {
      console.error("❌ Loi:", err);
    }
  }
}

main();
