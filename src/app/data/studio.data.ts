export interface StudioMetric {
  value: string;
  label: string;
  context: string;
}

export interface ProcessPhase {
  step: string;
  title: string;
  duration: string;
  summary: string;
  deliverables: string[];
  leadDiscipline: string;
}

export interface ServiceOffering {
  index: string;
  title: string;
  scope: string;
  description: string;
  featured?: boolean;
  outcomes: string[];
}

export interface MaterialSwatch {
  id: string;
  name: string;
  origin: string;
  finish: string;
  patinaNote: string;
  idealPairing: string;
  swatchStyle: string;
}

export type PortfolioCategory = 'All' | 'Coastal Villas' | 'Urban Penthouses' | 'Hospitality';

export interface PortfolioProject {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, 'All'>;
  location: string;
  areaSqFt: string;
  year: string;
  duration: string;
  image: string;
  summary: string;
  architecturalBrief: string;
  materialsUsed: string[];
}

export interface ClientTestimonial {
  id: string;
  clientName: string;
  role: string;
  location: string;
  projectTitle: string;
  quote: string;
  outcome: string;
}

export const HERO_IMAGE = '/src/assets/images/hero_coastal_villa_1795508752590.jpg';

export const STUDIO_METRICS: StudioMetric[] = [
  {
    value: '14 yrs',
    label: 'Architectural Practice',
    context: 'Established 2012 across coastal and urban commissions',
  },
  {
    value: '68',
    label: 'Residences Completed',
    context: 'Turnkey private homes, penthouses, and retreats',
  },
  {
    value: '420k',
    label: 'Sq. Ft. Curated',
    context: 'Custom stone, millwork, and lighting architecture',
  },
  {
    value: '12',
    label: 'Design Honors',
    context: 'International interior architecture citations',
  },
];

export const DESIGN_PROCESS: ProcessPhase[] = [
  {
    step: '01',
    title: 'Spatial Discovery & Site Study',
    duration: 'Weeks 1–3',
    summary:
      'We analyze natural solar trajectory, sightlines, acoustic behavior, and structural envelope before drawing a single interior partition.',
    deliverables: [
      'Laser-measured architectural survey & daylight study',
      'Circulation zoning & furniture proportion masterplan',
      'Preliminary project schedule & transparent budget framework',
    ],
    leadDiscipline: 'Principal Interior Architect',
  },
  {
    step: '02',
    title: 'Material, Stone & Light Concept',
    duration: 'Weeks 4–8',
    summary:
      'Physical material boards combine quarried stone slabs, timber veneers, textiles, and warm 2700K architectural lighting simulations.',
    deliverables: [
      'Physical sample box shipped for tactile review',
      'Photorealistic daylight & twilight lighting renders',
      'Refined room-by-room elevation drawings',
    ],
    leadDiscipline: 'Material & Lighting Director',
  },
  {
    step: '03',
    title: 'Bespoke Millwork & Global Procurement',
    duration: 'Weeks 9–20',
    summary:
      'Our atelier drafts millwork shop drawings and coordinates directly with European stone quarries, joinery workshops, and artisans.',
    deliverables: [
      'CNC-verified custom joinery & stone fabrication packets',
      'Direct quarry slab selection & factory quality audits',
      'Consolidated climate-controlled logistics & warehousing',
    ],
    leadDiscipline: 'Technical Millwork & Procurement Lead',
  },
  {
    step: '04',
    title: 'White-Glove Installation & Styling',
    duration: 'Weeks 21–24',
    summary:
      'Every fixture is calibrated on site, lighting scenes are programmed to circadian rhythms, and art and textiles are layered for immediate living.',
    deliverables: [
      'On-site contractor coordination & punch-list sign-off',
      'Dusk lighting scene programming & acoustic tuning',
      'Complete care dossier for natural stone and timber finishes',
    ],
    leadDiscipline: 'Turnkey Commissioning Team',
  },
];

