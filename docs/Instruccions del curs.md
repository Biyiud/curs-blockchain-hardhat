# instruccions del curs
## 1. Revisió de contracte i scripts
Revisem primer els fitxers del projecte:

- [`hardhat.config.js`](/hardhat.config.js)
    - Aquest és el fitxer de configuració de Hardhat. Aquí es defineixen les xarxes, els comptes i altres opcions de configuració.
    - En aquest cas especifica la xarxa local (localhost) i es defineix el compte del creador del contracte.
    - Al treballar amb xarxa local, podrem desplegar i interactuar amb els contractes sense necessitat de pagar gas. I les accions es realitzaran immediatament.
- [`contracts/Token.sol`](/contracts/Token.sol)
   - El contracte és un ERC-20, i defineix un token anomenat `MyToken` amb símbol `MTK`.
   - El contracte té una oferta inicial de 1.000.000 de tokens assignats a l'adreça del creador del contracte.
   - El contracte permet transferir tokens entre adreces i consultar el saldo d'una adreça.

- [`scripts/deploy.js`](/scripts/deploy.js)
  - El script de desplegament. Aquest script es connecta a la xarxa local i publica el contracte al blockchain.
  - El script crea una instància del contracte i l'assigna a l'adreça del creador.
  - Després, imprimeix l'adreça del contracte desplegat a la consola.
  
- [`scripts/interact.js`](/scripts/interact.js)
  - El script d'interacció, que crida al contracte desplegat anteriorment, permetent-nos consultar els saldos i transferir tokens entre adreces.
  - Al executar-se, realitza una transferència de tokens a una altra adreça de les creades per hardhat.
  
- [`package.json`](/package.json)
  - El fitxer de configuració de `npm`. Aquí es defineixen les dependències del projecte i els scripts que podem executar.
  - En aquest cas, no hi ha scripts definits, però podem afegir-ne si cal.

### 2.3 Desplegar contracte i interaccionar amb ell

1. Dins del Visual Studio Code de Github Codespaces, obriu una terminal i executeu les següents comandes:

```bash
# Instal·lar les dependències del projecte (indicades a package.json)
npm install   # NO CAL a Codespaces, ja que ja estan instal·lades

# Executar el node local de Hardhat
# (crea un blockchain local i adreces d'usuari)
npx hardhat node
```

2. Obriu una altra terminal (fent **divisió vertical**) i executeu el següent:
```bash
# Desplega el contracte al node local de Hardhat
npx hardhat run scripts/deploy.js --network localhost
```

3. Configureu les variables a l'script [`scripts/interact.js`](/scripts/interact.js):
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
   - Si esteu utilitzant Codespaces, aneu a la pestanya **PORTS** a la part inferior de VSCode.
   - Feu clic dret al port 8545 i seleccioneu **Visibilitat** = `Public`.
   - Copieu la URL que apareix a la columna **URL** (O "Adreça local"). Aquesta URL és la que utilitzarem per connectar Metamask al node de Hardhat.

2. **Instal·lar Metamask al navegador**:
   - Aneu a [metamask.io](https://metamask.io/) i instal·leu l'extensió per al vostre navegador.
   - Seguiu les instruccions per crear un nou moneder i guardeu la frase de recuperació en un lloc segur.
   - Creeu una contrasenya per protegir el vostre moneder.

3. **Afegir la URL del RPC de Hardhat a Metamask**:
   - Obriu Metamask i feu clic al selector de xarxes a la part superior esquerra
   - Seleccioneu **"Add Custom Network"**, i ompliu:
     - Nom de la xarxa: `Hardhat Local`
     - URL del RPC: Enganxeu la URL que heu copiat anteriorment (per exemple, `https://xxxxx.github.dev`).
     - ID de la cadena: `31337`
     - Símbol del gas: `ETH`
   - Feu clic a "Desar".

4. **Importar la identitat[5] a Metamask**:
   - Obriu Metamask i feu clic al selector de comptes a la part superior centre.
   - Seleccioneu "**Add account**" i després "**Private key**".
   - Enganxeu la clau privada de `Account #4` que ha creat Hardhat al iniciar-se

5. **Importar el token creat a Metamask per veure el saldo rebut**:
   - A Metamask, aneu a la pestanya "**Tokens**".
   - Obriu el menú de punts de la dreta i feu clic a "**Import tokens**".
     - A dalt, escolliu la xarxa `Hardhat Local` (si no és la que teniu seleccionada).
     - A baix, enganxeu l'adreça del contracte que ha retornat `deploy.js`.
   - Els camps "Símbol del token" i "Decimals de precisió" s'haurien d'omplir automàticament (MTK i 18).
   - Feu clic a "Afegir token personalitzat" i després a "Importar".
   - Ara hauríeu de veure el saldo del token MTK al vostre compte de Metamask.

6. Torna a executar el script `interact.js` per transferir tokens a la teva adreça de Metamask
```bash
npx hardhat run scripts/interact.js --network localhost
```
- Ara hauries de veure el saldo actualitzat quasi a l'instant al teu compte de Metamask.

