# Aria — Messaggistica cifrata end-to-end

Aria è un'app di messaggistica web con **crittografia end-to-end reale** (non simulata) e
un'interfaccia in stile **"Liquid Glass" iOS 26** (pannelli vetro smerigliato, bolle di
messaggio in gradiente, dynamic-island style badge, tab bar traslucida). È una **PWA
installabile**: si apre da browser e si aggiunge alla schermata Home come un'app nativa,
sia su iOS/Safari sia su Android/desktop Chrome/Edge.

## Come funziona la crittografia

- Ogni account genera nel browser una coppia di chiavi **ECDH (P-256)** tramite la
  **Web Crypto API**. La chiave privata è marcata *non estraibile* e non lascia mai il
  dispositivo: viene conservata come `CryptoKey` opaco in IndexedDB.
- Solo la chiave pubblica viene inviata al server e resa disponibile agli altri utenti.
- Per ogni conversazione, i due partecipanti derivano localmente (via ECDH) la stessa
  chiave simmetrica **AES-256-GCM**, usata per cifrare/decifrare i messaggi con un IV
  casuale ad ogni invio.
- Il server **inoltra e conserva solo testo cifrato** (ciphertext + IV): non ha mai
  accesso alle chiavi private né al contenuto in chiaro dei messaggi.
- Nella schermata Impostazioni ogni utente può confrontare il proprio "codice di
  sicurezza" (fingerprint SHA-256 della chiave pubblica) con quello del contatto, fuori
  banda, per verificare l'assenza di un attacco man-in-the-middle.
- Se si effettua l'accesso da un nuovo dispositivo/browser (senza la chiave privata
  storica), viene generata una nuova identità e la chiave pubblica sul server viene
  aggiornata automaticamente: le conversazioni precedenti non sono decifrabili dal nuovo
  dispositivo, esattamente come nel modello di sicurezza di Signal.

## Struttura del progetto

```
messaging-app/
├── server/          Backend Node.js/Express + WebSocket (relay in tempo reale)
│   └── src/
│       ├── db.js            SQLite (node:sqlite) — utenti, conversazioni, messaggi cifrati
│       ├── routes/          REST: auth, users, conversations
│       ├── ws.js             Relay WebSocket per invio/ricezione in tempo reale
│       └── index.js          Entry point Express + hosting statico della build client
└── client/          Frontend React + TypeScript + Vite, PWA installabile
    └── src/
        ├── lib/crypto.ts      Modulo crittografia E2E (Web Crypto API)
        ├── lib/api.ts         Client REST
        ├── lib/ws.ts          Client WebSocket con auto-riconnessione
        ├── context/           Stato di autenticazione + identità di cifratura
        ├── components/        UI riutilizzabile in stile Liquid Glass
        └── pages/              Login/Registrazione, Lista chat, Chat, Impostazioni
```

## Avvio in sviluppo

Servono due terminali (il client in dev proxya `/api` e `/ws` verso il backend):

```bash
# Terminale 1 — backend (porta 4000)
cd server
npm install
npm run dev

# Terminale 2 — frontend (porta 5173)
cd client
npm install
npm run dev
```

Apri `http://localhost:5173`.

## Build di produzione (singolo servizio)

Il backend serve anche la build statica del client, quindi in produzione basta un solo
processo/porta:

```bash
cd client && npm install && npm run build
cd ../server && npm install
JWT_SECRET="una-chiave-lunga-e-casuale" npm start
```

L'app (incluse le API, il WebSocket e la PWA) sarà disponibile su `http://localhost:4000`.
Imposta `JWT_SECRET` a un valore lungo e casuale in produzione (vedi `server/.env.example`).

## Installazione come app (PWA)

- **Android / Chrome / Edge desktop**: un banner in-app propone l'installazione
  (evento `beforeinstallprompt`); in alternativa, menu del browser → "Installa app".
- **iOS / Safari**: Safari non supporta l'installazione automatica; l'app mostra le
  istruzioni — tocca **Condividi → Aggiungi a Home**.
- Una volta installata, l'app si apre a schermo intero, senza barra degli indirizzi, con
  icona e splash screen dedicate.

## Icone

Le icone (stile "Liquid Glass": bolla di messaggio + lucchetto su gradiente indaco→teal)
sono generate con `client/scripts/generate_icons.py` (richiede `pip install Pillow`).
