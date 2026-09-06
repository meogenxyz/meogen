export const CHAIN = {
  id: 4663,
  name: "Robinhood Chain",
  explorer: "https://robinhoodchain.blockscout.com",
  vat: "0x1a69f90479Cab01aC47c1c690c9001f0AfB26975",
  nursery: "0x6fc0658a530a85670926E4A85516A9eA88351eC9",
  mixFeeWei: 300000000000000n, // 0.0003 ETH
} as const;

export function explorerAddress(addr: string) {
  return `${CHAIN.explorer}/address/${addr}`;
}
