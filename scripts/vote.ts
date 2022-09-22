import fs from "fs";
import { network, ethers } from "hardhat";
import {
    developmentChains,
    proposalsFile,
    VOTING_PERIOD,
} from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";

const index = 0;

async function vote(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
    const proposalId = proposals[network.config.chainId!][proposalIndex];
    // 0 = Against; 1 = For, 2 = Abstain
    const voteWay = 1;
    const reason = "I like to increment.";
    const governor = await ethers.getContract("GovernorContract");
    const voteTx = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        reason
    );
    await voteTx.wait(1);
    if (developmentChains.includes(network.name)) {
        await moveBlocks(+VOTING_PERIOD + 1);
    }
    console.log("Voted!");
    const proposalState = await governor.state(proposalId);
    console.log(`The current proposal state is: ${proposalState}`);
}

vote(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
