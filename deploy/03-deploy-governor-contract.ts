import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import {
    developmentChains,
    networkConfig,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
} from "../helper-hardhat-config";
import { GovernanceToken } from "../typechain-types";
import verify from "../utils/verify";
import "dotenv/config";

const deployGovernorContract: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId!;
    const governanceToken = await ethers.getContract("GovernanceToken");
    const timeLock = await ethers.getContract("TimeLock");

    log("Deploying Governor Contract ...");
    const waitConfirmations = networkConfig[chainId].blockConfirmations;
    const args: any = [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE,
    ];
    const governorContract = await deploy("GovernorContract", {
        contract: "GovernorContract",
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: waitConfirmations,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(governorContract.address, args);
    }
    log("Governor contract deployed!");
    log("---------------------------------------------");
};

export default deployGovernorContract;
deployGovernorContract.tags = ["all", "governorContract"];
