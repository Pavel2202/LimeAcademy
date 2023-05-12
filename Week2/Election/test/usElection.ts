import { USElection__factory } from "./../typechain-types/factories/Election.sol/USElection__factory";
import { USElection } from "./../typechain-types/Election.sol/USElection";
import { expect } from "chai";
import { ethers, config } from "hardhat";

describe("USElection", function () {
  let player;
  let accounts: any[];
  let usElectionFactory;
  let usElection: USElection;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    player = accounts[1];

    usElectionFactory = await ethers.getContractFactory("USElection");

    usElection = await usElectionFactory.deploy();

    await usElection.deployed();
  });

  describe("submitStateResult", function () {
    it("Should revert when election is not active", async function () {
      const stateResults = ["California", 1000, 900, 32];
      await usElection.endElection();

      await expect(
        usElection.submitStateResult(stateResults)
      ).to.be.revertedWith("The election has ended already");
    });

    it("Should revert when not called by owner", async function () {
      const stateResults = ["California", 1000, 900, 32];

      await expect(
        usElection.connect(player).submitStateResult(stateResults)
      ).to.be.revertedWith("Not invoked by the owner");
    });

    it("Should revert when seats are 0", async function () {
      const stateResults = ["California", 1000, 900, 0];

      await expect(
        usElection.submitStateResult(stateResults)
      ).to.be.revertedWith("States must have at least 1 seat");
    });

    it("Should revert when there is a tie", async function () {
      const stateResults = ["California", 1000, 1000, 10];

      await expect(
        usElection.submitStateResult(stateResults)
      ).to.be.revertedWith("There cannot be a tie");
    });

    it("Should revert when state is already submitted", async function () {
      const stateResults = ["California", 1000, 1100, 10];
      await usElection.submitStateResult(stateResults);

      await expect(
        usElection.submitStateResult(stateResults)
      ).to.be.revertedWith("This state result was already submitted!");
    });

    it("Successfuly executes with Trump as a winner", async function () {
      const stateResults = ["California", 1000, 1100, 10];
      await expect(usElection.submitStateResult(stateResults))
        .to.emit(usElection, "LogStateResult")
        .withArgs(2, 10, "California");

      const seats = await usElection.seats(2);
      expect(seats).to.equal(10);

      const submitedResults = await usElection.resultsSubmitted("California");
      expect(submitedResults).to.equal(true);
    });

    it("Successfuly executes with Biden as a winner", async function () {
      const stateResults = ["California", 1200, 1100, 10];
      await expect(usElection.submitStateResult(stateResults))
        .to.emit(usElection, "LogStateResult")
        .withArgs(1, 10, "California");

      const seats = await usElection.seats(1);
      expect(seats).to.equal(10);

      const submitedResults = await usElection.resultsSubmitted("California");
      expect(submitedResults).to.equal(true);
    });
  });

  describe("currentLeader", function () {
    it("Returns 0 if results are equal", async function () {
      const leader = await usElection.currentLeader();
      expect(leader).to.equal(0);
    });

    it("Returns 1 if Biden has more votes", async function () {
      const stateResults = ["California", 1200, 1100, 10];
      await usElection.submitStateResult(stateResults);

      const leader = await usElection.currentLeader();
      expect(leader).to.equal(1);
    });

    it("Returns 2 if Trump has more votes", async function () {
      const stateResults = ["California", 1200, 1300, 10];
      await usElection.submitStateResult(stateResults);

      const leader = await usElection.currentLeader();
      expect(leader).to.equal(2);
    });
  });

  describe("endElection", function () {
    it("Should revert when election is already ended", async function () {
      await usElection.endElection();
      await expect(usElection.endElection()).to.be.revertedWith(
        "The election has ended already"
      );
    });

    it("Should revert when not called by owner", async function () {
      await expect(usElection.connect(player).endElection()).to.be.revertedWith(
        "Not invoked by the owner"
      );
    });

    it("Successfully executes", async function () {
      await expect(usElection.endElection())
        .to.emit(usElection, "LogElectionEnded")
        .withArgs(0);
    });
  });
});