export const SERVICES: ServiceOffering[] = [
  {
    index: '01',
    title: 'Full-Home Architectural Interiors',
    scope: 'Ground-Up & Gut Renovations',
    featured: true,
    description:
      'Comprehensive interior architecture from structural space planning and ceiling cove geometry to bespoke stone bathrooms, kitchens, and private suites.',
    outcomes: [
      'Cohesive flow between indoor living volumes and coastal terraces',
      'Integrated concealed HVAC, motorized shading, and acoustic damping',
      'Single studio point of contact from concept through move-in day',
    ],
  },
  {
    index: '02',
    title: 'Custom Millwork & Stonework',
    scope: 'Bespoke Joinery & Monoliths',
    description:
      'Fluted walnut cabinetry, monolithic carved stone islands, concealed bar libraries, and architectural wall paneling engineered to millimeter tolerances.',
    outcomes: [
      'Custom hardware machined in unlacquered brass and bronze',
      'Book-matched marble and quartzite slab fabrication',
    ],
  },
  {
    index: '03',
    title: 'Turnkey Coastal Styling & Art',
    scope: 'Furniture, Textiles & Curation',
    description:
      'Sourcing heirloom furniture, hand-knotted wool carpets, Belgian linen drapery, and site-specific contemporary artworks tailored to marine climates.',
    outcomes: [
      'Salt-air resilient upholstery and marine-grade terrace textiles',
      'Commissioned sculptural lighting and ceramic vessels',
    ],
  },
  {
    index: '04',
    title: 'Architectural Lighting & Acoustics',
    scope: 'Atmospheric Engineering',
    description:
      'Layered indirect cove illumination, zero-glare recessed apertures, and subtle limewash/timber acoustic absorption for serene evening living.',
    outcomes: [
      'Scene-based Lutron & DALI lighting choreography',
      'Warm 2400K–2700K evening transitions without ceiling clutter',
    ],
  },
];

export const MATERIAL_SWATCHES: MaterialSwatch[] = [
  {
    id: 'travertine',
    name: 'Roman Honed Travertine',
    origin: 'Tivoli, Italy',
    finish: 'Unfilled Open-Pore Matte',
    patinaNote: 'Softens subtly around edges over decades without glossy reflection.',
    idealPairing: 'Fireplace monoliths, terrace thresholds, spa basins',
    swatchStyle: 'linear-gradient(135deg, #c9bca7 0%, #a99b84 48%, #8f806a 100%)',
  },
  {
    id: 'smoked-oak',
    name: 'Smoked European Oak',
    origin: 'Bavaria, Germany',
    finish: 'Wire-Brushed Natural Oil',
    patinaNote: 'Deepens in warmth under coastal daylight while masking fine wear.',
    idealPairing: 'Full-height wall paneling, fluted cabinetry, dining tables',
    swatchStyle: 'linear-gradient(135deg, #4b392c 0%, #34261c 52%, #221811 100%)',
  },
  {
    id: 'aged-brass',
    name: 'Unlacquered Aged Brass',
    origin: 'Antwerp, Belgium',
    finish: 'Hand-Burnished Satin',
    patinaNote: 'Develops an organic, living bronze tone at touchpoints.',
    idealPairing: 'Sculptural pendants, cabinet pulls, faucet trims',
    swatchStyle: 'linear-gradient(135deg, #c8a97e 0%, #9b7d53 55%, #6d5534 100%)',
  },
  {
    id: 'belgian-linen',
    name: 'Belgian Raw Bouclé & Linen',
    origin: 'Kortrijk, Belgium',
    finish: 'Heavyweight Unbleached Weave',
    patinaNote: 'Drapes fluidly and softens acoustic reverberation in glass volumes.',
    idealPairing: 'Deep modular sofas, sheer floor-to-ceiling drapery',
    swatchStyle: 'linear-gradient(135deg, #ded8cc 0%, #c6beb0 50%, #aea596 100%)',
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'big-sur-headland',
    title: 'Headland Cliff Residence',
    category: 'Coastal Villas',
    location: 'Big Sur, California',
    areaSqFt: '6,400 sq ft',
    year: '2025',
    duration: '11 months',
    image: '/src/assets/images/hero_coastal_villa_1795508752590.jpg',
    summary:
      'Cantilevered oceanfront pavilion anchored by dry-stacked travertine piers and warm smoked oak ceilings.',
    architecturalBrief:
      'Opened the main living volume toward the Pacific horizon with minimal-profile glazing while grounding the interior against coastal fog using recessed perimeter cove lighting and natural stone mass.',
    materialsUsed: ['Roman Honed Travertine', 'Smoked European Oak', 'Belgian Linen'],
  },
  {
    id: 'southbank-penthouse',
    title: 'Thames Horizon Penthouse',
    category: 'Urban Penthouses',
    location: 'London, United Kingdom',
    areaSqFt: '4,150 sq ft',
    year: '2025',
    duration: '8 months',
    image: '/src/assets/images/portfolio_penthouse_living_1795508753035.jpg',
    summary:
      'Evening-oriented sky salon featuring split-face limestone hearth, smoked oak paneling, and bespoke brass pendant.',
    architecturalBrief:
      'Designed around twilight entertaining above the skyline. Dark oiled timber absorbs urban glare from the floor-to-ceiling curtain wall while a monolithic stone hearth forms an intimate focal anchor.',
    materialsUsed: ['Charred Smoked Oak', 'Carved Limestone', 'Unlacquered Brass'],
  },
  {
    id: 'malibu-cove-kitchen',
    title: 'Point Dume Culinary House',
    category: 'Coastal Villas',
    location: 'Malibu, California',
    areaSqFt: '5,200 sq ft',
    year: '2024',
    duration: '9 months',
    image: '/src/assets/images/portfolio_coastal_kitchen_1795508753540.jpg',
    summary:
      'Monolithic Taj Mahal quartzite island paired with vertical fluted walnut millwork and sheer coastal drapery.',
    architecturalBrief:
      'Concealed commercial-grade culinary appliances behind continuous fluted walnut cabinetry so the kitchen transitions effortlessly into the ocean-view dining gallery.',
    materialsUsed: ['Taj Mahal Quartzite', 'Fluted American Walnut', 'Brushed Bronze'],
  },
  {
    id: 'cascais-sanctuary',
    title: 'Cascais Primary Sanctuary',
    category: 'Coastal Villas',
    location: 'Cascais, Portugal',
    areaSqFt: '3,800 sq ft',
    year: '2024',
    duration: '7 months',
    image: '/src/assets/images/portfolio_suite_sanctuary_1795508754044.jpg',
    summary:
      'Hand-troweled charcoal limewash bedroom suite with low platform oak joinery and solid travertine plinths.',
    architecturalBrief:
      'Created a restorative acoustic retreat using mineral limewash walls, slatted oak wardrobe doors for passive airflow, and unbleached woven textiles.',
    materialsUsed: ['Mineral Charcoal Limewash', 'European White Oak', 'Tivoli Travertine'],
  },
  {
    id: 'comporta-pavilion',
    title: 'Atlantic Courtyard Retreat',
    category: 'Hospitality',
    location: 'Comporta, Portugal',
    areaSqFt: '8,900 sq ft',
    year: '2025',
    duration: '14 months',
    image: '/src/assets/images/portfolio_pavilion_lounge_1795508756822.jpg',
    summary:
      'Private boutique estate pavilion uniting indoor hearth lounge and still reflecting pool beneath cedar eaves.',
    architecturalBrief:
      'Blended sheltered limestone hospitality suites with open-air coastal terraces, allowing pocket glass walls to disappear completely during summer evenings.',
    materialsUsed: ['Chiseled Limestone', 'Western Red Cedar', 'Marine Bouclé'],
  },
];

