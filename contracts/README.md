# Meogen pre-contracts — Remix notes

Compiler **0.8.24**, optimizer **200 runs**, EVM **cancun** (or default), network Robinhood **4663**.

These are **not** the Pons `$MEOGEN` ticker. Token comes later, after kittens travel.

## Order (do not reverse)

1. Deploy **MeogenVat** — no constructor args.
2. Copy the Vat address. Confirm it is a contract (Blockscout code).
3. Deploy **MeogenNursery(`vat`)** — constructor takes that address.
4. Call `nursery.vat()` and check it equals the Vat.

On-chain strings (same on both contracts):

- website `https://meogen.xyz`
- twitter `https://x.com/meogenXYZ`
- telegram `https://t.me/meogenXYZ`
- github `https://github.com/meogenxyz/meogen`

## Live (Robinhood 4663)

- Vat [`0x1a69f90479Cab01aC47c1c690c9001f0AfB26975`](https://robinhoodchain.blockscout.com/address/0x1a69f90479Cab01aC47c1c690c9001f0AfB26975)
- Nursery [`0x6fc0658a530a85670926E4A85516A9eA88351eC9`](https://robinhoodchain.blockscout.com/address/0x6fc0658a530a85670926E4A85516A9eA88351eC9)

Nursery `vat()` returns the Vat. Mix fee 0.0003 ETH.

## After deploy

1. Verify both on [Blockscout](https://robinhoodchain.blockscout.com).
2. `mintFounder()` from a test wallet (cap 500, free).
3. `mix(dam, sire)` with `msg.value >= mixFee` (default **0.0003 ETH**). Whole value goes to Vat.
4. `tokenURI(id)` is a genome seal SVG. Illustrated mutant cards stay on the site.

## Remix

- Open `MeogenVat.sol`, compile 0.8.24 / 200, deploy.
- Open `MeogenNursery.sol`, compile same settings, deploy with Vat address.
- Environment: Injected Provider, Robinhood Chain 4663.

## What this is not

- Not ERC-721 (no approve / marketplace listing yet).
- Not `$MEOGEN`. Nursery symbol is **KIT**.
- Site cats stay on the device until you wire the address in.

## Owner knobs

| Call | Who | What |
|---|---|---|
| `setMixFee(wei)` | Nursery owner | Change mix price |
| `setVat(contract)` | Nursery owner | Move fee sink (must be a contract) |
| `sweep(to, amount)` | Vat owner | Move ETH out of the Vat |
