export const WEEK1_REPO = "https://github.com/mattboyer725-dev/week-one-sprint";
export const LIORIN_LIVE = "https://liorin-platform.vercel.app";
export const VERITYX_LIVE = "https://verityx-portal.vercel.app";
export const ASH_COW_REPO = "https://github.com/mattboyer725-dev/ash-cow";

export type WeekTask = { id: string; label: string; detail: string };

export const WEEK_TASKS: WeekTask[] = [
  {
    id: "stop-desks",
    label: "Freeze new desks",
    detail: "No new OS, portal, or Grok clone this week. Sell what is already live.",
  },
  {
    id: "counsel-w9",
    label: "Ask counsel about school invoicing",
    detail:
      "LIORIN school/club $99.99/mo is on EIN / W-9 hold. Do not turn it on yourself. One-off term invoices are the path until counsel says otherwise.",
  },
  {
    id: "list-ten",
    label: "Write ten names",
    detail: "People you already know: PTA, rec, after-school, chess coaches, parents of players. No scraped lists.",
  },
  {
    id: "send-five",
    label: "Send five LIORIN notes",
    detail: "Paste the club-term email. One follow-up only. Stop if they say no.",
  },
  {
    id: "ash-list",
    label: "List one original file on ASH COW",
    detail: "The week-one worksheets in the GitHub repo. Price $49. Original files only.",
  },
  {
    id: "post-cash",
    label: "Post every dollar in Cash",
    detail: "The mandate is a rolling average of deposits, not a forecast.",
  },
];

export const OFFERS = [
  {
    id: "liorin",
    name: "LIORIN club term",
    status: "Live",
    href: LIORIN_LIVE,
    price: "$1,200 for 8 sessions · $2,500 for a 10-week term",
    who: "PTA chairs, rec directors, chess coaches, parents — never children.",
    promise:
      "School-safe chess block. Recognition only (standings, badges, certificates). No cash prizes, no ads at kids, no student DMs.",
    letter: `Subject: 8-session chess block for your club

Hi {name},

I run LIORIN Chess Academy (Monticello / NYC area). School-safe teaching and play — standings and certificates only, nothing of monetary value for students.

I can run an 8-session after-school block for $1,200, or a 10-week term for $2,500. You get a coach desk, pairings, and a page parents can actually open: ${LIORIN_LIVE}

If useful, say when the kids already meet and I will work around that hour. If not, no chase.

Matt
LIORIN Chess Academy
`,
  },
  {
    id: "ash",
    name: "ASH COW listing",
    status: "Live kit",
    href: ASH_COW_REPO,
    price: "$49 one original file",
    who: "Operators you already talk to. Not a cold ads audience on day one.",
    promise: "A named worksheet they can use tomorrow. Refunds in plain language. No fake student counts.",
    letter: `Subject: 14-day offer sprint worksheets ($49)

Hi {name},

I listed a short pack I actually use: one offer page, one outreach note, one scope sheet. $49. Original files, plain refund.

Repo: ${WEEK1_REPO}

If it is not for you, ignore this.

Matt
`,
  },
  {
    id: "verityx",
    name: "VerityX 72-hour pilot",
    status: "Named buyer only",
    href: VERITYX_LIVE,
    price: "$2,500 / 72 hours",
    who: "Someone who already asked. Not a spray at Siemens or anyone else's trademark.",
    promise:
      "A scoped magnetics / PO-decision packet. No claim to be SAP, EcoVadis, or any vendor you do not subscribe to.",
    letter: `Subject: 72-hour decision packet ($2,500)

Hi {name},

You asked for a tight pass on {topic}. I can run a 72-hour pilot for $2,500: packet, human-approved call, PDF. I will not pretend to sit on a vendor you did not hire.

If the window moved, say so.

Matt
`,
  },
] as const;

export const DO_NOT = [
  "Do not email or advertise to minors. The buyer is an adult, school, or club.",
  "Do not turn on $99.99/mo school billing until counsel clears EIN / W-9.",
  "Do not trade the $100. Do not promise yield.",
  "Do not clone another desk this week.",
  "Do not use anyone else's trademark in an offer name.",
  "Do not scrape contact lists.",
];
