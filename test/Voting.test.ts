import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("Voting", function () {
  let owner: any, voter1: any, voter2: any, voter3: any, voter4: any;
  let voting: Contract;
  let token: Contract;

  beforeEach(async () => {
    [owner, voter1, voter2, voter3, voter4] = await ethers.getSigners();
    // Deploy mock token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("MockToken", "MTK");
    // Mint tokens
    await token.mint(voter1.address, ethers.parseEther("500")); // power 1
    await token.mint(voter2.address, ethers.parseEther("1500")); // power 2
    await token.mint(voter3.address, ethers.parseEther("2500")); // power 3
    await token.mint(voter4.address, ethers.parseEther("0")); // power 1
    // Deploy voting contract
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(token.target);
    // await voting.deployed();
  });

  it("should allow owner to add and remove candidates", async () => {
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");
    let c = await voting.getCandidate(0);
    expect(c[0]).to.equal("Alice");
    c = await voting.getCandidate(1);
    expect(c[0]).to.equal("Bob");
    await voting.removeCandidate(1);
    c = await voting.getCandidate(1);
    expect(c[2]).to.equal(false); // exists = false
  });

  it("should not allow non-owner to add/remove candidates", async () => {
    await expect(voting.connect(voter1).addCandidate("Eve")).to.be.revertedWith("Only owner");
    await voting.addCandidate("Alice");
    await expect(voting.connect(voter1).removeCandidate(0)).to.be.revertedWith("Only owner");
  });

  it("should allow voting and count voting power correctly", async () => {
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");
    // voter1 votes for Alice (power 1)
    await expect(voting.connect(voter1).vote(0))
      .to.emit(voting, "Voted")
      .withArgs(voter1.address, 0, 1);
    // voter2 votes for Alice (power 2)
    await expect(voting.connect(voter2).vote(0))
      .to.emit(voting, "Voted")
      .withArgs(voter2.address, 0, 2);
    // voter3 votes for Bob (power 3)
    await expect(voting.connect(voter3).vote(1))
      .to.emit(voting, "Voted")
      .withArgs(voter3.address, 1, 3);
    // voter4 votes for Bob (power 1)
    await expect(voting.connect(voter4).vote(1))
      .to.emit(voting, "Voted")
      .withArgs(voter4.address, 1, 1);
    // Check vote counts
    let alice = await voting.getCandidate(0);
    let bob = await voting.getCandidate(1);
    expect(alice[1]).to.equal(3n); // 1+2
    expect(bob[1]).to.equal(4n); // 3+1
  });

  it("should not allow double voting", async () => {
    await voting.addCandidate("Alice");
    await voting.connect(voter1).vote(0);
    await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Already voted");
  });

  it("should not allow voting for non-existent candidate", async () => {
    await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Candidate does not exist");
  });

  it("should return correct voting power based on token balance", async () => {
    expect(await voting.getVotingPower(voter1.address)).to.equal(1);
    expect(await voting.getVotingPower(voter2.address)).to.equal(2);
    expect(await voting.getVotingPower(voter3.address)).to.equal(3);
    expect(await voting.getVotingPower(voter4.address)).to.equal(1);
  });
}); 