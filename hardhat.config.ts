import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://example.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x00";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
    solidity: {
        compilers: [{ version: "0.8.8" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            saveDeployments: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};

export default config;
