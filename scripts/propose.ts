import fs from "fs";
import { ethers, network } from "hardhat";
import {
    VOTING_DELAY,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    proposalsFile,
} from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";

async function propose(
    functionToCall: string,
    args: any[],
    proposalDescription: string
) {
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(
        functionToCall,
        args
    );
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
    console.log(`Proposal Description \n ${proposalDescription}`);
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );
    const proposeReceipt = await proposeTx.wait(1);

    if (developmentChains.includes(network.name)) {
        await moveBlocks(+VOTING_DELAY + 1);
    }

    const proposalId = proposeReceipt.events[0].args.proposalId;
    console.log(`Proposed with proposalId: ${proposalId}`);

    const proposalState = await governor.state(proposalId);
    const proposalSnapshot = await governor.proposalSnapshot(proposalId);
    const proposalDeadline = await governor.proposalDeadline(proposalId);

    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
    if (proposals[network.config.chainId!]) {
        proposals[network.config.chainId!.toString()].push(
            proposalId.toString()
        );
    } else {
        proposals[network.config.chainId!.toString()] = [proposalId.toString()];
    }
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals));

    // The state of the proposal. 1 is not passed 0 is passed.
    console.log(`Current Proposal State: ${proposalState}`);
    // What block # the proposal was snapshot
    console.log(`Current Proposal Snapshot: ${proposalSnapshot}`);
    // The block number the proposal voting expires
    console.log(`Current Proposal Deadline: ${proposalDeadline}`);
}

propose(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
