interface NetworkConfigInfo {
    [chainId: number]: NetworkConfigItem;
}

interface NetworkConfigItem {
    blockConfirmations: number;
}

export const networkConfig: NetworkConfigInfo = {
    31337: { blockConfirmations: 1 },
    5: { blockConfirmations: 6 },
};

export const developmentChains = ["localhost", "hardhat"];

export const MIN_DELAY = "3600";
export const VOTING_PERIOD = "5";
export const VOTING_DELAY = "1";
export const QUORUM_PERCENTAGE = "4";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
