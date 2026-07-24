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
      kw1: { prefix: "0$/", kw: "MONTH" },
      kw2: { prefix: "ANTI ", kw: "DDoS" },
      kw3: { prefix: "LOW ", kw: "PING" },
      kw4: { prefix: "HIGH ", kw: "SPEED" },
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
      {
        title: 'Zero-Latency "On-Site" Ops',
        principle: "Just walk over and kick the host — instant physical reset.",
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
    subtitle: "One click, and the cloud is at your feet.",
    button: "Start free now",
  },
  footer: {
    slogan: "0 latency, 0 cost, absolutely secure — the cloud under your feet.",
    disclaimer1:
      "All nodes of this service run on your own computer. Loopback Cloud assumes no responsibility for increased electricity bills caused by your prolonged uptime.",
    disclaimer2: "HCP No. 2026-799325. All rights reserved locally.",
    links: { about: "About", blog: "Blog", status: "Status" },
  },
  console: {
    layout: {
      statusRunning: "Running",
      statusStopped: "Stopped",
      statusProvisioning: "Provisioning",
      start: "Start",
      stop: "Stop",
      delete: "Delete",
      confirmDeleteTitle: "Confirm Delete",
      confirmDeleteBody:
        "Data cannot be recovered after deletion. Are you sure you want to delete this machine?",
      back: "Back to Home",
      gotoConsole: "Enter Console",
      tabDashboard: "Dashboard",
      tabSpeedtest: "Speed Test",
      tabFirewall: "Cloud Firewall",
      instanceId: "Instance ID",
      publicIp: "Public IP",
      privateIp: "Private IP",
      spec: "Spec",
      region: "Region",
      uptime: "Uptime",
      os: "Operating System",
      dockerPort: "Container Port",
      edition: "Edition",
    },
    form: {
      titleCommunity: "Provision a Community Edition Instance",
      titleEnterprise: "Provision an Enterprise Elite Edition Instance",
      groupA: "Basic Configuration",
      groupB: "Hardware Spec",
      groupC: "System & Security",
      groupD: "SLA & Backup",
      f1: {
        label: "Hostname",
        desc: "Give your VM a name",
        placeholder: "loopback-1",
      },
      f2: { label: "Region", desc: "All regions live inside your home" },
      f3: {
        label: "CPU Cores",
        desc: "You only get as many cores as you actually have",
      },
      f4: { label: "Memory", desc: "Your physical RAM — use what's left" },
      f5: {
        label: "Bandwidth Plan",
        desc: "NIC cap = whatever your NIC can do",
      },
      f6: { label: "Operating System", desc: "Common cloud OS presets" },
      f7: {
        label: "Initial Firewall Policy",
        desc: "Pre-installed firewall rules",
      },
      f8: { label: "SLA Tier", desc: "Our SLA commitment" },
      f9: { label: "Backup Strategy", desc: "Host image backup" },
      f10: {
        label: "I have read the Loopback Cloud Terms of Service",
        desc: "",
      },
      cancel: "Cancel",
      submit: "Provision Now",
      required: "Required",
      termsError: "Please accept the Terms of Service first",
      policyDefaultSshHttpHttps: "Open SSH / HTTP / HTTPS by default",
      policySshOnly: "SSH only",
      policyDenyAll: "Deny all (high security)",
      policyNoPolicy: "No policy",
      cpuFixed: "Fixed {{cores}} cores (your physical CPU)",
      cpu1x: "1x ({{cores}} cores)",
      cpu15x: "1.5x overcommit",
      cpu2x: "2x overcommit",
      cpu4x: "4x overcommit",
      bandwidthShared100m: "100M Skinny Pipe (100 Mbps)",
      bandwidthShared1g: "Gigabit Interconnect (1 Gbps)",
      bandwidthDedicated1g: "Gigabit Interconnect (1 Gbps)",
      bandwidthQuantum10g: "10-Gigabit Interconnect (10 Gbps)",
      bandwidthBeyond100g: "InfiniBand (800 Gbps) — do you actually have this?",
      memoryAll: "All available",
      memoryVirtual8x: "Virtual Overcommit 8x",
      sla99_9: "SLA 99.9%",
      sla99_99: "SLA 99.99%",
      sla99_999: "SLA 99.999%",
      slaInfinity: "Infinite Any-Length SLA Promise",
      backupHostsMirror: "Local host single backup",
      backupHostsDoubleMirror: "Local host double backup",
      backupHostsTripleMirror: "Local host triple backup",
      backupEternalRedundancy: "Eternal Ring Redundancy",
    },
    provisioning: {
      steps: [
        "Allocating network IP 127.0.0.1",
        "Mounting LoopbackZone-B storage",
        "Starting instance container (reserving resources for the DDoS system)",
        "Syncing local host image backup",
        "Booting active DDoS defense",
        "Loading quantum-grade firewall policy matrix",
        "Registering with HCP top-level global node",
        "Quantum communication initialized",
      ],
      done: "Instance is ready",
      countdown: "Entering console shortly…",
    },
    dashboard: {
      cpu: "CPU Usage",
      memory: "Memory Usage",
      networkIn: "Network Ingress",
      networkOut: "Network Egress",
      unitCpu: "%",
      unitMemory: "MB",
      unitNetwork: "Kbps",
      restart: "Restart",
      restarting: "Restarting…",
      stoppedOverlay: "Instance is stopped",
      stoppedCta: "Start Instance",
    },
    speedTest: {
      start: "Start",
      running: "Testing…",
      ping: "Ping",
      download: "Download",
      upload: "Upload",
      unitMs: "ms",
      unitMbps: "Mbps",
      unitGbps: "Gbps",
      done: "Speed test complete",
      beat: "Faster than 99.99% of cloud providers worldwide",
      history: "History",
      stoppedOverlay: "Instance is stopped — speed test unavailable",
      noHistory: "No speed test records yet",
    },
    firewall: {
      addRule: "Add Rule",
      ruleLimitReached: "Rule limit reached (50)",
      addModalTitle: "Add Firewall Rule",
      fieldName: "Rule Name",
      fieldSource: "Source",
      fieldProtocol: "Protocol",
      fieldPort: "Port",
      fieldAction: "Action",
      actionAllow: "ALLOW",
      actionDrop: "DROP",
      actionEnable: "Enable",
      actionPause: "Pause",
      actionDelete: "Delete",
      statusEnabled: "Enabled",
      statusPaused: "Paused",
      colName: "Name",
      colSource: "Source",
      colProtocol: "Protocol",
      colPort: "Port",
      colAction: "Action",
      colStatus: "Status",
      colOps: "Ops",
      toastAdded: "Rule added",
      toastDeleted: "Rule deleted (undo within 3 seconds)",
      undo: "Undo",
      emptyWarnAllDrop:
        "No inbound ports open — the instance can't accept inbound connection",
      emptyWarnNoStrategy:
        "No firewall policy configured — the instance is unprotected",
      stoppedOverlay: "Instance is stopped — firewall halted",
      honestyNote:
        "All rules only apply to local loopback traffic. Since Loopback routes directly on the local network stack, no inbound connection on Earth can reach this instance without authorization.",
      sourceLocalhost: "Local host (127.0.0.1/32)",
      sourceAny: "Any external (0.0.0.0/0)",
      portAny: "Any port",
      invalidSource: "Please enter a valid IP or CIDR",
      invalidPort: "Port must be an integer between 1 and 65535",
      cancel: "Cancel",
      add: "Add",
    },
    toast: {
      storageError:
        "Storage write failed — check whether your browser is in private mode or local storage is disabled",
      machineDeleted: "Machine deleted",
      machineStopped: "Instance stopped",
      machineStarted: "Instance started",
      machineRestarting: "Instance restarting…",
      dataReset: "Legacy data detected — reset to keep things safe",
    },
  },
  lang: {
    zh: "中文",
    en: "English",
  },
};

export default en;
