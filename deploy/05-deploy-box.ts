import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
import { ethers } from "hardhat";

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId!;

    log("Deploying box ...");
    const waitConfirmations = networkConfig[chainId].blockConfirmations;
    const box = await deploy("Box", {
        contract: "Box",
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: waitConfirmations,
    });

    log("Box deployed!");
    log("-------------------------------------------");

    log("Transfering ownership ...");
    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContractAt("Box", box.address);
    const transferOwnershipTx = await boxContract.transferOwnership(
        timeLock.address
    );
    await transferOwnershipTx.wait(1);
    log("Ownership transfered!");

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(box.address, []);
    }
};

export default deployBox;
deployBox.tags = ["all", "deployBox"];
