# Cono — componi il tuo gelato

App web per comporre un gelato in tempo reale: si parte dalla base (cono o
coppetta), si aggiungono fino a 3 gusti che si impilano visivamente, poi
decorazioni, glassa e topping. L'anteprima grande occupa la parte superiore
dello schermo, la barra di scelta scorrevole resta in basso.

L'illustrazione del gelato è interamente vettoriale (SVG generato via React),
con forme organiche "disegnate a mano" (blob con jitter seedato, non cerchi
perfetti) così ogni combinazione ha un aspetto leggermente unico ma stabile.

## Struttura

```
src/
├── data/options.ts        Basi, gusti, decorazioni, glasse, extra (colori, texture, prezzi)
├── hooks/useGelatoBuilder.ts   Stato della composizione, prezzo totale, reset, "sorprendimi"
├── lib/blob.ts             Generazione di forme organiche (Catmull-Rom → Bezier)
├── lib/rng.ts               PRNG seedato per texture/posizioni stabili
├── components/
│   ├── GelatoStage.tsx      Composizione SVG, framing automatico che si adatta al contenuto
│   ├── GelatoBase.tsx       Cono (cialda) o coppetta
│   ├── Scoop.tsx             Singola pallina con gradiente e texture per gusto
│   ├── Toppings.tsx          Decorazioni, glassa (con gocce) ed extra (panna, amarena, cialda)
│   ├── PickerBar.tsx         Barra inferiore con tab e selettori a scorrimento
│   └── OptionCard.tsx        Singola card di scelta
└── App.tsx                   Layout: header, stage, riepilogo/prezzo, picker bar
```

## Sviluppo

```bash
npm install
npm run dev
```

## Build di produzione

```bash
npm run build
```
