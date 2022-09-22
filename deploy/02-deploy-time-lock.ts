import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import {
    developmentChains,
    networkConfig,
    MIN_DELAY,
} from "../helper-hardhat-config";
import { GovernanceToken } from "../typechain-types";
import verify from "../utils/verify";
import "dotenv/config";

const deployTimeLock: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId!;

    log("Deploying Timelock ...");
    const waitConfirmations = networkConfig[chainId].blockConfirmations;
    const args: any = [MIN_DELAY, [], []];
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: waitConfirmations,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(timeLock.address, args);
    }
    log("Timelock deployed!");
    log("----------------------------------------");
};

export default deployTimeLock;
deployTimeLock.tags = ["all", "timeLock"];
