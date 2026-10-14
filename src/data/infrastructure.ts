import type { ImageId } from './images';

export type Service = {
  slug: string;
  name: string;
  short: string;
  image: ImageId;
  icon: string;
  title: string;
  lead: string;
  supply: { t: string; d: string }[];
  specs: [string, string][]; // SAMPLE ranges (checklist E5)
  scope: string[];
  related: string[]; // product family slugs
};

export const services: Service[] = [
  {
    slug: 'street-highway-lighting',
    name: 'Street & highway lighting',
    short: 'LED, solar and smart street lighting for roads of every size.',
    image: 'inf02',
    icon: 'street-light',
    title: 'Street and highway lighting, from survey to switch-on.',
    lead: 'Conventional LED, solar and smart street lighting for highways, main roads, colonies and campuses, supplied, installed and maintained.',
    supply: [
      { t: 'LED street lights', d: 'Efficient luminaires for main roads, colony roads and lanes.' },
      { t: 'Solar street lights', d: 'Self-powered lights where grid supply is unreliable or far away.' },
      { t: 'Smart lighting', d: 'Remote monitoring and scheduling through control panels.' },
      { t: 'Poles & control panels', d: 'Poles, brackets, feeder pillars and timers to complete the circuit.' },
    ],
    specs: [['LED luminaires', '30–200 W'], ['Solar street lights', '20–40 W all-in-one'], ['Protection', 'IP65–IP66'], ['Control', 'Astronomical timer or remote (smart)']],
    scope: ['Survey and lighting design', 'Pole and fixture supply', 'Installation and cabling', 'Testing and handover', 'Annual maintenance contract'],
    related: ['led-street-light', 'solar-street-light-all-in-one', 'street-light-control-panel'],
  },
  {
    slug: 'public-decorative-lighting',
    name: 'Public, decorative & utility lighting',
    short: 'Parks, promenades, civic buildings and open grounds.',
    image: 'inf03',
    icon: 'lamp',
    title: 'Lighting that makes public spaces feel safe and proud.',
    lead: 'Decorative post-top lanterns, facade and flood lighting, and utility lighting for parks, ghats, promenades, markets and civic buildings.',
    supply: [
      { t: 'Decorative lanterns', d: 'Post-top and heritage-style fittings for walkways and parks.' },
      { t: 'Flood & facade lighting', d: 'For civic buildings, monuments, grounds and signage.' },
      { t: 'High-mast & area lighting', d: 'For junctions, markets, parking and open grounds.' },
      { t: 'Utility lighting', d: 'Robust fittings for yards, depots and service areas.' },
    ],
    specs: [['Flood lights', '50–200 W'], ['Protection', 'IP65'], ['Light colour', '3000–5700 K']],
    scope: ['Site visit and lighting plan', 'Supply of fittings and poles', 'Installation and wiring', 'Maintenance on request'],
    related: ['led-flood-light', 'led-street-light'],
  },
  {
    slug: 'traffic-signals',
    name: 'Traffic & electrical signals',
    short: 'Signals and road-safety electricals at junctions.',
    image: 'inf04',
    icon: 'traffic',
    title: 'Traffic and electrical signals for safer junctions.',
    lead: 'LED traffic signal heads, countdown timers, blinkers and the controllers and cabling behind them, for municipal and highway junctions.',
    supply: [
      { t: 'LED signal heads', d: 'Red, amber and green aspects with long life and low power.' },
      { t: 'Countdown timers', d: 'So drivers and pedestrians know how long to wait.' },
      { t: 'Blinkers & warning lights', d: 'For crossings, schools and hazards.' },
      { t: 'Controllers & cabling', d: 'Signal controllers, poles, cantilevers and underground cabling.' },
    ],
    specs: [['Signal aspects', '200 / 300 mm LED'], ['Supply', 'Mains or solar'], ['Controller', 'Fixed-time or adaptive']],
    scope: ['Junction survey', 'Supply and erection', 'Cabling and commissioning', 'Maintenance contract'],
    related: ['street-light-control-panel'],
  },
  {
    slug: 'rural-smart-city',
    name: 'Rural electrification & smart city',
    short: 'Villages, towns and campuses, power and light that reach everyone.',
    image: 'inf05',
    icon: 'village',
    title: 'Power and light that reach every lane.',
    lead: 'Electrification and lighting works for villages, towns and smart-city projects, from poles and aerial cabling to solar street lights and monitoring.',
    supply: [
      { t: 'Village electrification', d: 'Poles, aerial bundled cables, service connections and lighting.' },
      { t: 'Solar street lighting', d: 'For lanes and roads far from reliable grid supply.' },
      { t: 'Smart-city lighting', d: 'Centrally monitored lighting with scheduling and fault alerts.' },
      { t: 'Solar pumps & plants', d: 'Solar for water supply and community buildings.' },
    ],
    specs: [['Lighting', 'LED and solar, 20–90 W'], ['Cabling', 'Aerial bundled cable (ABC)'], ['Monitoring', 'Optional, remote']],
    scope: ['Survey and estimate', 'Material supply', 'Erection and connections', 'Testing and handover', 'Maintenance'],
    related: ['solar-street-light-all-in-one', 'led-street-light', 'street-light-control-panel'],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
