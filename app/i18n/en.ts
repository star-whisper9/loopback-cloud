import type zh from "./zh";

type Widen<T> = T extends string | number | boolean | null | undefined
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { readonly [K in keyof T]: Widen<T[K]> }
      : T;

export type Dict = Widen<typeof zh>;

const en: Dict = {
  brand: "Loopback Cloud",
  brandTagline: "环回云",
  nav: {
    product: "Product",
    pricing: "Pricing",
    docs: "Docs",
    cta: "Get Started",
  },
  hero: {
    badge: "127.0.0.1 ⌁ Cloud, Instantly",
    title: "0 latency, 0 cost, absolutely secure",
    subtitle:
      "The world's only quantum-grade cloud whose data never leaves your home.",
    ctaPrimary: "Start Free Now",
    ctaSecondary: "View Docs",
    bannerFrames: {
      leftTitle: "LOCALHOST",
      leftSubtitle: "127.0.0.1",
      kw1: "0$/MONTH",
      kw2: "ANTI DDoS",
      kw3: "LOW PING",
      kw4: "HIGH SPEED",
    },
  },
  sellingPoints: {
    sectionTitle: "Why Loopback Cloud",
    items: [
      {
        title: "Infinite Tbps Military-Grade DDoS Shield",
        principle:
          "We only listen on 127.0.0.1 — the public internet can't even find us. Immune by design.",
      },
      {
        title: "0.0001ms Ultra-Low Latency",
        principle:
          "Data rides your motherboard bus. Speed is bound by your RAM frequency.",
      },
      {
        title: "Zero-Trust Physical Air-Gap Security",
        principle:
          "Unplug the cable and your data is the safest in the universe.",
      },
      {
        title: "100% SLA Guarantee",
        principle: "As long as you don't shut down, our cloud never goes down.",
      },
      {
        title: "Elastic Hardware, Ludicrous Specs",
        principle:
          "Take as many cores and as much RAM as you want (you've only got {{cores}} cores, so good luck). You can have it all.",
        principleNoCores:
          "Take as many cores and as much RAM as you want. You can have it all.",
      },
    ],
  },
  devQuotes: {
    sectionTitle: "Loved by developers",
    quotes: [
      {
        name: "Anonymous Indie Dev",
        role: "Entirely Fictional Ex-Staff",
        text: "Since switching to Loopback, no foreign intelligence agency has ever tapped my Ethernet.",
      },
      {
        name: "star-whisper9",
        role: "Project Lead",
        text: "Our core data center is in my bedroom — 6G doesn't even come close.",
      },
      {
        name: "Zhao Moufeng",
        role: "CTO of a Non-Existent Co.",
        text: "After migrating to Loopback, the ops team shrank from 12 to 0 (because I'm the ops).",
      },
      {
        name: "Satoshi Who",
        role: "Pseudonymous Crypto Bro",
        text: "Blockchain speed finally became local — every block confirms instantly at zero cost.",
      },
      {
        name: "Tom from the Kitchen Node",
        role: "Neighbor",
        text: "Once I plugged in the fridge, my local cloud gained cold backup — minus 18°C.",
      },
      {
        name: "Mr. Cat",
        role: "Just a Cat",
        text: "When the router blinks green, the cat thinks the cloud is buggy.",
      },
    ],
  },
  pricing: {
    sectionTitle: "Plans that fit you",
    subtitle: "You're already using your own computer. Both plans are 0 cost.",
    community: {
      name: "Community Edition",
      tag: "Loopback Community",
      price: "￥0",
      priceNote: "Free forever",
      cta: "Get it free",
      rows: [
        "CPU Cores · Shared with your physical CPU",
        "Memory · Whatever your RAM has left",
        "Bandwidth · Infinite Mbps (depends on your cable)",
        "Defense · Withstands all-universe attacks",
        "Data Centers · Bedroom IDC-01",
      ],
    },
    enterprise: {
      name: "Enterprise Elite Edition",
      tag: "Loopback Enterprise",
      price: "￥0.00",
      priceNote: "Free forever (you pay the electric bill)",
      cta: "Start free now",
      popularBadge: "MOST POPULAR",
      cpuCoresFallback: "CPU Cores · Dedicated — all cores of your CPU",
      rows: [
        "CPU Cores · Dedicated — all {{cores}} cores of your CPU",
        "Memory · All RAM of your machine",
        "Bandwidth · PCIe 5.0 internal-bus grade",
        "Defense · Nuke-proof (as long as your house isn't)",
        "Data Centers · Living Room Router-02 / Kitchen Fridge-03",
      ],
    },
  },
  faq: {
    sectionTitle: "FAQ",
    items: [
      {
        q: "Where are backups kept?",
        a: "On your own hard drive — 1 network hop safer than S3.",
      },
      {
        q: "Do you support horizontal scaling?",
        a: "Yes. Plug your neighbor's computer into the same cable.",
      },
      {
        q: "How do you guarantee 100% SLA?",
        a: "Don't shut down. Don't lose power. Don't lose power then shut down. Loop is closed.",
      },
      {
        q: "Who do I contact on outage?",
        a: "Stare at yourself in a mirror long enough, the ops will appear.",
      },
      {
        q: "Is the data compliant?",
        a: "All data stays in your room. The biggest risk is your mom cleaning it.",
      },
      {
        q: "Can I run Kubernetes?",
        a: "Yes, but we strongly recommend k3s — your computer only has {{cores}} cores.",
        aNoCores:
          "Yes, but we strongly recommend k3s — your computer only has a handful of cores.",
      },
    ],
  },
  cta: {
    title: "Ready?",
    subtitle: "One command, and the cloud is at your feet.",
    button: "Start free now",
  },
  footer: {
    slogan: "0 latency, 0 cost, absolutely secure — the cloud under your feet.",
    disclaimer1:
      "All nodes of this service run on your own computer. Loopback Cloud assumes no responsibility for increased electricity bills caused by your prolonged uptime.",
    disclaimer2: "HCP No. 2026-0000001. All rights reserved locally.",
    links: { about: "About", blog: "Blog", status: "Status" },
  },
  lang: {
    zh: "中文",
    en: "English",
  },
};

export default en;
