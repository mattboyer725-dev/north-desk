export type AgentId =
  | "scout"
  | "counsel"
  | "allocator"
  | "builder"
  | "closer"
  | "ledger"
  | "pulse";

export type OpportunityStatus =
  | "intake"
  | "counsel"
  | "building"
  | "live"
  | "earning"
  | "killed";

export type Opportunity = {
  id: string;
  title: string;
  playbookId: string;
  status: OpportunityStatus;
  thesis: string;
  capitalAsk: number;
  weeklyLow: number;
  weeklyHigh: number;
  legalNotes: string;
  nextAction: string;
  createdAt: string;
  counselCleared: boolean;
  plan?: string;
  offer?: string;
};

export type LedgerEntry = {
  id: string;
  at: string;
  type: "in" | "out";
  amount: number;
  note: string;
  opportunityId?: string;
};

export type PulseMove = {
  title: string;
  why: string;
  timebox: string;
  capital: number;
  legalNote: string;
};

export type PulseReport = {
  id: string;
  at: string;
  agent: AgentId;
  headline: string;
  realityCheck: string;
  counselWarnings: string[];
  moves: PulseMove[];
  body: string;
  doNotDo: string[];
  weeklyMath: string;
};

export type Playbook = {
  id: string;
  name: string;
  lane: string;
  capital: string;
  path: string;
  legal: string[];
  fortyEight: string[];
  toTarget: string;
};

export const WEEKLY_TARGET = 2500;
export const SEED = 100;

export const AGENTS: {
  id: AgentId;
  name: string;
  role: string;
  brief: string;
  runnable: boolean;
}[] = [
  {
    id: "scout",
    name: "Scout",
    role: "Gaps",
    brief: "Finds legal wedges — GitHub-shaped tools, digital products, specialist offers. Ignores lottery tickets and copycat brands.",
    runnable: true,
  },
  {
    id: "counsel",
    name: "Counsel",
    role: "Rails",
    brief: "Kills anything that could get you sued, fined, or banned. FTC, IP, securities, spam, tax. Non-negotiable.",
    runnable: false,
  },
  {
    id: "allocator",
    name: "Allocator",
    role: "Capital",
    brief: "Spends the $100 like a producer. Working capital for shipping, not bets on charts.",
    runnable: true,
  },
  {
    id: "builder",
    name: "Builder",
    role: "Ship",
    brief: "Turns a cleared idea into a 48-hour plan with a definition of done you can finish this week.",
    runnable: true,
  },
  {
    id: "closer",
    name: "Closer",
    role: "Offer",
    brief: "Price, promise, first buyer path. No fake urgency, no stolen characters, no unlicensed advice.",
    runnable: true,
  },
  {
    id: "ledger",
    name: "Ledger",
    role: "Cash",
    brief: "Cash in, cash out, rolling average against the $2,500 weekly mandate. Reminds you income is taxable.",
    runnable: false,
  },
  {
    id: "pulse",
    name: "Pulse",
    role: "Daily",
    brief: "Once a calendar day. One briefing, three moves, then the desk goes quiet.",
    runnable: true,
  },
];

export const COUNSEL_RAILS: { title: string; detail: string }[] = [
  {
    title: "No guaranteed yield",
    detail:
      "$100 in markets does not print $2,500 a week. That number is an operator target from selling work and products, not a return on capital.",
  },
  {
    title: "Not a broker or attorney",
    detail:
      "North Desk is an operations tool. It is not investment advice, legal advice, or tax advice. No securities solicitation.",
  },
  {
    title: "Intellectual property",
    detail:
      "Original work only. No cloning apps, characters, trademarks, or paid content. GitHub use stays inside each license (MIT, Apache, GPL copyleft).",
  },
  {
    title: "FTC and advertising",
    detail:
      "Affiliate and sponsored mentions need a clear disclosure. No fake reviews, no fake scarcity, no testimonials you cannot stand behind.",
  },
  {
    title: "Securities and crypto",
    detail:
      "No pump groups, wash trading, insider tips, or unregistered offerings. Paper research is fine. Treating $100 like a casino is out.",
  },
  {
    title: "Privacy and spam",
    detail:
      "No scraped contact lists, no CAN-SPAM/TCPA violations, no buying gray-market emails. First-party audiences only.",
  },
  {
    title: "Taxes",
    detail:
      "Revenue is taxable. Set aside a share (often 25–30% in the US) until a real accountant says otherwise. This is a reminder, not a filing.",
  },
  {
    title: "People",
    detail: "No targeting minors, no pyramid/MLM, no impersonation, no harvesting personal data without a policy.",
  },
];

