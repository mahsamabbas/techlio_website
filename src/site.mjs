// Single source of truth for brand facts.
// Contact details, addresses and social URLs are copied verbatim from https://techlio.co (extracted 2026-11-24).
// Do not edit these without confirming against the company's published details.
export const site = {
  name: 'Techlio',
  domain: 'techlio.co',
  url: 'https://techlio.co',
  email: 'contact@techlio.co',
  phone: '+1-240-3957308',
  phoneHref: '+12403957308',
  offices: [
    { country: 'USA', address: '310 Wyndale Dr, The Colony, Dallas, Texas 75056' },
    { country: 'Pakistan', address: 'Office no 1108, 11th floor, HighQ Tower, Jail Rd, Gulberg V, Lahore' },
  ],
  social: {
    linkedin: 'https://www.linkedin.com/company/techlio-private-limited/',
    x: 'https://x.com/techlio',
  },
  legal: {
    terms: 'https://techlio.co/terms-of-use/',
    privacy: 'https://techlio.co/privacy-policy/',
    careers: 'https://techlio.co/career/',
  },
  // Proof. "$700K+" and "Top Rated Plus" supplied by Techlio leadership; the rest is published on techlio.co.
  badge: 'Upwork Top Rated Plus',
  heroProof: ['$700K+ verified client delivery', '95% client retention', '70+ clients served'],
  stats: [
    { value: '$700K+', label: 'Verified client delivery' },
    { value: '70+', label: 'Clients served' },
    { value: '95%', label: 'Client retention' },
    { value: '14', label: 'Industries shipped in' },
  ],
  regions: 'US, UK, UAE and Europe',
  platforms: ['AWS', 'Microsoft Azure', 'Google Cloud', 'LLM integration', 'Generative AI', 'Computer vision', 'Cloud-native systems', 'Custom applications'],
  // Add real, attributable client reviews here: { quote, name, role, company, source }.
  // The reviews block on the home and contact pages renders them automatically. Never add invented reviews.
  reviews: [],
  // Set to a form backend URL (accepts JSON POST) to submit scoping requests directly.
  // When empty, the form drafts an email to site.email in the visitor's mail app.
  formEndpoint: '',
  services: [
    { href: 'ai-workflow-automation.html', label: 'AI Workflow Automation', short: 'Workflow automation' },
    { href: 'ai-consulting.html', label: 'AI Advisory & Architecture', short: 'Advisory and architecture' },
    { href: 'product-development.html', label: 'SaaS & Product Engineering', short: 'Product engineering' },
    { href: 'ai-agents.html', label: 'AI Agents & Knowledge Systems', short: 'Agents and knowledge' },
  ],
  offers: [
    { href: 'ai-architecture-sprint.html', label: '14-Day AI & Architecture Sprint' },
    { href: 'legacy-modernization.html', label: 'Legacy-to-AI Modernization' },
  ],
  nav: [
    { href: 'process.html', label: 'Process' },
    { href: 'case-studies.html', label: 'Case Studies' },
    { href: 'about.html', label: 'About' },
    { href: 'contact.html', label: 'Contact' },
  ],
  cta: { href: 'contact.html#book', label: 'Book a technical scoping call' },
};

// Case studies. Every fact below is published on techlio.co/customer and the project pages; nothing is added.
export const cases = [
  {
    id: 'fundmydeductible', name: 'FundMyDeductible', industry: 'Financial services',
    headline: 'A deductible funding platform that helps contractors close twice as many deals',
    summary: 'An insurance deductible funding platform with automated payments and real-time tracking.',
    metric: { value: '2x', label: 'more deals closed for contractors' },
    duration: '6 months', team: '8 people',
    services: ['Product engineering', 'Payments automation'],
    capabilities: ['Automated payment flows', 'Real-time funding and payment tracking', 'Contractor-facing deal workflow'],
  },
  {
    id: 'convert', name: 'Convert', industry: 'E-commerce',
    headline: 'An enterprise A/B testing platform with more than 90 integrations',
    summary: 'Flicker-free experimentation for agencies and e-commerce teams, with full-stack testing.',
    metric: { value: '90+', label: 'integrations supported' },
    duration: '12 months', team: '7 people',
    services: ['SaaS engineering', 'Integrations'],
    capabilities: ['Flicker-free experiment delivery', 'Full-stack experimentation', 'Integration layer for 90+ tools'],
  },
  {
    id: 'vofspace', name: 'Vofspace', industry: 'Wellness',
    headline: 'One virtual office for meetings, scheduling, payments and messaging',
    summary: 'A virtual office platform for professionals, educators and coaches.',
    metric: { value: '4 in 1', label: 'meetings, scheduling, payments, communications' },
    duration: '8 months', team: '5 people',
    services: ['Product engineering', 'UI/UX design'],
    capabilities: ['Meetings and scheduling', 'Integrated payments', 'Client communications in one place'],
  },
  {
    id: 'spin-lab', name: 'Spin Lab', industry: 'Logistics',
    headline: 'Design-and-order software for custom joint covers',
    summary: 'A platform for designing and ordering custom joint covers, pairing medical precision with approachable tools.',
    metric: { value: '12 mo', label: 'build with a team of 8' },
    duration: '12 months', team: '8 people',
    services: ['Custom development', 'UI/UX design'],
    capabilities: ['Guided product designer', 'Order workflow', 'Precision specifications captured digitally'],
  },
];

export const industries = ['Health care', 'Corporate sector', 'Software and IT', 'Food and beverage', 'Financial services', 'Wellness and coaching', 'SaaS and IT service providers', 'Retail and consumer goods', 'Transportation', 'Ag tech', 'E-commerce', 'Media and entertainment', 'Fintech', 'Logistics'];
