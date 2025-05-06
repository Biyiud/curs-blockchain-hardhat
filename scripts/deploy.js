// scripts/deploy.js
// Per executar aquest script correctament:
// 1. En una terminal: npx hardhat node
// 2. En una altra terminal: npx hardhat run scripts/deploy.js --network localhost

const { formatUnits } = require("ethers");
const colors = require("./utils/colors");

// CONFIGURACIÓ
// Nom del contracte (ha de coincidir amb el nom del contracte a Solidity)
const TOKEN_NAME="MyToken"

async function main() {
    // Hardhat Network provides 10 default accounts
    // The first one is used by default by ethers.getSigners()
    const [deployer] = await ethers.getSigners();

    console.log(`${colors.cyan}${colors.bright}==========================`);
    console.log(`=====  DEPLOY SCRIPT =====`);
    console.log(`==========================${colors.reset}`);
    console.log(``);
    console.log(`${colors.blue}Desplegant contracte amb el compte #0: ${colors.yellow}${deployer.address}${colors.reset}`);

    const Token = await ethers.getContractFactory(TOKEN_NAME);
    const token = await Token.deploy(); // Deploy to the default network (Hardhat Network)

    try {
        await token.waitForDeployment();
        console.log(`${colors.green}${colors.bright}Contracte desplegat correctament!${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}${colors.bright}Error en el desplegament: ${error.message}${colors.reset}`);
        process.exit(1);
    }

    const tokenName   = await token.name();
    const tokenSymbol = await token.symbol();
    const address     = await token.getAddress();
    const balance     = await token.balanceOf(deployer.address);

    console.log(``);
    console.log(`${colors.cyan}${colors.bright}Balanç del desplegament : `);
    console.log(`-------------------------${colors.reset}`);
    console.log(`${colors.blue}Token Address: ${colors.yellow}${address}${colors.reset}`);
    console.log(`${colors.blue}Token Name   : ${colors.yellow}${tokenName}${colors.reset}`);
    console.log(`${colors.blue}Token Symbol : ${colors.yellow}${tokenSymbol}${colors.reset}`);
    console.log(`${colors.blue}Token balance: ${colors.yellow}${formatUnits(balance, 18)} ${tokenSymbol}${colors.reset} for ${colors.yellow}${deployer.address}${colors.reset}`);
    console.log(``);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`${colors.red}${colors.bright}${error}${colors.reset}`);
        process.exit(1);
    });
