// scripts/distribute.js
// Per executar aquest script correctament:
// 1. En una terminal: npx hardhat node
// 2. En una altra terminal: npx hardhat run scripts/deploy.js --network localhost
// 3. Edita la variable TOKEN_ADDRESS amb l'adreça del contracte desplegat
// 4. Després: npx hardhat run scripts/distribute.js --network localhost

const { formatUnits, parseUnits } = require("ethers");
const c = require("./utils/colors");

// CONFIGURACIÓ
const TOKEN_NAME = "MyToken"; // Nom del contracte (ha de coincidir amb el nom del contracte a Solidity)
const TOKEN_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Adreça del contracte desplegat
const TRANSFER_AMOUNT = "1000000"; // Quantitat de tokens a transferir (1,000,000 tokens)

async function main() {
    // Obtenim el primer compte per defecte (el mateix que el deployer a la xarxa local)
    const [deployer, ...accounts] = await ethers.getSigners();
    
    // Comprovar si l'adreça del contracte s'ha substituït
    if (TOKEN_ADDRESS === "ADREÇA_DEL_CONTRACTE_AQUI") {
        console.error(`${c.red}${c.bright}ERROR: Si us plau, substitueix ADREÇA_DEL_CONTRACTE_AQUI per l'adreça real del contracte desplegat.${c.reset}`);
        process.exit(1);
    }

    console.log(`${c.cyan}${c.bright}==============================`);
    console.log(`=====  DISTRIBUTE SCRIPT =====`);
    console.log(`==============================${c.reset}`);
    console.log(``);
    console.log(`${c.blue}Connectant...`);
    console.log(`${c.blue}Al contracte de l'adreça: ${c.yellow}${TOKEN_ADDRESS}${c.reset}`);

    // Obtenim una instància del contracte desplegat
    const MyToken = await ethers.getContractFactory(TOKEN_NAME);
    const token = await MyToken.attach(TOKEN_ADDRESS);

    // Obtenim informació del token
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenDecimals = await token.decimals();
    const deployerBalance = await token.balanceOf(deployer.address);
    
    console.log(`${c.blue}         \\ Token Name   : ${c.yellow}${tokenName}${c.reset}`);
    console.log(`${c.blue}         \\ Token Symbol : ${c.yellow}${tokenSymbol}${c.reset}`);
    console.log(``);
    console.log(`${c.blue}Utilitzant el compte    : ${c.yellow}${deployer.address}${c.reset}`);
    console.log(`${c.blue}         \\ Saldo inicial: ${c.yellow}${formatUnits(deployerBalance, tokenDecimals)} ${tokenSymbol}${c.reset}`);

    // Verificar que el deployer té suficients tokens
    const amountPerAccount = parseUnits(TRANSFER_AMOUNT, tokenDecimals);
    const totalNeeded = amountPerAccount * BigInt(accounts.length);
    if (deployerBalance < totalNeeded) {
        console.error(`${c.red}${c.bright}ERROR: El compte no té suficients tokens per distribuir.${c.reset}`);
        console.error(`${c.red}Necessita: ${formatUnits(totalNeeded, tokenDecimals)} ${tokenSymbol}, Té: ${formatUnits(deployerBalance, tokenDecimals)} ${tokenSymbol}${c.reset}`);
        process.exit(1);
    }

    console.log(`\n${c.magenta}${c.bright}Distribuint ${TRANSFER_AMOUNT} ${tokenSymbol} a cada un dels ${accounts.length} comptes...${c.reset}`);
    
    const amount = parseUnits(TRANSFER_AMOUNT, tokenDecimals);
    
    // Transferir tokens a cada compte
    for (let i = 0; i < accounts.length; i++) {
        const recipient = accounts[i].address;
        try {
            const tx = await token.connect(deployer).transfer(recipient, amount);
            await tx.wait();
            const recipientBalance = await token.balanceOf(recipient);
            
            console.log(`  ${c.green}${c.bright}Transferència completada a Account #${i+1}: ${c.yellow}${recipient}${c.reset}`);
            console.log(`  ${c.blue}Nou balanç: ${c.yellow}${formatUnits(recipientBalance, tokenDecimals)} ${tokenSymbol}${c.reset}`);
        } catch (error) {
            console.error(`${c.red}${c.bright}Error durant la transferència a ${recipient}: ${error}${c.reset}`);
        }
    }
    
    // Mostrar el balanç final del deployer
    const finalBalance = await token.balanceOf(deployer.address);
    console.log(``);
    console.log(`${c.blue}Balanç final del deployer: ${c.yellow}${formatUnits(finalBalance, tokenDecimals)} ${tokenSymbol}${c.reset}`);
    console.log(`${c.green}${c.bright}Distribució completada!${c.reset}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`${c.red}${c.bright}${error}${c.reset}`);
        process.exit(1);
    });
