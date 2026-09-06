# Meogen playbook — sonraki projeler için

Robinhood Chain (4663) üzerinde mağara + tarot kedi-gen mix sitesi ve PAIR V2 ticker. Aşağıdaki notlar bu turdan.

## Yığın

| Parça | Seçim | Neden |
|---|---|---|
| Site | TanStack Start + React 19 + Tailwind v4 + Vite | Vercel preset: **TanStack Start**, Other değil |
| Host | Vercel, GitHub `meogenxyz/meogen` | `main` push = deploy |
| Domain | `www.meogen.xyz` kanonik; apex 308 → www | Sertifika ayrı: `meogen.xyz` ve `www` |
| Zincir | Robinhood **4663** | RPC `https://rpc.mainnet.chain.robinhood.com` |
| Explorer | [robinhoodchain.blockscout.com](https://robinhoodchain.blockscout.com) | Verify Remix’ten daha güvenilir |
| Solidity | **0.8.24**, optimizer **200**, EVM cancun | Remix = Blockscout aynı ayar |
| Oyun state | Zustand persist, cihazda | Cüzdan bağlanana kadar mix on-chain değil |
| Ticker | PAIR **V2**, Uniswap V4, kilitli LP | Nursery ayrı kontrat; PAIR sarmıyor |

## Ürün kuralları (kırma)

- Kendi IP. Catris / Mewgenics isim, art, combat, HP, zindan **yok**.
- Kedi = dört organ: head, body, tail, legs. Mix 50/50. %6 mutant. Coat uyuşmazsa chimera.
- Mix ücreti **Vat kontratına** gider, asla EOA’ya değil.
- Nursery sembolü **KIT**. Ticker **$MEOGEN**. İkisini karıştırma.
- Görseller orijinal (Gemini + cave). Eski OG/Catris kartını share’de bırakma.

Altı mutant: **Calix, Duet, Volt, Gale, Sigil, Patch**.

## Kontrat sırası (tersine çevirme)

1. **Vat** — constructor yok. `receive()` ile ETH yer.
2. Vat adresini kopyala, Blockscout’ta code var mı bak.
3. **Nursery(vat)** — constructor’a sadece Vat.
4. `nursery.vat() == Vat`. `mixFee` 0.0003 ETH. `socials()` çağır.
5. Ticker **ayrı**. PAIR yeni 1B `PairToken` basar; mevcut Nursery’yi listelemez.

NatSpec + on-chain string (İngilizce):

- `description` — kısa slogan
- `website` `twitter` `telegram` `github`
- `socials()` tuple

Verify: Remix’ten Blockscout. API `verifysourcecode` büyük dosyada 500 verebilir. Nursery constructor arg:

```
000000000000000000000000 + vat adresi (20 byte, 0x yok)
```

## PAIR launch

Docs: [pair.fund/docs](https://pair.fund/docs) · form: [pair.fund/launch](https://pair.fund/launch)

| | V1 | V2 |
|---|---|---|
| AMM | Uniswap V3, tek pair | Uniswap V4, 1–5 ağırlıklı |
| Fee mode | yok | Creator / Burn / Holder / Sharing |
| Durum | legacy | güncel |

**V2 kullan.** Üç pair (GLD/SLV/USO) V1’de olmaz.

Form:

- Name / Symbol (≤10). Image kare PNG/JPG (Calix 1024).
- Description + X / TG / site.
- **Custom quote discovery boş.** Vat, Nursery, rastgele CA yapıştırma. Katalogdan **+ Add market**.
- **US0 yok → USO** (petrol ETF). USDG = dolar. WETH = ETH rayı.
- Ağırlık toplamı **10000 bps**.
- Developer buy boşsa cüzdanda **0 token**. LP kilitli, mint yok.
- Launch fee 0.0003 ETH değil: PAIR **0.0005 ETH** + gas + (opsiyonel) buy.

Beş pair örneği (bu tur):

| Quote | % | bps | Rol |
|---|---|---|---|
| GLD | 25 | 2500 | altın, hikâye |
| SLV | 20 | 2000 | gümüş |
| USO | 20 | 2000 | petrol |
| USDG | 20 | 2000 | nakit alış |
| WETH | 15 | 1500 | ETH alış |

Penny stock (AMC, DJT, GME) ekleme. Eşit %20 yapma.

Satış: PAIR V4 + hook. Ev yapımı router/`PRIVATE_KEY` scripti hook’u kaçırır. Swap [pair.fund](https://pair.fund) arayüzü.

## Site / görsel

- Seçim çerçevesi **kartın** üstünde (`tarot__shot`), başlık+isim sarmasın. `outline-offset: 0`.
- OG **1200×630** `public/og.jpg`. Telegram eski kartı cache’ler → dosyayı değiştir, “Update preview again”.
- X banner **1500×500**. Article cover **5:2** (2160×864 veya 1500×600). Post still **3:2** (1800×1200).
- Logo: kare, Calix, üstte wordmark. Pons/PAIR upload için 1024 ve 512.
- Metin prompt’ta “NO text” dese bile model yazı basar — levhayı PIL ile kendin bas.
- Kanonik URL paylaşımda `https://www.meogen.xyz`. Apex http “Güvenli değil” gösterir; sertifika sağlam olabilir.

## Duyuru iskeleti

Kısa, İngilizce, mekanik + CA + site. Rakip isim yok.

```
The vat is open.

A cat is four organs. Mix two. Fifty-fifty. Six percent mutant. Keep the wrong ones.

https://www.meogen.xyz
CA 0x…
```

## Bu turdaki adresler (referans)

| Ne | Adres |
|---|---|
| Vat | `0x1a69f90479Cab01aC47c1c690c9001f0AfB26975` |
| Nursery | `0x6fc0658a530a85670926E4A85516A9eA88351eC9` |
| $MEOGEN | `0x503be5eeb51c2653fd8e84b049849a358e3d5555` |
| Deployer | `0x17f87b536fda233b39e04c2205875fdc718815c7` |

Site: [www.meogen.xyz](https://www.meogen.xyz) · PAIR: [token](https://pair.fund/token/0x503be5eeb51c2653fd8e84b049849a358e3d5555)

## Sonraki projede sıra

1. İsim, slogan, 3 sosyal, kare logo — **ticker’dan önce**.
2. Domain: www kanonik + HTTPS. OG’yi ilk günden doğru bas.
3. Fee sink kontrat (Vat), sonra oyun kontratı.
4. Remix verify, `socials()` oku.
5. Ticker: PAIR **V2**, pair listesi yazılı, developer buy kararı, custom quote boş.
6. CA’yı site + Codex + pin. Cüzdan/on-chain mint ayrı sprint.
7. PK sohbet/script’e girmez. Swap arayüzden.

## Kırılan şeyler

- Vercel **TanStack Start** preset. Other = yanlış adapter.
- Blockscout API verify 500 → Remix.
- Telegram OG cache. Dosya adı aynı kalsa bile içeriği değiştir + update preview.
- `outline` tüm butonda → karttan kaymış çerçeve.
- PAIR custom quote ≠ proje tokenı.
- Developer buy 0 = operasyonel 0 bag.
- lets.cash SDK (`@letscashfun/sdk`) PAIR V4 ile uyumsuz.
- www / apex ayrı cert; Chrome kırmızısı çoğu zaman `http://`.
