# Aria — Messaggistica cifrata end-to-end

Aria è un'app di messaggistica web in stile WhatsApp: **accesso con numero di telefono e
verifica via SMS**, profilo con foto/nome/bio, **sincronizzazione dei contatti del
telefono** e **crittografia end-to-end reale** (non simulata), con un'interfaccia in
stile **"Liquid Glass" iOS 26** (pannelli vetro smerigliato, bolle di messaggio in
gradiente, tab bar traslucida). È una **PWA installabile**: si apre da browser e si
aggiunge alla schermata Home come un'app nativa, sia su iOS/Safari sia su Android/desktop
Chrome/Edge.

## Accesso: telefono + verifica SMS

- Login basato solo su **numero di telefono + codice OTP a 6 cifre**, senza password —
  come WhatsApp/Signal. La sessione resta valida (JWT di lunga durata) finché non fai
  logout, quindi puoi richiudere l'app e riaprirla quando vuoi senza rifare l'accesso.
- **Modalità demo attiva di default**: senza un provider SMS configurato, il codice OTP
  viene mostrato a schermo invece di essere inviato via SMS reale, così l'app resta
  interamente testabile a costo zero. Per abilitare l'invio SMS reale via **Twilio**
  basta valorizzare tre variabili d'ambiente sul server (nessuna modifica al codice):
  ```bash
  TWILIO_ACCOUNT_SID=...
  TWILIO_AUTH_TOKEN=...
  TWILIO_FROM_NUMBER=+1...
  ```
- Al primo accesso viene richiesto di impostare **nome, bio e foto profilo** (l'immagine
  viene ritagliata a quadrato lato client prima dell'invio).

## Sincronizzazione contatti

- Su **Chrome/Edge per Android**, la pagina "Nuova conversazione" può leggere la rubrica
  del telefono tramite la **Contact Picker API** del browser (richiede un tocco esplicito
  dell'utente: nessun accesso automatico o in background). I numeri vengono confrontati
  con quelli registrati su Aria e si può scrivere subito a chi la usa già.
- Questa è una limitazione delle piattaforme, non di Aria: **iOS Safari e i browser
  desktop non espongono alcuna API web per leggere la rubrica**. Su questi browser la
  pagina "Nuova conversazione" mostra una ricerca manuale per nome o numero.

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
│       ├── db.js              SQLite (node:sqlite) — utenti, OTP, conversazioni, messaggi cifrati
│       ├── lib/phone.js       Normalizzazione/validazione numeri (libphonenumber-js)
│       ├── lib/otp.js         Generazione/hash del codice OTP
│       ├── lib/sms.js         Invio SMS: Twilio se configurato, altrimenti modalità demo
│       ├── routes/            REST: auth (telefono+OTP), users (profilo/avatar/contatti), conversations
│       ├── ws.js               Relay WebSocket per invio/ricezione in tempo reale
│       └── index.js            Entry point Express + hosting statico della build client
└── client/          Frontend React + TypeScript + Vite, PWA installabile
    └── src/
        ├── lib/crypto.ts       Modulo crittografia E2E (Web Crypto API)
        ├── lib/phone.ts        Selettore paese, formattazione e validazione numero
        ├── lib/contacts.ts     Wrapper Contact Picker API (con fallback)
        ├── lib/image.ts        Ritaglio/ridimensionamento foto profilo lato client
        ├── lib/api.ts          Client REST
        ├── lib/ws.ts           Client WebSocket con auto-riconnessione
        ├── context/            Stato di autenticazione + identità di cifratura
        ├── components/         UI riutilizzabile in stile Liquid Glass
        └── pages/               Telefono → OTP → Profilo, Lista chat, Chat, Nuova chat, Impostazioni
```

## Avvio in sviluppo

Servono due terminali (il client in dev proxya `/api`, `/ws` e `/avatars` verso il
backend):

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

Apri `http://localhost:5173`. Senza credenziali Twilio configurate, il codice OTP
richiesto in fase di login compare direttamente nella schermata di verifica.

## Build di produzione (singolo servizio)

Il backend serve anche la build statica del client, quindi in produzione basta un solo
processo/porta:

```bash
cd client && npm install && npm run build
cd ../server && npm install
JWT_SECRET="una-chiave-lunga-e-casuale" npm start
```

L'app (incluse le API, il WebSocket, gli avatar e la PWA) sarà disponibile su
`http://localhost:4000`. Imposta `JWT_SECRET` a un valore lungo e casuale in produzione,
ed eventualmente le variabili Twilio per l'invio SMS reale (vedi `server/.env.example`).

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
