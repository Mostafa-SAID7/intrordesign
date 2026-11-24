export interface RentalMetric {
  value: string;
  label: string;
  context: string;
}

export interface LeasingStep {
  step: string;
  title: string;
  timing: string;
  description: string;
  deliverable: string;
}

export interface RentalService {
  code: string;
  title: string;
  span: 'wide' | 'standard';
  summary: string;
  highlights: string[];
  tooltip: string;
}

export interface RentalStandard {
  term: string;
  definition: string;
}

export type PropertyCategory = 'Waterfront Villas' | 'Penthouse Lofts' | 'Modern Pavilions';

export interface RentalListing {
  id: string;
  title: string;
  category: PropertyCategory;
  neighborhood: string;
  monthlyRent: number;
  depositMonths: number;
  beds: number;
  baths: number;
  sqft: number;
  availability: 'Available Now' | 'Available Dec 15' | 'Pre-Leasing Jan';
  leaseTerms: ('6 Months' | '12 Months' | '24 Months')[];
  furnished: boolean;
  petFriendly: boolean;
  parkingSpaces: number;
  image: string;
  summary: string;
  highlights: string[];
  amenities: string[];
}

export interface ResidentReview {
  quote: string;
  author: string;
  role: string;
  residence: string;
  outcome: string;
}

export const HERO_RESIDENCE_IMAGE = '/src/assets/images/hero_coastal_villa_1795512014672.jpg';

export const RENTAL_METRICS: RentalMetric[] = [
  {
    value: '36',
    label: 'Verified Residences',
    context: 'Architect-designed villas, penthouses & private pavilions',
  },
  {
    value: '48 hrs',
    label: 'Lease Approval',
    context: 'Streamlined digital screening & transparent terms',
  },
  {
    value: '6–24 mo',
    label: 'Flexible Lease Windows',
    context: 'Seasonal coastal stays & multi-year corporate leases',
  },
  {
    value: '24/7',
    label: 'Resident Concierge',
    context: 'Dedicated engineering, fiber & move-in orchestration',
  },
];

export const LEASING_PROCESS: LeasingStep[] = [
  {
    step: '01',
    title: 'Curated Residence Match',
    timing: 'Day 1',
    description:
      'Filter verified waterfront villas, loft penthouses, and courtyard pavilions by lease length, sunlight orientation, and furnishing.',
    deliverable: 'Shortlisted floor plans & neighborhood dossier',
  },
  {
    step: '02',
    title: 'Private or Live Video Tour',
    timing: 'Days 2–3',
    description:
      'Walk each space in person at golden hour or join a high-definition architectural walkthrough with our leasing advisor.',
    deliverable: 'Interactive viewing notes & acoustic test',
  },
  {
    step: '03',
    title: 'Instant Digital Application',
    timing: '48 Hours',
    description:
      'Submit encrypted income verification and sign clear, plain-language lease agreements with zero hidden brokerage add-ons.',
    deliverable: 'Countersigned digital lease & deposit receipt',
  },
  {
    step: '04',
    title: 'Keyless Move-In & Concierge',
    timing: 'Move-In Day',
    description:
      'Arrive to pre-activated gigabit fiber, calibrated 2700K smart lighting scenes, climate presets, and optional bespoke furnishing.',
    deliverable: 'Biometric access & dedicated resident portal',
  },
];

export const RENTAL_SERVICES: RentalService[] = [
  {
    code: '01',
    title: 'Private & Live Virtual Showings',
    span: 'wide',
    summary:
      'Schedule discreet in-person walkthroughs or real-time twilight video tours tailored to relocation executives and international tenants.',
    highlights: [
      'Same-week private access across all active coastal listings',
      'Live room-by-room daylight & noise measurements on video',
      'Direct Q&A with dedicated property specialists',
    ],
    tooltip: 'Zero group open houses—every viewing is private by appointment.',
  },
  {
    code: '02',
    title: 'Turnkey Lease & Screening',
    span: 'standard',
    summary:
      'Transparent digital leases with clear deposit protections, rapid 48-hour underwriting, and flexible corporate billing.',
    highlights: [
      'Direct bank & corporate guarantor verification',
      'Standardized move-in inspection photo archive',
    ],
    tooltip: 'Security deposits are held in audited escrow with itemized checklists.',
  },
  {
    code: '03',
    title: 'White-Glove Move-In Concierge',
    span: 'standard',
    summary:
      'Utilities, symmetrical fiber internet, smart home automation, and bi-weekly stone & timber care activated before arrival.',
    highlights: [
      'Zero utility setup friction on arrival day',
      'Optional curated Belgian bouclé & oak furniture packages',
    ],
    tooltip: 'Furnished packages can be added or removed per lease term.',
  },
  {
    code: '04',
    title: 'Owner Asset & Tenant Advisory',
    span: 'wide',
    summary:
      'For architectural property owners: full-cycle resident vetting, preventative glass and travertine maintenance, and occupancy optimization.',
    highlights: [
      '98.4% annual on-time rent collection across managed estates',
      'Quarterly preventative engineering & smart glazing inspections',
      'Monthly owner statements with zero surprise maintenance markups',
    ],
    tooltip: 'We protect architectural finishes with vetted artisan maintenance crews.',
  },
];

