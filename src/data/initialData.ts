import { Product, StoreSettings, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'min-sk-001',
    name: 'Minimalist 10% Niacinamide Face Serum with Zinc',
    category: 'Skincare',
    price: 9.5,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist 10% Niacinamide serum bottle with dropper on a pristine white background.',
    description:
      'A nourishing, oil-free daily serum formulated with 10% pure Niacinamide (Vitamin B3) and 1% Zinc PCA. Effectively fades acne marks, minimizes enlarged pores, balances excess sebum, and strengthens the skin barrier.',
    dimensions: '30ml / 1.0 fl. oz. Dropper Bottle',
    materials: '10% Pure Niacinamide, 1% Zinc PCA, EUK-134, Aloe Vera Juice (pH 5.5 - 6.0)',
    inStock: true,
    stockCount: 45,
    sku: 'MIN-NIA-10',
    featured: true,
  },
  {
    id: 'min-sk-002',
    name: 'Minimalist 2% Salicylic Acid Face Serum',
    category: 'Skincare',
    price: 8.5,
    image:
      'https://images.unsplash.com/photo-1608248597359-54876b6d511b?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist 2% Salicylic Acid BHA serum with pipette dropper in high-key lighting.',
    description:
      'Oil-soluble BHA (Salicylic Acid) exfoliant that easily penetrates pore walls to dissolve trapped sebum and dead skin cells. Clinically proven to reduce blackheads, whiteheads, and prevent active breakout recurrence.',
    dimensions: '30ml / 1.0 fl. oz. Dropper Bottle',
    materials: '2% Pure Salicylic Acid, Oligopeptide-10, EGCG Green Tea Extract (pH 3.5 - 4.0)',
    inStock: true,
    stockCount: 38,
    sku: 'MIN-SAL-02',
    featured: true,
  },
  {
    id: 'min-sk-003',
    name: 'Minimalist SPF 50 PA++++ Multi-Vitamin Sunscreen',
    category: 'Skincare',
    price: 7.5,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist SPF 50 sunscreen cream tube set against bright minimalist backdrop.',
    description:
      'Broad-spectrum SPF 50 sunscreen boosted with Vitamin A, B3, B5, E & F. Ultralight lotion texture that absorbs in seconds with zero white cast, zero greasy residue, and superior photo-stable UV protection.',
    dimensions: '50g / 1.76 oz. Squeeze Tube',
    materials: '4 UV Photostable Filters, Multi-Vitamin Complex (A, B3, B5, E, F), Non-comedogenic',
    inStock: true,
    stockCount: 60,
    sku: 'MIN-SUN-50',
    featured: true,
  },
  {
    id: 'min-sk-004',
    name: 'Minimalist 10% Vitamin C + AG 1% Glow Serum',
    category: 'Skincare',
    price: 11.0,
    image:
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist Vitamin C brightening serum in amber dropper bottle.',
    description:
      'Highly stable 10% Ethyl Ascorbic Acid (Vitamin C) combined with 1% Acetyl Glucosamine and Centella. Promotes collagen synthesis, combats oxidative stress, and dramatically brightens dull, tired complexion.',
    dimensions: '30ml / 1.0 fl. oz. Amber UV Bottle',
    materials: '10% Ethyl Ascorbic Acid, 1% Acetyl Glucosamine, Centella Asiatica (pH 4.0 - 4.5)',
    inStock: true,
    stockCount: 30,
    sku: 'MIN-VIT-10',
    featured: true,
  },
  {
    id: 'min-sk-005',
    name: 'Minimalist 2% Hyaluronic Acid + PGA Hydrating Serum',
    category: 'Skincare',
    price: 9.0,
    image:
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist Hyaluronic Acid multi-molecular hydrating serum.',
    description:
      'A multi-depth hydration serum containing high, medium, and low molecular weight Hyaluronic Acid plus Polyglutamic Acid (PGA). Delivers instant surface plumping and deep, long-lasting moisture barrier replenishment.',
    dimensions: '30ml / 1.0 fl. oz. Dropper Bottle',
    materials: '2% Multi-Molecular HA, Polyglutamic Acid, Copper Peptide, Glyceryl Glucoside',
    inStock: true,
    stockCount: 40,
    sku: 'MIN-HYA-02',
    featured: true,
  },
  {
    id: 'min-sk-006',
    name: 'Minimalist 0.3% Retinol + Q10 Anti-Aging Serum',
    category: 'Skincare',
    price: 10.0,
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist Retinol anti-aging facial oil serum in protective glass bottle.',
    description:
      'Water-free, squalane-based 0.3% pure Retinol paired with 1% Coenzyme Q10. Accelerates cellular turnover, smoothes fine lines and wrinkles, and refines uneven skin texture with minimal irritation.',
    dimensions: '30ml / 1.0 fl. oz. Amber UV Bottle',
    materials: '0.3% Pure Retinol, 1% Coenzyme Q10, Plant-derived Squalane Base',
    inStock: true,
    stockCount: 25,
    sku: 'MIN-RET-03',
  },
  {
    id: 'min-sk-007',
    name: 'Minimalist 2% Alpha Arbutin Anti-Pigmentation Serum',
    category: 'Skincare',
    price: 9.0,
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist Alpha Arbutin dark spot corrector serum bottle.',
    description:
      'An advanced depigmenting serum formulated with 2% pure Alpha Arbutin and Hyaluronic Acid. Fades stubborn dark spots, sun spots, melasma, and hyperpigmentation for an even, translucent tone.',
    dimensions: '30ml / 1.0 fl. oz. Dropper Bottle',
    materials: '2% Pure Alpha Arbutin, 1% Hyaluronic Acid, Aloe Leaf Extract (pH 4.7 - 5.2)',
    inStock: true,
    stockCount: 32,
    sku: 'MIN-ARB-02',
  },
  {
    id: 'min-sk-008',
    name: 'Minimalist Ceramide 0.3% + Madecassoside Moisturizer',
    category: 'Skincare',
    price: 9.5,
    image:
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist Ceramide barrier repair moisturizer in pump jar.',
    description:
      'Intensive skin-repair cream infused with 5 essential Ceramides (EOP, NP, AP, AS, NS) in a 3:1:1 physiological ratio, reinforced with 95% pure Madecassoside. Calms redness, soothes irritation, and repairs compromised barriers.',
    dimensions: '50g / 1.76 oz. Airless Pump',
    materials: '0.3% Ceramides Complex (5 types), Madecassoside, Aminobutyric Acid (GABA)',
    inStock: true,
    stockCount: 28,
    sku: 'MIN-CER-03',
  },
  {
    id: 'min-sk-009',
    name: 'Minimalist Oat Extract 6% Gentle Soothing Cleanser',
    category: 'Skincare',
    price: 6.0,
    image:
      'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist Oat Extract gentle creamy face cleanser with pump.',
    description:
      'Sulfate-free, ultra-mild creamy cleanser enriched with 6% Colloidal Oat Extract and Hyaluronic Acid. Gently lifts makeup and dirt while soothing sensitive, dry, and irritated skin without stripping moisture.',
    dimensions: '120ml / 4.05 fl. oz. Pump Dispenser',
    materials: '6% Colloidal Oat Extract, Sodium Cocoyl Glycinate, Hyaluronic Acid (pH 5.5 - 6.0)',
    inStock: true,
    stockCount: 50,
    sku: 'MIN-CLN-06',
  },
  {
    id: 'min-sk-010',
    name: 'Minimalist AHA 25% + PHA 5% + BHA 2% Peeling Solution',
    category: 'Skincare',
    price: 10.5,
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist 32% AHA PHA BHA exfoliating peel solution in dropper bottle.',
    description:
      'A powerful 10-minute rinse-off exfoliating treatment combining 25% AHA (Glycolic & Lactic), 5% PHA, and 2% BHA. Buffs away dead surface skin cells, unblocks congested pores, and reveals luminous radiance.',
    dimensions: '30ml / 1.0 fl. oz. Dropper Bottle',
    materials: '25% Glycolic/Lactic Acid, 5% Gluconolactone, 2% Salicylic Acid, Tasmanian Pepperberry',
    inStock: true,
    stockCount: 22,
    sku: 'MIN-PEL-32',
  },
  {
    id: 'min-sk-011',
    name: 'Minimalist PHA 3% Alcohol-Free Balancing Face Toner',
    category: 'Skincare',
    price: 7.0,
    image:
      'https://images.unsplash.com/photo-1512290900672-1f02e6040854?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist PHA 3% clarifying and balancing face toner bottle.',
    description:
      'Gentle exfoliating and balancing facial toner formulated with 3% Gluconolactone (PHA), Niacinamide, and Prebiotics/Probiotics. Tightens pores, rebalances skin microflora, and primes skin for serums.',
    dimensions: '150ml / 5.07 fl. oz. Bottle',
    materials: '3% Gluconolactone (PHA), Niacinamide, Polyglutamic Acid, Prebiotics (pH 4.0 - 4.5)',
    inStock: true,
    stockCount: 35,
    sku: 'MIN-TON-03',
  },
  {
    id: 'min-sk-012',
    name: 'Minimalist Maleic Bond Repair Complex 5% Hair Serum',
    category: 'Haircare',
    price: 9.5,
    image:
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop',
    altText:
      'Minimalist Maleic Bond Repair hair serum dropper on minimalist surface.',
    description:
      'Breakthrough pre-wash hair repair serum powered by 5% Maleic Acid, Transglutaminase, and Amino Acid complex. Rebuilds damaged keratin disulfide bonds caused by bleaching, heat styling, and chemical treatments.',
    dimensions: '50ml / 1.7 fl. oz. Dropper Bottle',
    materials: '5% Maleic Acid, Transglutaminase, 16 Amino Acids Complex, Moroccan Argan Oil',
    inStock: true,
    stockCount: 26,
    sku: 'MIN-HAR-05',
    featured: true,
  },
  {
    id: 'prod-1',
    name: 'Ceramic Vase Set',
    category: 'Home Decor',
    price: 45.0,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBu2jZCKHvQesXINmyx0LUOyMe-waNj68_Wb6Y2SEUSMj1gEkHAmYMTxo3V6npmt-fIeWQ9YiaJ2VrRrYQbdZ1MoJuDEAYXGmxqUmQqwavvYk0N29ahn9UC_uvid2WR5bOuXUu8bvIZY0g2lKJT3KTNxIVbj2n1ztlx1GSGyOuZYosWxqKbo1ckez9y2sVlZno8vzFMUMMgn9HWgIeynjj66PObHCzop9C79Zs8LfRCiLNxqVrvP2JJ',
    altText:
      'A minimalist ceramic vase set on a smooth white surface, bathed in soft, diffused natural light from a window.',
    description:
      'Handcrafted terracotta stoneware vase duo with matte unglazed tactile finish. Designed to hold dry botanicals, pampas grass, or standalone geometric sculpture on a credenza.',
    dimensions: 'Vase A: 18cm H x 12cm W | Vase B: 14cm H x 8cm W',
    materials: 'Natural Stoneware with matte unglazed mineral wash',
    inStock: true,
    stockCount: 18,
    sku: 'MS-HD-001',
  },
  {
    id: 'prod-2',
    name: 'Linen Throw Pillow',
    category: 'Textiles',
    price: 32.0,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-MWfaR4ltViGWE1aDIATfQnEcR49eITMbVSWegbraD2zisBSNYvlyT7GYmBs6Snq4rXhEYav4QytJZRtlLX1aBzK8r7MTe0PUSVoJfsp1-BC-sv6SzfEwK__L3i4aY_nxE-fstVH-W-XLLMQfuBQjky15x0fhbGNcEM5eHLxn2cPHiI7tlKOP2U2UA6zoS4bzaZyYrvL1qOIVwcwzHF6IvEfHQvz-n5E6-vR6iccNKePYzaMOvceK',
    altText:
      'A neatly folded linen throw pillow resting on a light wood chair.',
    description:
      '100% Belgian stonewashed linen cover with hypoallergenic duck feather insert. Soft dove gray hue that lends tranquil tactile warmth to seating and beds.',
    dimensions: '50cm x 50cm (20in x 20in)',
    materials: '100% Certified French Flax Linen, Brass Hidden Zipper',
    inStock: true,
    stockCount: 24,
    sku: 'MS-TX-002',
  },
  {
    id: 'prod-3',
    name: 'Matte Desk Lamp',
    category: 'Lighting',
    price: 85.0,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrKenzdkhMdKJgjG78K5rJFQfI28IbH5_2ieL9zFdlR90ycFggPX8IYz6G3dCeWxHUr7F40XPLyKkTJjcFXdAjNn5941q6SJmkrtmuvnCHso_zXFPD9S8Ocp6KU9jAQmdcfCtFYVgN28GP7udVxIvbQag4hrJWdn_yVm8qeLBmjIDa_62CJb6yw5XIrwLb66t6cgLPJFSZI-PbzNroQkWF055krtP44Cv8IN6jN7Nlpmf-0QynGwuD',
    altText:
      'A sleek, matte black minimalist desk lamp positioned on an expansive white desk surface.',
    description:
      'Sculptural cantilever work lamp coated in ultra-matte jet powder finish. Features touch-capacitive 3-level dimming with 2700K warm diffused LED module.',
    dimensions: '42cm H x 36cm Reach x 16cm Base Diameter',
    materials: 'Spun Aluminum, Weighted Steel Base, Braided Fabric Cord',
    inStock: true,
    stockCount: 12,
    sku: 'MS-LT-003',
  },
  {
    id: 'prod-7',
    name: 'Wabi-Sabi Matcha Bowl & Whisk',
    category: 'Kitchen & Dining',
    price: 42.0,
    image:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
    altText: 'Handmade ceramic matcha bowl with natural bamboo whisk on a minimal wooden tray.',
    description:
      'Artisanal handcrafted chawan matcha bowl crafted with coarse speckled clay and finished in raw charcoal glaze. Includes a 100-prong golden bamboo whisk (chasen).',
    dimensions: 'Bowl: 12cm Diameter x 7.5cm H | 350ml',
    materials: 'Speckled Japanese Stoneware, Natural Golden Bamboo',
    inStock: true,
    stockCount: 14,
    sku: 'MS-KD-007',
  },
  {
    id: 'prod-8',
    name: 'Cast Iron Teapot & Warmer',
    category: 'Kitchen & Dining',
    price: 68.0,
    image:
      'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
    altText: 'Minimal matte black cast iron Japanese tetsubin teapot with brass handle accents.',
    description:
      'Traditional heavy cast iron teapot with enameled interior to preserve pure tea notes. Provides exceptional heat retention for gongfu tea sessions.',
    dimensions: '800ml Capacity | 16cm H x 14cm Base',
    materials: 'Enameled Heavy Cast Iron, Solid Brass Pin Hinges',
    inStock: true,
    stockCount: 11,
    sku: 'MS-KD-008',
  },
  {
    id: 'prod-9',
    name: 'Brushed Brass Incense Burner',
    category: 'Accessories',
    price: 36.0,
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    altText: 'Solid brass circular minimalist incense burner with natural sandalwood sticks.',
    description:
      'Precision-milled solid brass disk with dual-gauge aperture to securely hold both Japanese coreless incense and traditional bamboo incense sticks.',
    dimensions: '9cm Diameter x 2cm Thickness | 380g',
    materials: '100% Solid Brushed Brass, Untreated Patina Finish',
    inStock: true,
    stockCount: 20,
    sku: 'MS-AC-009',
  },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'MinimalistShop',
  whatsappNumber: '01308513845',
  currencySymbol: '$',
  freeShippingThreshold: 100,
  shippingFee: 8.0,
  contactEmail: 'concierge@minimalistshop.com',
  studioAddress: '42 Zen Way, Atelier 4B, Dhaka & Global Delivery',
  businessHours: 'Open Everyday: 09:00 AM – 10:00 PM',
  welcomeMessage:
    'Hello MinimalistShop! I would like to place an order for the following items:',
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'MS-9821',
    customerName: 'Elena Vance',
    customerPhone: '+1 (555) 234-8901',
    customerAddress: '742 Evergreen Terrace, Apt 3B, Portland OR 97201',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[1], quantity: 2 },
    ],
    subtotal: 109.0,
    shipping: 0.0,
    total: 109.0,
    date: '2026-08-30',
    status: 'Sent via WhatsApp',
    notes: 'Please leave in concierge lobby if unavailable.',
  },
  {
    id: 'ord-102',
    orderNumber: 'MS-9822',
    customerName: 'Marcus Sterling',
    customerPhone: '+1 (555) 883-1920',
    customerAddress: '18 West 11th Street, New York NY 10011',
    items: [{ product: INITIAL_PRODUCTS[2], quantity: 1 }],
    subtotal: 85.0,
    shipping: 8.0,
    total: 93.0,
    date: '2026-08-31',
    status: 'Confirmed',
    notes: 'Inquired about matching desk cord organizer.',
  },
];

export const FAQ_LIST = [
  {
    question: 'How does ordering via WhatsApp work?',
    answer:
      'Simply browse our catalog and click "Buy via WhatsApp" or add items to your cart and click "Order via WhatsApp". A direct conversation will open on your WhatsApp with your order items pre-formatted. Our concierge will confirm availability, payment preferences, and delivery timing in seconds.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Once we connect via WhatsApp, you can finalize payment via Apple Pay, Google Pay, Credit/Debit card secure link, Bank Wire transfer, or Cash on Delivery (where applicable).',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'All in-stock orders are packed within 24 hours in eco-friendly protective packaging. Standard domestic shipping arrives in 2–4 business days. We provide real-time tracking numbers directly in our WhatsApp chat.',
  },
  {
    question: 'What is your return & exchange policy?',
    answer:
      'We offer 30-day hassle-free returns on all unopened or pristine condition home goods. Simply message us on WhatsApp with your order number to receive a prepaid return label.',
  },
];
