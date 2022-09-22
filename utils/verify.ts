import { run } from "hardhat";

export default async function verify(contractAddress: string, args: any) {
    try {
        console.log("Verifying contract ...");
        await run("verify:verify", {
            contract: contractAddress,
            constructorArguments: args,
        });
    } catch (error: any) {
        if (error.toLowerCase().includes("already verified")) {
            console.log("Contract already verified!");
        } else {
            console.log(error);
        }
    }
}