export const RENTAL_STANDARDS: RentalStandard[] = [
  {
    term: 'Transparent Pricing',
    definition:
      'Every monthly rate displays base rent, refundable deposit terms, and included architectural maintenance upfront with zero surprise admin fees.',
  },
  {
    term: 'Flexible Lease Windows',
    definition:
      'Choose 6-month seasonal stays, standard 12-month residencies, or discounted 24-month commitments with priority renewal rights.',
  },
  {
    term: 'Architectural Stewardship',
    definition:
      'All smoked-glass partitions, honed travertine slabs, and indirect cove systems undergo certified quarterly upkeep included in tenancy.',
  },
  {
    term: 'Turnkey Connectivity',
    definition:
      'Dual-WAN symmetrical fiber internet, Lutron twilight dimming scenes, and keyless mobile access arrive active from hour one.',
  },
  {
    term: 'Escrow Protection',
    definition:
      'Security deposits sit in segregated resident escrow accounts with timestamped high-resolution move-in documentation.',
  },
];

export const RENTAL_LISTINGS: RentalListing[] = [
  {
    id: 'big-sur-headland-villa',
    title: 'Big Sur Headland Glass Villa',
    category: 'Waterfront Villas',
    neighborhood: 'Big Sur Coast, CA',
    monthlyRent: 14500,
    depositMonths: 1.5,
    beds: 4,
    baths: 4.5,
    sqft: 4400,
    availability: 'Available Now',
    leaseTerms: ['6 Months', '12 Months', '24 Months'],
    furnished: true,
    petFriendly: true,
    parkingSpaces: 3,
    image: '/src/assets/images/hero_coastal_villa_1795512014672.jpg',
    summary:
      'Oceanfront modernist residence featuring monolithic dark travertine walls, acoustic fluted smoked-glass dividers, and heated coastal plunge terrace.',
    highlights: ['Direct Pacific horizon glazing', '2700K cove dimming', 'Private EV garage'],
    amenities: ['Infinity Pool', '2 Gbps Fiber', 'Radiant Stone Floors', 'Wine Vault'],
  },
  {
    id: 'harbor-skyline-penthouse',
    title: 'Harbor Skyline Smoked-Glass Loft',
    category: 'Penthouse Lofts',
    neighborhood: 'Marina District, SF',
    monthlyRent: 11200,
    depositMonths: 1,
    beds: 3,
    baths: 3,
    sqft: 3150,
    availability: 'Available Now',
    leaseTerms: ['12 Months', '24 Months'],
    furnished: true,
    petFriendly: false,
    parkingSpaces: 2,
    image: '/src/assets/images/rental_penthouse_loft_1795512311466.jpg',
    summary:
      'Corner penthouse with floor-to-ceiling blackened steel mullions, sweeping marina twilight views, travertine center island, and private elevator foyer.',
    highlights: ['270° Harbor panorama', 'Direct elevator entry', 'Acoustic triple glazing'],
    amenities: ['Concierge Desk', 'Private Terrace', 'EV Chargers', 'Chef Kitchen'],
  },
  {
    id: 'horizon-terrace-estate',
    title: 'Cliffside Retractable Glass Residence',
    category: 'Waterfront Villas',
    neighborhood: 'Laguna Headlands, CA',
    monthlyRent: 16800,
    depositMonths: 2,
    beds: 4,
    baths: 5,
    sqft: 4950,
    availability: 'Available Dec 15',
    leaseTerms: ['6 Months', '12 Months', '24 Months'],
    furnished: true,
    petFriendly: true,
    parkingSpaces: 3,
    image: '/src/assets/images/rental_waterfront_terrace_1795512313190.jpg',
    summary:
      'Seamless indoor-outdoor cliffside pavilion where 16-foot retractable smoked-glass walls open onto a saltwater infinity pool overlooking open water.',
    highlights: ['Motorized glass walls', 'Timber soffit terrace', 'Outdoor travertine bar'],
    amenities: ['Saltwater Infinity Pool', 'Guest Casita', 'Smart Climate', 'Solar + Battery'],
  },
  {
    id: 'obsidian-courtyard-pavilion',
    title: 'Obsidian Moss Courtyard Pavilion',
    category: 'Modern Pavilions',
    neighborhood: 'Carmel Highlands, CA',
    monthlyRent: 9600,
    depositMonths: 1,
    beds: 3,
    baths: 2.5,
    sqft: 2850,
    availability: 'Available Now',
    leaseTerms: ['6 Months', '12 Months', '24 Months'],
    furnished: false,
    petFriendly: true,
    parkingSpaces: 2,
    image: '/src/assets/images/portfolio_obsidian_pavilion_1795512014529.jpg',
    summary:
      'Single-level serene pavilion lined in fumed European oak millwork, translucent fluted glass screens, and private Japanese maple courtyard.',
    highlights: ['Zero-step floor plan', 'Japanese moss atrium', 'Acoustic oak ceiling'],
    amenities: ['Private Garden', 'Heated Basalt Tile', '2-Car Garage', 'Studio Office'],
  },
  {
    id: 'travertine-garden-residence',
    title: 'Silver Travertine Atrium House',
    category: 'Modern Pavilions',
    neighborhood: 'Montecito, CA',
    monthlyRent: 12400,
    depositMonths: 1.5,
    beds: 3,
    baths: 3.5,
    sqft: 3600,
    availability: 'Pre-Leasing Jan',
    leaseTerms: ['12 Months', '24 Months'],
    furnished: false,
    petFriendly: true,
    parkingSpaces: 2,
    image: '/src/assets/images/portfolio_travertine_courtyard_1795512014819.jpg',
    summary:
      'Sunlit culinary atrium anchored by a 14-foot vein-cut silver travertine island, blackened bronze vitrine cabinetry, and olive tree courtyard.',
    highlights: ['Skylit conservatory', 'Patinated bronze millwork', 'Olive courtyard'],
    amenities: ['Sub-Zero Culinary Suite', 'EV Ready', 'Gated Entry', 'Garden Upkeep'],
  },
  {
    id: 'la-jolla-gallery-loft',
    title: 'Sunken Basalt Gallery Residence',
    category: 'Penthouse Lofts',
    neighborhood: 'La Jolla Cove, CA',
    monthlyRent: 10800,
    depositMonths: 1,
    beds: 2,
    baths: 2.5,
    sqft: 3050,
    availability: 'Available Now',
    leaseTerms: ['6 Months', '12 Months'],
    furnished: true,
    petFriendly: false,
    parkingSpaces: 2,
    image: '/src/assets/images/portfolio_gallery_atrium_1795512015466.jpg',
    summary:
      'Double-height architectural residence with floating limestone treads, smoked tempered glass balustrades, and museum-grade UV-filtered lighting.',
    highlights: ['22-ft gallery atrium', 'Museum lighting track', 'Basalt stone treads'],
    amenities: ['UV Daylight Glazing', 'Private Vault Storage', 'Concierge', 'Fiber Dual-WAN'],
  },
];

export const RESIDENT_REVIEWS: ResidentReview[] = [
  {
    quote:
      'Moving from Zurich, we toured the Big Sur Glass Villa live via video and walked into a fully lit, fiber-connected home 72 hours later with zero utility headaches.',
    author: 'Elena & Marcus Lindqvist',
    role: '12-Month Corporate Residents',
    residence: 'Big Sur Headland Glass Villa',
    outcome: 'Renewed for 24-month residency',
  },
  {
    quote:
      'Every lease line item—deposit escrow, stone maintenance, EV bay—was crystal clear before signing. Easily the smoothest architectural lease I have experienced.',
    author: 'Henrik Solberg',
    role: 'Managing Partner',
    residence: 'Harbor Skyline Smoked-Glass Loft',
    outcome: 'Approved in 36 hours',
  },
  {
    quote:
      'As an owner of a travertine courtyard house, their vetted tenant matching and quarterly glazing inspections keep my property pristine and 100% leased.',
    author: 'Claire Sato',
    role: 'Estate Owner & Architect',
    residence: 'Silver Travertine Atrium House',
    outcome: 'Zero vacancy across 3 consecutive leases',
  },
];
