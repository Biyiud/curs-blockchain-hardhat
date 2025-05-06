// scripts/interact.js
// Per executar aquest script correctament, primer cal iniciar un node local de Hardhat:
// 1. En una terminal: npx hardhat node
// 2. En una altra terminal: npx hardhat run scripts/deploy.js --network localhost
// 3. Després: npx hardhat run scripts/interact.js --network localhost

const { formatUnits, parseUnits } = require("ethers");
const colors = require("./utils/colors");

// CONFIGURACIÓ: Substitueix aquestes variables amb els valors adequats
const TOKEN_ADDRESS = "ADREÇA_DEL_CONTRACTE_AQUI"; // Adreça del contracte desplegat
const RECIPIENT_ACCOUNT_INDEX = 1; // Índex del compte que rebrà els tokens (0-19, on 1 és el segon compte generat per Hardhat)
const TRANSFER_AMOUNT = "1"; // Quantitat de tokens a transferir (en format string)

async function main() {
    // Obtenim el primer compte per defecte (el mateix que el deployer a la xarxa local)
    const [signer] = await ethers.getSigners();

    // Comprovar si l'adreça del contracte s'ha substituït
    if (TOKEN_ADDRESS === "ADREÇA_DEL_CONTRACTE_AQUI") {
        console.error(`${colors.red}${colors.bright}ERROR: Si us plau, substitueix ADREÇA_DEL_CONTRACTE_AQUI per l'adreça real del contracte desplegat.${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.cyan}${colors.bright}==========================`);
    console.log(`=====  INTERACT SCRIPT =====`);
    console.log(`==========================${colors.reset}`);
    console.log(``);
    console.log(`${colors.blue}Connectant...`);
    console.log(`${colors.blue}Al contracte de l'adreça: ${colors.yellow}${TOKEN_ADDRESS}${colors.reset}`);

    // Obtenim una instància del contracte desplegat
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.attach(TOKEN_ADDRESS);

    // Obtenim informació del token
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenDecimals = await token.decimals();
    
    console.log(`${colors.blue}         \\ Token Name   : ${colors.yellow}${tokenName}${colors.reset}`);
    console.log(`${colors.blue}         \\ Token Symbol : ${colors.yellow}${tokenSymbol}${colors.reset}`);
    console.log(``);
    console.log(`${colors.blue}Utilitzant el compte    : ${colors.yellow}${signer.address}${colors.reset}`);

    // Crida una funció del contracte (ex: balanceOf)
    const balance = await token.balanceOf(signer.address);
    console.log(`${colors.blue}         \\ Saldo        : ${colors.yellow}${formatUnits(balance, tokenDecimals)} ${tokenSymbol}${colors.reset}`);

    // Opcional: Mostrar com fer una transferència (afegir més tard si hi ha temps)
    console.log(`\n${colors.magenta}${colors.bright}Fent una transferència de ${TRANSFER_AMOUNT} ${tokenSymbol} a un altre compte (accounts[${RECIPIENT_ACCOUNT_INDEX}])...${colors.reset}`);
    const accounts = await ethers.getSigners();
    const recipient = accounts[RECIPIENT_ACCOUNT_INDEX].address;
    const amount = parseUnits(TRANSFER_AMOUNT, tokenDecimals); // Tokens amb els decimals corresponents
    try {
        const tx = await token.connect(signer).transfer(recipient, amount);
        await tx.wait(); // Esperar que la transacció es "mini" (a la xarxa local és instantani)
        console.log(`  ${colors.green}${colors.bright}Transferència completada a ${colors.yellow}${recipient}${colors.reset}`);
        const recipientBalance = await token.balanceOf(recipient);
        console.log(``);
        console.log(`  ${colors.blue}Nou balanç del receptor (${colors.yellow}${recipient}${colors.blue}): ${colors.yellow}${formatUnits(recipientBalance, tokenDecimals)} ${tokenSymbol}${colors.reset}`);
        const senderBalance = await token.balanceOf(signer.address);
        console.log(`  ${colors.blue}Nou balanç del pagador  (${colors.yellow}${signer.address}${colors.blue}): ${colors.yellow}${formatUnits(senderBalance, tokenDecimals)} ${tokenSymbol}${colors.reset}`);
    } catch (error) {
         console.error(`${colors.red}${colors.bright}Error durant la transferència: ${error}${colors.reset}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`${colors.red}${colors.bright}${error}${colors.reset}`);
        process.exit(1);
    });
