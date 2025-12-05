import { expect } from "chai";
import { ethers } from "hardhat";
import { ExperimentLog } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ExperimentLog", function () {
  let experimentLog: ExperimentLog;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ExperimentLogFactory = await ethers.getContractFactory("ExperimentLog");
    experimentLog = await ExperimentLogFactory.deploy();
    await experimentLog.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await experimentLog.getAddress()).to.be.properAddress;
    });

    it("Should start with zero experiments", async function () {
      expect(await experimentLog.getExperimentCount()).to.equal(0);
    });

    it("Should start with zero steps", async function () {
      expect(await experimentLog.getStepCount()).to.equal(0);
    });

    it("Should have correct initial state", async function () {
      // Test that the contract is properly initialized
      const experimentCount = await experimentLog.getExperimentCount();
      const stepCount = await experimentLog.getStepCount();
      
      expect(experimentCount).to.equal(0);
      expect(stepCount).to.equal(0);
    });
  });

  describe("Security", function () {
    it("Should prevent empty experiment names", async function () {
      await expect(experimentLog.createExperiment(""))
        .to.be.revertedWith("ExperimentLog: name cannot be empty");
    });

    it("Should prevent experiment names that are too short", async function () {
      await expect(experimentLog.createExperiment("ab"))
        .to.be.revertedWith("ExperimentLog: name cannot be empty");
    });

    it("Should enforce rate limiting on step creation", async function () {
      const experimentId = await experimentLog.createExperiment("Test Experiment");
      
      // First step should succeed
      await experimentLog.addStep(experimentId, "Step 1", "Content 1", false);
      
      // Second step immediately should fail due to rate limiting
      await expect(experimentLog.addStep(experimentId, "Step 2", "Content 2", false))
        .to.be.revertedWith("ExperimentLog: step creation rate limited");
    });
  });

  describe("Create Experiment", function () {
    it("Should create an experiment successfully", async function () {
      const tx = await experimentLog.createExperiment("Test Experiment");
      const receipt = await tx.wait();

      expect(receipt).to.not.be.null;
      expect(await experimentLog.getExperimentCount()).to.equal(1);
    });

    it("Should emit ExperimentCreated event", async function () {
      await expect(experimentLog.createExperiment("Test Experiment"))
        .to.emit(experimentLog, "ExperimentCreated")
        .withArgs(0, owner.address, "Test Experiment", await ethers.provider.getBlock("latest").then(b => b!.timestamp + 1));
    });

    it("Should fail with empty name", async function () {
      await expect(experimentLog.createExperiment(""))
        .to.be.revertedWith("ExperimentLog: name cannot be empty");
    });

    it("Should set correct owner", async function () {
      await experimentLog.createExperiment("Test Experiment");
      const experiment = await experimentLog.getExperiment(0);
      expect(experiment.owner).to.equal(owner.address);
    });

    it("Should increment experiment ID", async function () {
      await experimentLog.createExperiment("Experiment 1");
      await experimentLog.createExperiment("Experiment 2");
      
      const exp1 = await experimentLog.getExperiment(0);
      const exp2 = await experimentLog.getExperiment(1);
      
      expect(exp1.id).to.equal(0);
      expect(exp2.id).to.equal(1);
    });
  });

  describe("Add Step", function () {
    beforeEach(async function () {
      await experimentLog.createExperiment("Test Experiment");
    });

    it("Should add a step successfully", async function () {
      const tx = await experimentLog.addStep(0, "Step 1", "Content 1", false);
      const receipt = await tx.wait();

      expect(receipt).to.not.be.null;
      expect(await experimentLog.getStepCount()).to.equal(1);
    });

    it("Should emit StepAdded event", async function () {
      await expect(experimentLog.addStep(0, "Step 1", "Content 1", false))
        .to.emit(experimentLog, "StepAdded")
        .withArgs(0, 0, "Step 1");
    });

    it("Should fail if experiment does not exist", async function () {
      await expect(experimentLog.addStep(999, "Step 1", "Content 1", false))
        .to.be.revertedWith("ExperimentLog: experiment does not exist");
    });

    it("Should fail if caller is not the owner", async function () {
      await expect(experimentLog.connect(addr1).addStep(0, "Step 1", "Content 1", false))
        .to.be.revertedWith("ExperimentLog: caller is not the experiment owner");
    });

    it("Should fail with empty title", async function () {
      await expect(experimentLog.addStep(0, "", "Content 1", false))
        .to.be.revertedWith("ExperimentLog: title cannot be empty");
    });

    it("Should store step data correctly", async function () {
      await experimentLog.addStep(0, "Step 1", "Content 1", true);
      const step = await experimentLog.getStep(0);

      expect(step.id).to.equal(0);
      expect(step.experimentId).to.equal(0);
      expect(step.title).to.equal("Step 1");
      expect(step.content).to.equal("Content 1");
      expect(step.isEncrypted).to.equal(true);
      expect(step.exists).to.equal(true);
    });

    it("Should add multiple steps to same experiment", async function () {
      await experimentLog.addStep(0, "Step 1", "Content 1", false);
      await experimentLog.addStep(0, "Step 2", "Content 2", true);

      const stepIds = await experimentLog.getExperimentStepIds(0);
      expect(stepIds.length).to.equal(2);
      expect(stepIds[0]).to.equal(0);
      expect(stepIds[1]).to.equal(1);
    });
  });

  describe("Update Step", function () {
    beforeEach(async function () {
      await experimentLog.createExperiment("Test Experiment");
      await experimentLog.addStep(0, "Original Title", "Original Content", false);
    });

    it("Should update step successfully", async function () {
      await experimentLog.updateStep(0, "Updated Title", "Updated Content", true);
      const step = await experimentLog.getStep(0);

      expect(step.title).to.equal("Updated Title");
      expect(step.content).to.equal("Updated Content");
      expect(step.isEncrypted).to.equal(true);
    });

    it("Should emit StepUpdated event", async function () {
      await expect(experimentLog.updateStep(0, "Updated Title", "Updated Content", true))
        .to.emit(experimentLog, "StepUpdated")
        .withArgs(0, 0);
    });

    it("Should fail if step does not exist", async function () {
      await expect(experimentLog.updateStep(999, "Title", "Content", false))
        .to.be.revertedWith("ExperimentLog: step does not exist");
    });

    it("Should fail if caller is not the owner", async function () {
      await expect(experimentLog.connect(addr1).updateStep(0, "Title", "Content", false))
        .to.be.revertedWith("ExperimentLog: caller is not the experiment owner");
    });

    it("Should fail with empty title", async function () {
      await expect(experimentLog.updateStep(0, "", "Content", false))
        .to.be.revertedWith("ExperimentLog: title cannot be empty");
    });
  });

  describe("Delete Step", function () {
    beforeEach(async function () {
      await experimentLog.createExperiment("Test Experiment");
      await experimentLog.addStep(0, "Step 1", "Content 1", false);
      await experimentLog.addStep(0, "Step 2", "Content 2", false);
    });

    it("Should delete step successfully", async function () {
      await experimentLog.deleteStep(0);
      
      await expect(experimentLog.getStep(0))
        .to.be.revertedWith("ExperimentLog: step does not exist");
    });

    it("Should emit StepDeleted event", async function () {
      await expect(experimentLog.deleteStep(0))
        .to.emit(experimentLog, "StepDeleted")
        .withArgs(0, 0);
    });

    it("Should remove step from experiment's step list", async function () {
      await experimentLog.deleteStep(0);
      const stepIds = await experimentLog.getExperimentStepIds(0);
      
      expect(stepIds.length).to.equal(1);
      expect(stepIds[0]).to.equal(1);
    });

    it("Should fail if step does not exist", async function () {
      await expect(experimentLog.deleteStep(999))
        .to.be.revertedWith("ExperimentLog: step does not exist");
    });

    it("Should fail if caller is not the owner", async function () {
      await expect(experimentLog.connect(addr1).deleteStep(0))
        .to.be.revertedWith("ExperimentLog: caller is not the experiment owner");
    });
  });

  describe("Get Experiment Steps", function () {
    beforeEach(async function () {
      await experimentLog.createExperiment("Test Experiment");
      await experimentLog.addStep(0, "Step 1", "Content 1", false);
      await experimentLog.addStep(0, "Step 2", "Content 2", true);
    });

    it("Should return all steps for an experiment", async function () {
      const steps = await experimentLog.getExperimentSteps(0);
      
      expect(steps.length).to.equal(2);
      expect(steps[0].title).to.equal("Step 1");
      expect(steps[1].title).to.equal("Step 2");
    });

    it("Should fail if experiment does not exist", async function () {
      await expect(experimentLog.getExperimentSteps(999))
        .to.be.revertedWith("ExperimentLog: experiment does not exist");
    });
  });

  describe("Multiple Users", function () {
    it("Should allow different users to create their own experiments", async function () {
      await experimentLog.connect(owner).createExperiment("Owner Experiment");
      await experimentLog.connect(addr1).createExperiment("Addr1 Experiment");

      const exp1 = await experimentLog.getExperiment(0);
      const exp2 = await experimentLog.getExperiment(1);

      expect(exp1.owner).to.equal(owner.address);
      expect(exp2.owner).to.equal(addr1.address);
    });

    it("Should prevent users from modifying other users' experiments", async function () {
      await experimentLog.connect(owner).createExperiment("Owner Experiment");

      await expect(experimentLog.connect(addr1).addStep(0, "Step", "Content", false))
        .to.be.revertedWith("ExperimentLog: caller is not the experiment owner");
    });
  });

  describe("Batch Operations", function () {
    beforeEach(async function () {
      await experimentLog.createExperiment("Test Experiment");
      await experimentLog.addStep(0, "Step 1", "Content 1", false);
      await experimentLog.addStep(0, "Step 2", "Content 2", false);
      await experimentLog.addStep(0, "Step 3", "Content 3", false);
    });

    it("Should batch delete multiple steps successfully", async function () {
      const stepIdsToDelete = [0, 2];
      await experimentLog.batchDeleteSteps(stepIdsToDelete);

      // Check that deleted steps no longer exist
      await expect(experimentLog.getStep(0))
        .to.be.revertedWith("ExperimentLog: step does not exist");
      await expect(experimentLog.getStep(2))
        .to.be.revertedWith("ExperimentLog: step does not exist");

      // Check that remaining step still exists
      const remainingStep = await experimentLog.getStep(1);
      expect(remainingStep.title).to.equal("Step 2");
    });

    it("Should emit StepDeleted events for each deleted step", async function () {
      const stepIdsToDelete = [0, 1];

      await expect(experimentLog.batchDeleteSteps(stepIdsToDelete))
        .to.emit(experimentLog, "StepDeleted")
        .withArgs(0, 0)
        .and.to.emit(experimentLog, "StepDeleted")
        .withArgs(1, 0);
    });

    it("Should update experiment step list after batch deletion", async function () {
      await experimentLog.batchDeleteSteps([0, 2]);
      const remainingStepIds = await experimentLog.getExperimentStepIds(0);

      expect(remainingStepIds.length).to.equal(1);
      expect(remainingStepIds[0]).to.equal(1);
    });

    it("Should fail if trying to batch delete non-existent steps", async function () {
      await expect(experimentLog.batchDeleteSteps([0, 999]))
        .to.be.revertedWith("ExperimentLog: step does not exist");
    });

    it("Should fail if caller is not the experiment owner", async function () {
      await expect(experimentLog.connect(addr1).batchDeleteSteps([0, 1]))
        .to.be.revertedWith("ExperimentLog: caller is not the experiment owner");
    });

    it("Should fail if no steps provided", async function () {
      await expect(experimentLog.batchDeleteSteps([]))
        .to.be.revertedWith("ExperimentLog: no steps provided");
    });

    it("Should fail if too many steps provided", async function () {
      const tooManySteps = Array.from({length: 51}, (_, i) => i);
      await expect(experimentLog.batchDeleteSteps(tooManySteps))
        .to.be.revertedWith("ExperimentLog: too many steps to delete at once");
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      await experimentLog.createExperiment("Test Experiment");
    });

    it("Should transfer experiment ownership successfully", async function () {
      await experimentLog.transferExperimentOwnership(0, addr1.address);

      const experiment = await experimentLog.getExperiment(0);
      expect(experiment.owner).to.equal(addr1.address);
    });

    it("Should emit ExperimentOwnershipTransferred event", async function () {
      await expect(experimentLog.transferExperimentOwnership(0, addr1.address))
        .to.emit(experimentLog, "ExperimentOwnershipTransferred")
        .withArgs(0, owner.address, addr1.address);
    });

    it("Should allow new owner to manage the experiment", async function () {
      await experimentLog.transferExperimentOwnership(0, addr1.address);

      // New owner should be able to add steps
      await experimentLog.connect(addr1).addStep(0, "New Step", "New Content", false);

      const stepIds = await experimentLog.getExperimentStepIds(0);
      expect(stepIds.length).to.equal(1);
    });

    it("Should prevent old owner from managing after transfer", async function () {
      await experimentLog.transferExperimentOwnership(0, addr1.address);

      await expect(experimentLog.addStep(0, "Old Owner Step", "Content", false))
        .to.be.revertedWith("ExperimentLog: caller is not the experiment owner");
    });

    it("Should fail if transferring to zero address", async function () {
      await expect(experimentLog.transferExperimentOwnership(0, ethers.ZeroAddress))
        .to.be.revertedWith("ExperimentLog: new owner cannot be zero address");
    });

    it("Should fail if transferring to current owner", async function () {
      await expect(experimentLog.transferExperimentOwnership(0, owner.address))
        .to.be.revertedWith("ExperimentLog: new owner cannot be current owner");
    });

    it("Should fail if experiment does not exist", async function () {
      await expect(experimentLog.transferExperimentOwnership(999, addr1.address))
        .to.be.revertedWith("ExperimentLog: experiment does not exist");
    });

    it("Should fail if caller is not the owner", async function () {
      await expect(experimentLog.connect(addr1).transferExperimentOwnership(0, addr2.address))
        .to.be.revertedWith("ExperimentLog: caller is not the experiment owner");
    });
  });

  describe("Ownership Verification", function () {
    beforeEach(async function () {
      await experimentLog.createExperiment("Test Experiment");
    });

    it("Should return true for experiment owner", async function () {
      const isOwner = await experimentLog.isExperimentOwner(0, owner.address);
      expect(isOwner).to.be.true;
    });

    it("Should return false for non-owner", async function () {
      const isOwner = await experimentLog.isExperimentOwner(0, addr1.address);
      expect(isOwner).to.be.false;
    });

    it("Should return false for non-existent experiment", async function () {
      const isOwner = await experimentLog.isExperimentOwner(999, owner.address);
      expect(isOwner).to.be.false;
    });
  });
});
