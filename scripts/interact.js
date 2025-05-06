// scripts/interact.js
// Per executar aquest script correctament, primer cal iniciar un node local de Hardhat:
// 1. En una terminal: npx hardhat node
// 2. En una altra terminal: npx hardhat run scripts/deploy.js --network localhost
// 3. Després: npx hardhat run scripts/interact.js --network localhost

const { formatUnits, parseUnits } = require("ethers");
const c = require("./utils/colors");

// CONFIGURACIÓ
const TOKEN_NAME      = "MyToken" // Nom del contracte (ha de coincidir amb el nom del contracte a Solidity)
const TOKEN_ADDRESS   = "ADREÇA_DEL_CONTRACTE_AQUI"; // Adreça del contracte desplegat
const RECIPIENT_ACCOUNT_INDEX = 1; // Índex del compte que rebrà els tokens (0-19, on 1 és el segon compte generat per Hardhat)
const TRANSFER_AMOUNT = "1"; // Quantitat de tokens a transferir (en format string)

async function main() {
    // Obtenim el primer compte per defecte (el mateix que el deployer a la xarxa local)
    const [signer] = await ethers.getSigners();

    // Comprovar si l'adreça del contracte s'ha substituït
    if (TOKEN_ADDRESS === "ADREÇA_DEL_CONTRACTE_AQUI") {
        console.error(`${c.red}${c.bright}ERROR: Si us plau, substitueix ADREÇA_DEL_CONTRACTE_AQUI per l'adreça real del contracte desplegat.${c.reset}`);
        process.exit(1);
    }

    console.log(`${c.cyan}${c.bright}==========================`);
    console.log(`=====  INTERACT SCRIPT =====`);
    console.log(`==========================${c.reset}`);
    console.log(``);
    console.log(`${c.blue}Connectant...`);
    console.log(`${c.blue}Al contracte de l'adreça: ${c.yellow}${TOKEN_ADDRESS}${c.reset}`);

    // Obtenim una instància del contracte desplegat
    const MyToken = await ethers.getContractFactory(TOKEN_NAME);
    const token = await MyToken.attach(TOKEN_ADDRESS);

    // Obtenim informació del token
    const tokenName     = await token.name();
    const tokenSymbol   = await token.symbol();
    const tokenDecimals = await token.decimals();
    const balance       = await token.balanceOf(signer.address); // Saldo del compte per defecte
    
    console.log(`${c.blue}         \\ Token Name   : ${c.yellow}${tokenName}${c.reset}`);
    console.log(`${c.blue}         \\ Token Symbol : ${c.yellow}${tokenSymbol}${c.reset}`);
    console.log(``);
    console.log(`${c.blue}Utilitzant el compte    : ${c.yellow}${signer.address}${c.reset}`);
    console.log(`${c.blue}         \\ Saldo        : ${c.yellow}${formatUnits(balance, tokenDecimals)} ${tokenSymbol}${c.reset}`);

    // Opcional: Mostrar com fer una transferència (afegir més tard si hi ha temps)
    console.log(`\n${c.magenta}${c.bright}Fent una transferència de ${TRANSFER_AMOUNT} ${tokenSymbol} a un altre compte (accounts[${RECIPIENT_ACCOUNT_INDEX}])...${c.reset}`);

    const accounts = await ethers.getSigners();
    const recipient = accounts[RECIPIENT_ACCOUNT_INDEX].address;
    const amount = parseUnits(TRANSFER_AMOUNT, tokenDecimals); // Tokens amb els decimals corresponents

    try {
        const tx = await token.connect(signer).transfer(recipient, amount);
        await tx.wait(); // Esperar que la transacció es "mini" (a la xarxa local és instantani)
        const recipientBalance = await token.balanceOf(recipient);
        const senderBalance    = await token.balanceOf(signer.address);

        console.log(`  ${c.green}${c.bright}Transferència completada a ${c.yellow}${recipient}${c.reset}`);
        console.log(``);
        console.log(`  ${c.blue}Nou balanç del receptor (${c.yellow}${recipient}${c.blue}): ${c.yellow}${formatUnits(recipientBalance, tokenDecimals)} ${tokenSymbol}${c.reset}`);
        console.log(`  ${c.blue}Nou balanç del pagador  (${c.yellow}${signer.address}${c.blue}): ${c.yellow}${formatUnits(senderBalance, tokenDecimals)} ${tokenSymbol}${c.reset}`);
    } catch (error) {
         console.error(`${c.red}${c.bright}Error durant la transferència: ${error}${c.reset}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`${c.red}${c.bright}${error}${c.reset}`);
        process.exit(1);
    });
