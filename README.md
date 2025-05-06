# Curs Blockchain ITB

Benvinguts al curs introductori de blockchain per ITB. El meu nom és Jaume Catarineu i sóc el CTO de Biyiud, una startup 

Aquest curs té una duració de 2h, i combina teoria i pràctica. El seu objectiu és que entengueu què són les tecnologies blockchain i tingueu un primer contacte amb elles. 

Per qualsevol dubte referent al curs, em podeu contactar a [jaume.catarineu@biyiud.eco](mailto:jaume.catarineu@biyiud.eco)

## **Part 1**. Presentació "Introducció a blockchain" (1h)
Podeu 
trobar la presentació a [aquest enllaç](https://docs.google.com/presentation/d/1q0v2x4g7r3X8J6Q5Z9f0z5v5z5z5z5z5/edit?usp=sharing&ouid=113123456789012345678&rtpof=true&sd=true)

## **Part 2**. Taller pràctic blockchain (1h)

### 2.1 Configuració de l'entorn de treball
Hi ha dues manreres d'instal·lar el projecte:
1. **Github Codespaces**: 
   - AIXÒ és que farem aquest curs. 
   - Aneu al repositori Github del curs [aquí](https://github.com/Biyiud/curs-blockchain-hardhat) i feu login.
   - Aneu a la pestanya **[<> Code]**, seleccioneu **"Codespaces"**, i allà **"New codespace"**.
2. **Instal·lació local**:
   - Si no teniu un compte de Github o preferiu treballar localment, podeu instal·lar el projecte al vostre ordinador. 
   - Assegureu-vos de tenir instal·lat [Node.js](https://nodejs.org/en/download/) i [npm](https://www.npmjs.com/get-npm) abans de continuar.
   - Després, seguiu les instruccions d'instal·lació que es troben a l'[annex](#annex-installació-en-local) d'aquest document.

### 2.2. Revisar contracte i scripts
Revisar els fitxers del projecte.

- [`hardhat.config.js`](hardhat.config.js): 
    - Aquest és el fitxer de configuració de Hardhat. Aquí es defineixen les xarxes, els comptes i altres opcions de configuració.
    - En aquest cas especifica la xarxa local (localhost) i es defineix el compte del creador del contracte.
    - Al treballar amb xarxa local, podrem desplegar i interactuar amb els contractes sense necessitat de pagar gas. I les accions es realitzaran immediatament.
- [`contracts/Token.sol`](contracts/Token.sol):
   - El contracte és un ERC-20, i defineix un token anomenat `MyToken` amb símbol `MTK`.
   - El contracte té una oferta inicial de 1.000 tokens assignats a l'adreça del creador del contracte.
   - El contracte permet transferir tokens entre adreces i consultar el saldo d'una adreça.

- [`scripts/deploy.js`](scripts/deploy.js): 
  - El script de desplegament. Aquest script es connecta a la xarxa local i publica el contracte al blockchain.
  - El script crea una instància del contracte i l'assigna a l'adreça del creador.
  - Després, imprimeix l'adreça del contracte desplegat a la consola.
  
- [`scripts/interact.js`](scripts/interact.js):
  - El script d'interacció, que crida al contracte desplegat anteriorment, permetent-nos consultar els saldos i transferir tokens entre adreces.
  - Al executar-se, realitza una transferència de tokens a una altra adreça de les creades per hardhat.
  
- [`package.json`](package.json): 
  - El fitxer de configuració de `npm`. Aquí es defineixen les dependències del projecte i els scripts que podem executar.
  - En aquest cas, no hi ha scripts definits, però podem afegir-ne si cal.

### 2.3 Desplegar contracte i interaccionar amb ell

1. Dins del Visual Studio Code de Github Codespaces, obriu una terminal i executeu les següents comandes:

```bash
# Instal·lar les dependències del projecte (indicades del fitxer package.json)
npm install

# Executar el node local de Hardhat
# (crea un blockchain local i adreces d'usuari)
npx hardhat node
```

2. Obriu una altra terminal i executeu el següent:
```bash
# Desplega el contracte al node local de Hardhat
npx hardhat run scripts/deploy.js --network localhost
```

3. Configureu les variables a l'script `scripts/interact.js`:
   - `TOKEN_ADDRESS`: Copieu l'adreça del contracte de la sortida del terminal i enganxeu-la aquí.
   - `RECIPIENT_ACCOUNT_INDEX`: Definiu el número d'identitat que rebrà el saldo (per exemple, 1 per a la segona adreça generada per Hardhat, 2 per a la tercera, etc.).
   - `TRANSFER_AMOUNT`: Establiu la quantitat de tokens que voleu transferir (per exemple, "10" per transferir 10 tokens).

4. Interactueu amb el contracte:
```bash
npx hardhat run scripts/interact.js --network localhost
```

Fixa't que tant `deploy.js` com `interact.js` no són simples fitxers JavaScript independents.
Són scripts dissenyats per executar-se dins de l'entorn d'execució de Hardhat. Per això cal invocar-los a través de la comanda `npx hardhat run`.

### 2.4 Configuració de Metamask per interactuar amb el contracte

1. **Configurar el port 8545 perquè sigui públic a través de VSCode**:
   - Si esteu utilitzant Codespaces, aneu a la pestanya "Ports" a la part inferior de VSCode.
   - Feu clic dret al port 8545 i seleccioneu "Port Visibility" -> "Public".
   - Això permetrà que Metamask es connecti al node de Hardhat.

2. **Instal·lar Metamask al navegador**:
   - Aneu a [metamask.io](https://metamask.io/) i instal·leu l'extensió per al vostre navegador.
   - Seguiu les instruccions per crear un nou moneder i guardeu la frase de recuperació en un lloc segur.
   - Creeu una contrasenya per protegir el vostre moneder.

3. **Afegir la URL del RPC de Hardhat a Metamask**:
   - Obriu Metamask i feu clic al selector de xarxes a la part superior.
   - Seleccioneu "Afegir xarxa" -> "Afegir xarxa manualment".
   - Ompliu els següents camps:
     - Nom de la xarxa: `Hardhat Local`
     - URL del RPC: http://localhost:8545 (o la URL del vostre Codespace si esteu utilitzant Codespaces)
     - ID de la cadena: `31337`
     - Símbol de la moneda: `ETH`
   - Feu clic a "Desar".

4. **Importar la identitat[5] a Metamask**:
   - Quan executeu `npx hardhat node`, es generen 20 comptes amb les seves claus privades.
   - Copieu la clau privada del compte número 5 (el sisè de la llista, ja que comença per 0).
   - A Metamask, feu clic a la icona del compte a la part superior dreta i seleccioneu "Importar compte".
   - Enganxeu la clau privada i feu clic a "Importar".

5. **Importar el token creat a Metamask per veure el saldo rebut**:
   - A Metamask, aneu a la pestanya "Actius".
   - Desplaceu-vos cap avall i feu clic a "Importar token".
   - Enganxeu l'adreça del contracte que heu copiat anteriorment.
   - Els camps "Símbol del token" i "Decimals de precisió" s'haurien d'omplir automàticament (MTK i 18).
   - Feu clic a "Afegir token personalitzat" i després a "Importar".
   - Ara hauríeu de veure el saldo del token MTK al vostre compte de Metamask.

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
