# MeogenNursery — Remix notes

Compiler **0.8.24**, optimizer **200 runs**, network Robinhood **4663**.

Do not deploy until a Bowl address exists. Mix fee must never land on an EOA.

## Constructor

```
MeogenNursery(bowl)
```

`bowl` is a vault contract, not a personal wallet.

## After deploy

1. Verify on Blockscout.
2. `mintFounder()` from a test wallet (cap 500).
3. `mix(dam, sire)` with `mixFee` (default 0.0003 ETH) to Bowl.
4. `tokenURI(id)` returns a genome seal SVG. Overflowing sprites stay on the site.

Site cats are local until this is live. Token ticker comes later — after kittens travel.
