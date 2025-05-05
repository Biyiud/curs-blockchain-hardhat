// scripts/deploy.js
// Per executar aquest script correctament:
// 1. En una terminal: npx hardhat node
// 2. En una altra terminal: npx hardhat run scripts/deploy.js --network localhost

const { formatUnits } = require("ethers");

async function main() {
    // Hardhat Network provides 10 default accounts
    // The first one is used by default by ethers.getSigners()
    const [deployer] = await ethers.getSigners();

    console.log(`Desplegant contracte amb el compte: ${deployer.address}`);

    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(); // Deploy to the default network (Hardhat Network)

    await token.waitForDeployment();

    console.log(`Contracte Token desplegat a l'adreça: ${await token.getAddress()}`);
    console.log(`Balanç del deployer (${deployer.address}):`);
    const balance = await token.balanceOf(deployer.address);
    // formatUnits(balance, 18) assumeix 18 decimals, com ERC20 per defecte
    console.log(`  ${formatUnits(balance, 18)} MTK`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
