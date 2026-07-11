export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'tip'; title: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  content: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-install-esim',
    title: 'How to Install a Vietnam eSIM: Step-by-Step Guide',
    excerpt:
      'Learn how to install and activate your Vietnam eSIM on iPhone and Android before you travel — with troubleshooting tips for international visitors.',
    category: 'Guide',
    date: '2024-01-15',
    readTime: '8 min',
    image: '/images/blog/ha-giang-road.jpg',
    imageAlt: 'Winding mountain road through green hills in Ha Giang, Vietnam',
    content: [
      {
        type: 'paragraph',
        text: 'A Vietnam eSIM lets you get online within minutes of landing — no physical SIM swap, no hunting for a shop at the airport. This guide walks you through installing and activating your eSIM on iPhone and Android, plus what to do if something goes wrong.',
      },
      {
        type: 'heading',
        text: 'Before You Start',
      },
      {
        type: 'list',
        items: [
          'Confirm your phone supports eSIM and is carrier-unlocked.',
          'Stay connected to stable Wi-Fi during installation (hotel, home, or airport Wi-Fi).',
          'Wait for your order email with the QR code and activation details (usually within 1–24 hours after payment).',
          'Install the eSIM before or after arrival — but only turn on mobile data when you are ready to start using the plan.',
        ],
      },
      {
        type: 'tip',
        title: 'Data-only eSIM reminder',
        text: 'Our Vietnam eSIM provides mobile internet only. It does not include a local phone number, voice calls, or SMS. Use WhatsApp, Telegram, Messenger, or other apps for calls and messaging.',
      },
      {
        type: 'heading',
        text: 'Install on iPhone (iOS)',
      },
      {
        type: 'list',
        items: [
          'Open Settings → Cellular (or Mobile Data) → Add eSIM.',
          'Choose "Use QR Code" and scan the QR code from your email.',
          'If scanning fails, tap "Enter Details Manually" and type the SM-DP+ address and activation code from your email.',
          'Follow the on-screen prompts and label the plan (e.g. "Vietnam Data").',
          'Leave the eSIM installed but turn off "Mobile Data" for this line until you arrive in Vietnam.',
        ],
      },
      {
        type: 'heading',
        text: 'Install on Android',
      },
      {
        type: 'list',
        items: [
          'Open Settings → Connections → SIM Manager (Samsung) or Mobile Network → Add eSIM (Pixel/other).',
          'Select "Scan QR code" or "Add eSIM" and scan the code from your email.',
          'For manual setup, enter the SM-DP+ address and activation code provided in your order email.',
          'Name the profile (e.g. "Vietnam eSIM") and complete installation.',
          'Disable mobile data on this line until you want the plan to activate.',
        ],
      },
      {
        type: 'image',
        src: '/images/blog/ha-giang-fog.jpg',
        alt: 'Mountain road in Ha Giang surrounded by fog and green valleys',
        caption: 'Stay connected on scenic routes like the Ha Giang Loop with a reliable Vietnam data plan.',
      },
      {
        type: 'heading',
        text: 'Activate When You Arrive in Vietnam',
      },
      {
        type: 'list',
        items: [
          'Turn on mobile data for your Vietnam eSIM line in Settings.',
          'Set the eSIM as your preferred line for mobile data (keep your home SIM for calls if using Dual SIM).',
          'Enable Data Roaming for the eSIM line if prompted.',
          'Wait 1–3 minutes to register on a local network (Viettel, Vinaphone, or Mobifone).',
          'If needed, enter the APN settings included in your order email.',
        ],
      },
      {
        type: 'heading',
        text: 'Troubleshooting',
      },
      {
        type: 'list',
        items: [
          'No signal: Restart your phone, toggle airplane mode, or manually select a network in Settings.',
          'QR scan fails: Use manual activation with SM-DP+ and activation code instead.',
          'Carrier locked device: Contact your home carrier to unlock before installing.',
          'Data not working: Check APN settings and confirm Data Roaming is enabled for the eSIM line.',
        ],
      },
      {
        type: 'tip',
        title: 'Need help?',
        text: 'Email support@esimviet.com with your order number and device model. Our team responds within a few hours.',
      },
    ],
  },
  {
    slug: 'esim-vs-sim-card',
    title: 'eSIM vs Physical SIM Card for Vietnam Travel',
    excerpt:
      'Compare eSIM and physical SIM cards for Vietnam — cost, convenience, setup time, and which option suits your trip best.',
    category: 'Guide',
    date: '2024-01-05',
    readTime: '7 min',
    image: '/images/blog/ha-giang-fog.jpg',
    imageAlt: 'Foggy mountain landscape in Ha Giang, Northern Vietnam',
    content: [
      {
        type: 'paragraph',
        text: 'International travelers visiting Vietnam have two main options for mobile data: buy a physical SIM at the airport or in the city, or install a digital eSIM before you fly. Both work — but the experience, cost, and convenience differ quite a bit.',
      },
      {
        type: 'heading',
        text: 'What Is an eSIM?',
      },
      {
        type: 'paragraph',
        text: 'An eSIM (embedded SIM) is a digital SIM profile stored on your phone. You download it by scanning a QR code — no plastic card, no tray, no shop visit. Most iPhones from XS onward and many recent Android phones support eSIM.',
      },
      {
        type: 'heading',
        text: 'eSIM vs Physical SIM: Quick Comparison',
      },
      {
        type: 'list',
        items: [
          'Setup time — eSIM: install at home on Wi-Fi in ~5 minutes. Physical SIM: queue at airport/city shop, show passport, wait 15–45 minutes.',
          'Cost — eSIM: often cheaper when bought online in advance. Physical SIM: tourist SIMs at airports can cost 2–3× more.',
          'Dual SIM — eSIM: keep your home number active for OTPs and calls via apps. Physical SIM: may require removing your home SIM on single-SIM phones.',
          'Activation — eSIM: QR code by email, activate on arrival. Physical SIM: staff installs and configures at the counter.',
          'Refunds — eSIM: clear policy before activation. Physical SIM: usually no refund once opened.',
        ],
      },
      {
        type: 'image',
        src: '/images/blog/ha-giang-road.jpg',
        alt: 'Aerial view of a winding road through Ha Giang mountains',
        caption: 'With an eSIM ready before you land, you can navigate remote areas like Ha Giang without stopping for a SIM shop.',
      },
      {
        type: 'heading',
        text: 'When to Choose an eSIM',
      },
      {
        type: 'list',
        items: [
          'You want data ready the moment you land at Noi Bai or Tan Son Nhat.',
          'Your phone supports eSIM and is unlocked.',
          'You prefer buying online with transparent pricing.',
          'You want to keep your home SIM for banking OTPs and WhatsApp.',
          'You are visiting for a fixed trip length (3–30 days) and want a pre-paid plan.',
        ],
      },
      {
        type: 'heading',
        text: 'When a Physical SIM Might Make Sense',
      },
      {
        type: 'list',
        items: [
          'Your device does not support eSIM.',
          'You need a local Vietnamese phone number for voice calls and SMS (our eSIM is data-only).',
          'You prefer buying in person and speaking with shop staff.',
        ],
      },
      {
        type: 'tip',
        title: 'Best of both worlds',
        text: 'On Dual SIM phones, use your home SIM for calls/OTP and a Vietnam eSIM for cheap, fast mobile data — no need to choose one or the other.',
      },
      {
        type: 'heading',
        text: 'Our Recommendation',
      },
      {
        type: 'paragraph',
        text: 'For most international tourists, a Vietnam eSIM is the faster and more affordable option. You skip airport queues, avoid language barriers at SIM counters, and start navigating with Google Maps as soon as you clear customs. If you only need internet (not local calls), eSIM is the clear winner.',
      },
    ],
  },
  {
    slug: 'vietnam-travel-tips',
    title: 'Vietnam Travel Guide: Best Tips for First-Time Visitors',
    excerpt:
      'Everything you need to know before visiting Vietnam — connectivity, currency, transport, culture, food, and the best regions to explore.',
    category: 'Vietnam',
    date: '2023-12-28',
    readTime: '12 min',
    image: '/images/blog/ha-giang-hills.jpg',
    imageAlt: 'Lush green hills and winding road in Ha Giang province, Vietnam',
    content: [
      {
        type: 'paragraph',
        text: 'Vietnam is one of Southeast Asia\'s most rewarding destinations — vibrant cities, world-class food, dramatic landscapes, and warm hospitality. Whether you are exploring Hanoi\'s Old Quarter, cruising Ha Long Bay, or riding the Ha Giang Loop, staying connected makes every part of the trip easier.',
      },
      {
        type: 'heading',
        text: 'Stay Connected: Get an eSIM Before You Fly',
      },
      {
        type: 'paragraph',
        text: 'Reliable mobile data is essential for Grab rides, Google Maps, restaurant reviews, and translation apps. Buy a Vietnam eSIM online before departure, install it on Wi-Fi, and activate when you land. No passport needed at a SIM shop — just scan and go.',
      },
      {
        type: 'tip',
        title: 'Connectivity tip',
        text: 'Download offline Google Maps for Hanoi, Ho Chi Minh City, and Da Nang as a backup. Mobile data from your eSIM will cover most areas, including many mountain routes.',
      },
      {
        type: 'heading',
        text: 'Best Time to Visit',
      },
      {
        type: 'list',
        items: [
          'North Vietnam (Hanoi, Ha Giang, Sapa): March–April and September–November for mild weather.',
          'Central Vietnam (Da Nang, Hoi An, Hue): February–August for beach weather; avoid heavy rain Oct–Dec.',
          'South Vietnam (Ho Chi Minh City, Mekong Delta): December–April (dry season).',
        ],
      },
      {
        type: 'heading',
        text: 'Money & Payments',
      },
      {
        type: 'list',
        items: [
          'Currency: Vietnamese Dong (VND). ATMs are widely available in cities.',
          'Cash is still king at street food stalls and small shops — carry small notes.',
          'Cards accepted at hotels, malls, and many restaurants in major cities.',
          'Grab and major apps accept card or cash — mobile data makes Grab essential.',
        ],
      },
      {
        type: 'image',
        src: '/images/blog/ha-giang-hills.jpg',
        alt: 'Green terraced hillsides in Ha Giang, Northern Vietnam',
        caption: 'Ha Giang province offers some of Vietnam\'s most dramatic scenery — best explored with reliable mobile data for maps and photos.',
      },
      {
        type: 'heading',
        text: 'Getting Around',
      },
      {
        type: 'list',
        items: [
          'Flights: VietJet, Vietnam Airlines, and Bamboo Airways connect major cities cheaply.',
          'Trains: Scenic but slow — good for Hanoi ↔ Da Nang or Ho Chi Minh routes.',
          'Grab: Ride-hailing in all major cities — cheaper and safer than random taxis.',
          'Motorbike: Popular in Ha Giang and the Central Highlands — only if you are an experienced rider.',
        ],
      },
      {
        type: 'heading',
        text: 'Must-Visit Places',
      },
      {
        type: 'list',
        items: [
          'Hanoi — Old Quarter, Hoan Kiem Lake, street food tours.',
          'Ha Long Bay — overnight cruise among limestone karsts.',
          'Hoi An — ancient town, lanterns, tailor shops, beaches nearby.',
          'Ho Chi Minh City — Ben Thanh Market, Cu Chi Tunnels, rooftop bars.',
          'Ha Giang Loop — 3–4 day motorbike adventure through northern mountains.',
          'Da Lat — cool climate, coffee farms, waterfalls.',
        ],
      },
      {
        type: 'heading',
        text: 'Food You Cannot Miss',
      },
      {
        type: 'list',
        items: [
          'Pho — Vietnam\'s iconic noodle soup (try both Hanoi and Saigon styles).',
          'Banh mi — crispy baguette sandwiches, perfect street food.',
          'Bun cha — grilled pork with noodles (Hanoi specialty).',
          'Cao lau — Hoi An\'s unique noodle dish.',
          'Ca phe sua da — iced coffee with condensed milk.',
        ],
      },
      {
        type: 'heading',
        text: 'Culture & Etiquette',
      },
      {
        type: 'list',
        items: [
          'Dress modestly when visiting temples and pagodas.',
          'Remove shoes when entering someone\'s home or certain shops.',
          'Bargaining is normal at markets — smile and negotiate politely.',
          'Tipping is not expected but appreciated at restaurants and for tour guides.',
          'Learn basic phrases: Xin chao (hello), Cam on (thank you), Bao nhieu? (how much?).',
        ],
      },
      {
        type: 'tip',
        title: 'First-time visitor checklist',
        text: 'eSIM installed ✓ · Passport valid 6+ months ✓ · Travel insurance ✓ · Grab app downloaded ✓ · Offline maps saved ✓ · Small USD/VND cash ✓',
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
