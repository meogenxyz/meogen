export const CHAIN = {
  id: 4663,
  name: "Robinhood Chain",
  explorer: "https://robinhoodchain.blockscout.com",
  vat: "0x1a69f90479Cab01aC47c1c690c9001f0AfB26975",
  nursery: "0x6fc0658a530a85670926E4A85516A9eA88351eC9",
  token: "0x503be5eeb51c2653fd8e84b049849a358e3d5555",
  pair: "https://pair.fund/token/0x503be5eeb51c2653fd8e84b049849a358e3d5555",
  mixFeeWei: 300000000000000n, // 0.0003 ETH
  pairs: [
    { quote: "GLD", bps: 2500 },
    { quote: "SLV", bps: 2000 },
    { quote: "USO", bps: 2000 },
    { quote: "USDG", bps: 2000 },
    { quote: "WETH", bps: 1500 },
  ],
} as const;

export function explorerAddress(addr: string) {
  return `${CHAIN.explorer}/address/${addr}`;
}