export const TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 'vance',
    clientName: 'Henrik & Claire Lindqvist',
    role: 'Homeowners, Headland Cliff Residence',
    location: 'Big Sur, California',
    projectTitle: '6,400 sq ft New-Build Coastal Villa',
    quote:
      'Before Coastal Interio joined, our architectural shell felt cavernous and cold against the ocean fog. Their material palette of honed travertine, smoked oak, and hidden cove lighting turned every room into an effortless sanctuary.',
    outcome: 'Delivered 2 weeks ahead of schedule with 100% custom millwork fitment on site.',
  },
  {
    id: 'ashford',
    clientName: 'Julian Ashford',
    role: 'Managing Partner, Thames Horizon Penthouse',
    location: 'London, United Kingdom',
    projectTitle: '4,150 sq ft Full Penthouse Conversion',
    quote:
      'Glare from three walls of glass used to make the apartment unusable after dusk. Coastal Interio re-engineered the lighting, paneled the salon in dark oak, and sculpted the limestone fireplace—now the room feels grounded day and night.',
    outcome: 'Cut interior acoustic reverberation by half and unified four fragmented rooms.',
  },
  {
    id: 'monteiro',
    clientName: 'Beatriz Monteiro',
    role: 'Founder, Atlantic Courtyard Retreat',
    location: 'Comporta, Portugal',
    projectTitle: '8,900 sq ft Private Hospitality Estate',
    quote:
      'Their team handled stone quarry selection, European joinery logistics, and final placement down to the last ceramic vessel. Guests consistently remark on the calm materiality before anything else.',
    outcome: 'Full 6-suite property commissioned turnkey with zero post-handover defects.',
  },
];
