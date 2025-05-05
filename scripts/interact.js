// scripts/interact.js
// Per executar aquest script correctament, primer cal iniciar un node local de Hardhat:
// 1. En una terminal: npx hardhat node
// 2. En una altra terminal: npx hardhat run scripts/deploy.js --network localhost
// 3. Després: npx hardhat run scripts/interact.js --network localhost

const { formatUnits, parseUnits } = require("ethers");

const TOKEN_ADDRESS = "ADREÇA_DEL_CONTRACTE_AQUI"; // Adreça del contracte desplegat

async function main() {
    // Obtenim el primer compte per defecte (el mateix que el deployer a la xarxa local)
    const [signer] = await ethers.getSigners();

    // Comprovar si l'adreça del contracte s'ha substituït
    if (TOKEN_ADDRESS === "ADREÇA_DEL_CONTRACTE_AQUI") {
        console.error("ERROR: Si us plau, substitueix ADREÇA_DEL_CONTRACTE_AQUI per l'adreça real del contracte desplegat.");
        process.exit(1);
    }

    console.log(`Connectant al contracte a l'adreça: ${TOKEN_ADDRESS}`);
    console.log(`Utilitzant el compte: ${signer.address}`);

    // Obtenim una instància del contracte desplegat
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.attach(TOKEN_ADDRESS);

    // Crida una funció del contracte (ex: balanceOf)
    const balance = await token.balanceOf(signer.address);

    console.log(`Balanç de MTK per al compte ${signer.address}:`);
    console.log(`  ${formatUnits(balance, 18)} MTK`);

    // Opcional: Mostrar com fer una transferència (afegir més tard si hi ha temps)
    console.log("\nFent una transferència d'1 MTK a un altre compte (ex: accounts[1])...");
    const accounts = await ethers.getSigners();
    const recipient = accounts[1].address;
    const amount = parseUnits("1", 18); // 1 MTK (amb 18 decimals)
    try {
        const tx = await token.connect(signer).transfer(recipient, amount);
        await tx.wait(); // Esperar que la transacció es "mini" (a la xarxa local és instantani)
        console.log(`  Transferència completada a ${recipient}`);
        const recipientBalance = await token.balanceOf(recipient);
        console.log(`  Nou balanç de ${recipient}: ${formatUnits(recipientBalance, 18)} MTK`);
        const senderBalance = await token.balanceOf(signer.address);
        console.log(`  Nou balanç del deployer (${signer.address}): ${formatUnits(senderBalance, 18)} MTK`);
    } catch (error) {
         console.error("Error durant la transferència:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
