import { network } from "hardhat";

export default async function moveBlocks(amount: number, sleepAmount?: number) {
    for (var i = 0; i < amount; i++) {
        console.log("Moving blocks ...");
        await network.provider.request({
            method: "evm_mine",
            params: [],
        });
        if (sleepAmount) {
            await sleep(sleepAmount);
        }
    }
}

async function sleep(timeInMs: number) {
    await new Promise<void>((resolve) => {
        setTimeout(resolve, timeInMs);
    });
}
