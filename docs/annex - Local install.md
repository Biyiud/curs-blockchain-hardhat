## Annex. Instal·lació en local

### Prerequisits
* Instal·lar [Git](https://git-scm.com/downloads)
* Instal·lar [Node.js](https://nodejs.org/en/download/)
* Instal·lar [npm](https://www.npmjs.com/get-npm)
* Instal·lar [Visual Studio Code](https://code.visualstudio.com/download)
* Instal·lar [Metamask](https://metamask.io/download.html) al navegador (Chrome, Firefox, Brave o Edge).

### Passos d'instal·lació
1. Clonar el repositori:
```sh
git clone https://github.com/Biyiud/curs-blockchain-hardhat.git
cd curs-blockchain-hardhat
echo "node_modules/" > .gitignore
```

2. Instal·lar les dependències:
```sh
npm init -y
npm install
```

3. Instal·lar Hardhat i les biblioteques necessàries:
```sh
npx hardhat
```
* Quan se us demani, escolliu `Create an empty hardhat.config.js`.
* Això crearà una estructura bàsica del projecte Hardhat.

4. Instal·lar OpenZeppelin per a la plantilla ERC-20:
```sh
npm install --save-dev @openzeppelin/contracts
```

5. Seguiu els passos de la secció 2.3 i 2.4 per desplegar el contracte, interactuar amb ell i configurar Metamask.
