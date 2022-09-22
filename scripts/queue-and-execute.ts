import { ethers, network } from "hardhat";
import {
    MIN_DELAY,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
} from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";
import moveTime from "../utils/move-time";

async function queueAndExecute(functionToCall: string, args: any[]) {
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(
        functionToCall,
        args
    );
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    );

    console.log("Queueing ...");
    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    await queueTx.wait(1);

    if (developmentChains.includes(network.name)) {
        await moveTime(+MIN_DELAY + 1);
        await moveBlocks(1);
    }

    console.log("Executing ...");
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    await executeTx.wait(1);

    const boxNewValue = await box.retreive();
    console.log(`The new value is: ${boxNewValue.toString()}`);
}

queueAndExecute(FUNC, [NEW_STORE_VALUE])
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
