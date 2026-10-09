// Shared site data. Service categories and their accent colours come from the design
// (header mega-menu + the service-page template's `cats` map).

export type CategoryName = 'AI & Search Visibility' | 'Paid Ad Management' | 'Web Services';

export const categories: Record<CategoryName, { num: string; accent: string; onDark: string; short: string }> = {
  'AI & Search Visibility': { num: '01', accent: 'var(--rz-gold)', onDark: 'var(--rz-gold)', short: 'AI & Search' },
  'Paid Ad Management': { num: '02', accent: 'var(--rz-purple)', onDark: 'var(--rz-purple-light)', short: 'Paid Ads' },
  'Web Services': { num: '03', accent: 'var(--rz-slate)', onDark: 'var(--rz-slate)', short: 'Web' },
};

export const services = [
  {
    num: '01', name: 'AI & Search Visibility', accent: 'var(--rz-gold)', href: '/services/local-seo/',
    items: [
      { name: 'Local SEO', href: '/services/local-seo/' },
      { name: 'SEO', href: '/services/local-seo/' },
      { name: 'AI Visibility', href: '/services/local-seo/' },
      { name: 'Backlinking', href: '/services/local-seo/' },
    ],
  },
  {
    num: '02', name: 'Paid Ad Management', accent: 'var(--rz-purple)', href: '/services/google-ads/',
    items: [
      { name: 'Google Ads', href: '/services/google-ads/' },
      { name: 'Meta Ads', href: '/services/google-ads/' },
      { name: 'Local Services Ads', href: '/services/google-ads/' },
    ],
  },
  {
    num: '03', name: 'Web Services', accent: 'var(--rz-slate)', href: '/services/web-development/',
    items: [
      { name: 'Web Development', href: '/services/web-development/' },
      { name: 'Web Hosting & Maintenance', href: '/services/web-development/' },
    ],
  },
];

export const industries = ['Plumbing', 'HVAC', 'Electrical', 'Septic', 'Painting', 'Landscaping', 'Restoration'];

/** Base-aware internal URL (works on a GitHub Pages project subpath or a custom domain). */
export const u = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + p;

/** Post authors — `slot` is the ImageSlot id of their portrait (public/images/<slot>.jpg). */
export const authors: Record<string, { role: string; bio: string; slot: string }> = {
  'Kyle Sabraw': { role: 'Co-Founder', bio: 'Building websites and studying search since 1997, for everyone from local shops to Silicon Valley tech companies. What he loves is what more calls make possible: another hire, an easier payroll, more time at home.', slot: 'raiz-founder-2' },
  'Ryan Maizis': { role: 'Co-Founder', bio: 'Owns the ad accounts and the measurement behind them.', slot: 'raiz-founder-1' },
};

/** One-page navigation: each entry scrolls to the home section tagged data-section="<id>". */
export const sections = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'results', label: 'Results' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
];

/** Web3Forms access key (public by design — it only allows sending to the inbox it was created for). */
export const WEB3FORMS_KEY = '63c98486-8310-49f9-9c41-106750996f7c';
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