export const PLAYBOOKS: Playbook[] = [
  {
    id: "digital",
    name: "Digital product",
    lane: "Product",
    capital: "$0–$20 for a domain and a checkout. Gumroad, Lemon Squeezy, or Stripe are free to start.",
    path: "Sell a specific artifact: a template pack, research brief, checklist system, or Notion/FigJam kit a defined buyer already pays for.",
    legal: [
      "You must own the files. No ripped marketplaces, no stock you cannot license.",
      "If you use AI-assisted drafting, you still review and stand behind the work.",
      "Refund policy in plain language.",
    ],
    fortyEight: [
      "Pick one buyer and one painful job (example: NYC freelance designers who hate invoice follow-up).",
      "Draft the outline. Cut until it is one deliverable, not a course.",
      "Package as PDF + bonus sheet. Price $29–$79.",
      "One landing page, one checkout, ten personal messages to people you already know.",
    ],
    toTarget:
      "At $49, you need ~51 sales a week — or a higher-ticket pack plus a service upsell. Volume comes from a list and repeats, not a single tweet.",
  },
  {
    id: "github",
    name: "GitHub wedge",
    lane: "Product",
    capital: "$0. GitHub Pages and a public repo are free. Paid hosting only when someone pays you.",
    path: "Carve a narrow tool around a workflow you already repeat. Ship a MIT-licensed core, sell hosting, support, or a pro binary.",
    legal: [
      "Respect upstream licenses. GPL on a dependency can force your distribution terms.",
      "Do not scrape GitHub users for spam. Issues and READMEs are enough.",
      "No copycat of a trademarked product with a vowel swapped.",
    ],
    fortyEight: [
      "Name the job in one sentence (what breaks, for whom).",
      "Ship a README, a 20-minute happy path, and a screenshot.",
      "Price support or a hosted lane. The repo stays free.",
      "Tell ten operators who already have the problem.",
    ],
    toTarget: "The repo is bait. Cash is support, hosting, or a term. One $1,200 term beats 24 $49 files.",
  },
  {
    id: "service",
    name: "Specialist term",
    lane: "Service",
    capital: "$0–$20 for invoicing. Do not buy ads until a named adult has paid once.",
    path: "Invoice a defined adult for a scoped block of work with a start, an end, and a deliverable they can point at.",
    legal: [
      "Buyer is an adult, PTA, rec director, or coach. Never a child.",
      "Plain scope. No unlicensed therapy, law, or investment advice.",
      "NY sole prop: invoice in your name until counsel says otherwise.",
    ],
    fortyEight: [
      "Write the one-paragraph offer and the two prices.",
      "Send five notes to people you already know. One follow-up. Stop if they say no.",
      "If they say yes, invoice the same day. Do not start unpaid.",
      "Log the deposit. Set aside tax.",
    ],
    toTarget: "One $1,200 block or one $2,500 term is the week. Do not hide behind a $4.44 SKU.",
  },
  {
    id: "local",
    name: "Local NYC / Hudson",
    lane: "Service",
    capital: "Transit and printed one-pagers, not a billboard.",
    path: "Show up where the buyer already meets: rec desk, PTA night, club hour. Hand a URL and an invoice line.",
    legal: [
      "No flyers on school property without permission.",
      "No talking to students as the buyer.",
      "If a district wants a vendor packet, that is counsel + EIN / W-9, not a hustle.",
    ],
    fortyEight: [
      "List three places you can walk into this week.",
      "One page: price, promise, URL, phone.",
      "Ask for the adult who books the hour.",
      "Leave. Do not loiter around kids.",
    ],
    toTarget: "Two conversations beat twenty cold emails. Term price stays $1,200 / $2,500.",
  },
  {
    id: "cohort",
    name: "Small cohort",
    lane: "Service",
    capital: "Zoom is free. Do not rent a venue on the seed.",
    path: "Six to twelve paying adults, fixed dates, original curriculum you already teach.",
    legal: [
      "Adults only unless a parent is the contracting party and the room is school-safe.",
      "No stolen puzzles or paid worksheets you do not own.",
      "Refund window in the invoice.",
    ],
    fortyEight: [
      "Six dates, one outcome, one price.",
      "Fill from people you already know before you post.",
      "Cap the room. Do not run it empty for 'content'.",
      "Record only with consent.",
    ],
    toTarget: "Eight seats at $300 is $2,400. That is a week. Do not discount into oblivion.",
  },
  {
    id: "affiliate",
    name: "Disclosed affiliate",
    lane: "Traffic",
    capital: "$0. You need a list you already talk to.",
    path: "Recommend a tool you actually use, with a clear #ad / affiliate line, to people who asked.",
    legal: [
      "FTC: disclose. Every time. Not in a link tree nobody opens.",
      "No fake scarcity. No 'I made $10k this morning'.",
      "No products you have not used.",
    ],
    fortyEight: [
      "Pick one tool you already pay for.",
      "Write the honest limitation first.",
      "Send to existing readers only.",
      "If you do not have readers, skip this lane this week.",
    ],
    toTarget: "Affiliate is a side stream. It does not hit $2,500 from a cold account. Do not make it the mandate.",
  },
  {
    id: "retainer",
    name: "Monthly retainer",
    lane: "Service",
    capital: "$0 until they pay. Do not staff up.",
    path: "A repeating adult buyer for a named weekly job (pairings, parent page, coach desk) with a kill switch.",
    legal: [
      "School $99.99/mo stays off until EIN / W-9 counsel.",
      "Contract in English. Scope and cancellation in the same page.",
      "No auto-renew traps.",
    ],
    fortyEight: [
      "Do not invent a new SKU. Use the live Member trial only as software.",
      "Term invoices beat a messy subscription this week.",
      "If they want monthly, send it to counsel first.",
      "Collect on day one.",
    ],
    toTarget: "A clean $2,500 term now. Recurring later, after counsel.",
  },
];

