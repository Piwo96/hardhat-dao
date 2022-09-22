import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { GovernanceToken } from "../typechain-types";
import verify from "../utils/verify";
import "dotenv/config";

const deployGovernanceToken: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId!;

    log("Deploying Governance Token ...");
    const waitConfirmations = networkConfig[chainId].blockConfirmations;
    const governanceToken = await deploy("GovernanceToken", {
        contract: "GovernanceToken",
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: waitConfirmations,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(governanceToken.address, []);
    }
    log("Governance Token deployed!");
    log("---------------------------------------------");

    await delegate(governanceToken.address, deployer);
    log("Delegated!");
};

const delegate = async (
    governanceTokenAddress: string,
    delegatedAccount: string
) => {
    const governanceToken: GovernanceToken = await ethers.getContractAt(
        "GovernanceToken",
        governanceTokenAddress
    );
    const tx = await governanceToken.delegate(delegatedAccount);
    await tx.wait(1);
    console.log(
        `Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`
    );
};

export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governanceToken"];
