// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
        bool exists;
    }

    address public owner;
    IERC20 public token;
    mapping(address => bool) public hasVoted;
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;

    event Voted(address indexed voter, uint256 indexed candidateId, uint256 votingPower);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event CandidateRemoved(uint256 indexed candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates[candidateCount] = Candidate(_name, 0, true);
        emit CandidateAdded(candidateCount, _name);
        candidateCount++;
    }

    function removeCandidate(uint256 _candidateId) public onlyOwner {
        require(candidates[_candidateId].exists, "Candidate does not exist");
        delete candidates[_candidateId];
        emit CandidateRemoved(_candidateId);
    }

    function getVotingPower(address voter) public view returns (uint256) {
        uint256 balance = token.balanceOf(voter);
        if (balance < 1000 ether) {
            return 1;
        } else if (balance < 2000 ether) {
            return 2;
        } else {
            return 3;
        }
    }

    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        uint256 power = getVotingPower(msg.sender);
        candidates[_candidateId].voteCount += power;
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, _candidateId, power);
    }

    function getCandidate(uint256 _candidateId) public view returns (string memory name, uint256 voteCount, bool exists) {
        Candidate memory c = candidates[_candidateId];
        return (c.name, c.voteCount, c.exists);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory list = new Candidate[](candidateCount);
        for (uint256 i = 0; i < candidateCount; i++) {
            list[i] = candidates[i];
        }
        return list;
    }
} 


