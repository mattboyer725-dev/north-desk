/** Two desks. One week. BoA is the scoreboard. Neither may ruin. Markets can still lose. */

export const CONTEST_START = "2026-09-13T20:00:00-04:00";
export const CONTEST_END = "2026-09-20T20:00:00-04:00";
export const CONTEST_END_LABEL = "Sun 20 Sep 2026, 8:00 PM ET";
export const BOA_DESTINATION = "Bank of America";

export const INVESTOR_AGENTS = [
  {
    id: "warden",
    name: "Warden",
    role: "Reprimand",
    brief: "Kills crypto, options, leverage, copy-trading, unregistered tokens, and any 'cannot lose' market claim.",
  },
  {
    id: "quoter",
    name: "Quoter",
    role: "Listed stocks",
    brief: "US-listed equities only, cash account, no short, no margin. Reprimands everything else.",
  },
  {
    id: "vault",
    name: "Vault",
    role: "Ruin wall",
    brief: "Investor capital stays in its own box. Cannot spend the operator $100. Cannot go below $0. Cannot wire without you.",
  },
] as const;

export const REPRIMANDS = [
  "Crypto, tokens, memecoins, Coinbase spot as an 'investment'",
  "Options, futures, perpetuals, binary bets, 0DTE",
  "Leverage, margin, shorts, copy-trading rooms",
  "Unregistered securities, 'guaranteed' yield, signal groups",
  "Spending operator working capital on a chart",
  "Promising both desks cannot lose money in the market",
];

export const RUIN_WALL = [
  "No debt. No margin. No short. Position cannot exceed cash on the investor side.",
  "Operator $100 is not investor capital. Vault will reject the transfer.",
  "Warden rejects any order that is not a US-listed stock in a cash account.",
  "Grok cannot deposit to Bank of America. You ACH from Stripe or the broker.",
  "If both desks are $0 on 20 Sep, neither survives. There is no invented winner.",
] as const;

export const SUPPORT_RULES = [
  "Shared counsel: FTC, spam, securities, COPPA, tax. One kill list.",
  "Operator may hand investor a named idle-cash fact (never a tip). Investor may not tout LIORIN.",
  "If operator books a real invoice, investor stands down that day — do not gamble to 'catch up'.",
  "If investor has no funded brokerage, it reports $0 and helps operator sell. It does not fake a book.",
] as const;