export const STARTER_OPPS: Opportunity[] = [
  {
    id: "opp-liorin-term",
    title: "LIORIN club term (live)",
    playbookId: "service",
    status: "live",
    thesis:
      "School-safe chess block already live. Sell an 8-session after-school for $1,200 or a 10-week term for $2,500. Buyers are PTA, rec, coaches, parents — never children.",
    capitalAsk: 0,
    weeklyLow: 1200,
    weeklyHigh: 2500,
    legalNotes:
      "Recognition only, no student cash prizes, no student DMs. School $99.99/mo stays off until counsel clears EIN / W-9. Frozen org inboxes stay frozen.",
    nextAction:
      "Haber follow-up sent 13 Sep (one shot). Paste the $1,200 posts as @liorin22. Call one adult you already know. Do not chase Haber twice.",
    createdAt: new Date().toISOString(),
    counselCleared: true,
  },
  {
    id: "opp-haber",
    title: "Robert Haber — club term",
    playbookId: "service",
    status: "live",
    thesis:
      "Named adult. Wrote 22 May about a chess-club demo. Follow-up sent 13 Sep with $1,200 / $2,500. Only named buyer in the mail.",
    capitalAsk: 0,
    weeklyLow: 1200,
    weeklyHigh: 2500,
    legalNotes: "One follow-up. STOP line sent. If silent or no, stop. Do not add family/scout threads.",
    nextAction: "Wait for a reply. If yes, invoice $1,200. If no or silence, stop.",
    createdAt: new Date().toISOString(),
    counselCleared: true,
  },
  {
    id: "opp-ash-file",
    title: "ASH COW $49 original file",
    playbookId: "digital",
    status: "building",
    thesis: "Backup SKU only. This week is the club term, not a $49 file.",
    capitalAsk: 0,
    weeklyLow: 0,
    weeklyHigh: 49,
    legalNotes: "Original files only. FTC-clean. Do not scrape a launch list.",
    nextAction: "Park unless Haber dies. Do not spend the week listing $49.",
    createdAt: new Date().toISOString(),
    counselCleared: true,
  },
  {
    id: "opp-verityx-pilot",
    title: "VerityX 72-hour pilot",
    playbookId: "service",
    status: "killed",
    thesis: "Nobody asked this week. Freeze new desks.",
    capitalAsk: 0,
    weeklyLow: 0,
    weeklyHigh: 0,
    legalNotes: "No impersonation of SAP, EcoVadis, Siemens. Do not build another desk.",
    nextAction: "Dead. Do not revive without a named adult who asked.",
    createdAt: new Date().toISOString(),
    counselCleared: false,
  },
  {
    id: "opp-investor-voo",
    title: "Investor VOO $100",
    playbookId: "github",
    status: "killed",
    thesis:
      "Coinbase USD $0 and no equities account. VOO-USDC ticket rejected 13 Sep. Not a $2,500 path even if funded.",
    capitalAsk: 100,
    weeklyLow: 0,
    weeklyHigh: 0,
    legalNotes: "No crypto, no options, no leverage. Do not spend operator seed.",
    nextAction: "Stands down. If a stock account is funded with $100, one cash VOO/SPY buy — else stay killed.",
    createdAt: new Date().toISOString(),
    counselCleared: false,
  },
];

export const STATUS_LABEL: Record<OpportunityStatus, string> = {
  intake: "Intake",
  counsel: "Counsel",
  building: "Building",
  live: "Live",
  earning: "Earning",
  killed: "Killed",
};

export function mixMath(productPrice: number, productShare: number) {
  const serviceShare = 1 - productShare;
  const serviceNeed = WEEKLY_TARGET * serviceShare;
  const productNeed = WEEKLY_TARGET * productShare;
  const units = productPrice > 0 ? Math.ceil(productNeed / productPrice) : 0;
  return { serviceNeed, productNeed, units };
}
