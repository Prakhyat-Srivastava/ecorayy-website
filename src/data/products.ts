import type { ImageId } from './images';
import { u } from '../lib/url';

/**
 * SAMPLE CATALOGUE, every family here is `sample: true`.
 * Values follow common Indian industry norms but are NOT Ecorayy
 * specifications (checklist C1–C17). Structure mirrors the future CMS:
 *   Category → (Subcategory) → Product family → Variant (SKU)
 * Filters, card specs, tables and search are all generated from this data,
 * so adding a product later means adding data, not designing a page.
 */

export type Attr = {
  key: string;
  label: string;
  help?: string;
  promoted?: boolean;
  numeric?: boolean;
  swatch?: boolean; // colour-temperature swatches
};
export type Unit = { one: string; many: string; note?: string };
export type SpecGroup = { title: 'Electrical' | 'Physical' | 'Compliance' | 'Packaging' | 'Performance'; rows: [string, string][] };
export type Variant = { sku: string; label: string; v: Record<string, string> };
export type Family = {
  slug: string;
  category: string;
  sub?: string;
  name: string;
  series: string;
  benefit: string;
  image: ImageId;
  gallery?: ImageId[];
  litImage?: ImageId; // on/off toggle (lighting)
  axes: { key: string; label: string }[]; // variant chips, in order
  variants: Variant[];
  keySpecs: { key: string; label: string }[]; // large figures on product page
  cardSpecs: { key: string; label: string }[]; // 4 on cards
  specs: (v: Variant) => SpecGroup[];
  where: string[];
  worksWith: string[];
  faqs: { q: string; a: string }[];
  unit: Unit;
  isNew?: boolean;
  sample: true;
};
export type Sub = { slug: string; name: string; short: string; description: string; image: ImageId; attrs: Attr[] };
export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: ImageId;
  icon: string;
  attrs: Attr[];
  tableView?: boolean;
  subs?: Sub[];
};

// ------------------------------------------------------------ helpers
const combos = (axes: Record<string, string[]>): Record<string, string>[] =>
  Object.entries(axes).reduce<Record<string, string>[]>(
    (acc, [k, vals]) => acc.flatMap((a) => vals.map((val) => ({ ...a, [k]: val }))),
    [{}],
  );
const n = (s: string) => parseFloat(s);
const CCT: Record<string, string> = { '2700 K': 'Warm white', '3000 K': 'Warm white', '4000 K': 'Natural white', '5700 K': 'Cool daylight', '6500 K': 'Cool daylight' };
const certPending: [string, string] = ['Certification', 'Listed here once licence details are confirmed'];
const pcs: Unit = { one: 'piece', many: 'pieces' };

// Filter help: one plain sentence each (Baymard: 62% of sites don't explain filters).
const H = {
  wattage: 'How much power the light uses. Higher wattage usually means more light (lumens).',
  cct: 'Colour of the light. 2700 K is warm and cosy, 4000 K is natural, 6500 K is cool daylight.',
  lumens: 'How much light it gives out. A typical bedroom needs about 800–1,500 lumens.',
  base: 'B22 is the push-and-twist bayonet base used in most Indian homes. E27 screws in.',
  ip: 'Protection against dust and water. IP65/66 is suitable for outdoor use in rain.',
  size: 'Cross-section of the copper conductor in square millimetres. Bigger carries more current: 1.5 sq mm for lights and fans, 2.5 sq mm for sockets, 4 sq mm for AC points.',
  insulation: 'FR: Flame Retardant. FRLS: Flame Retardant, Low Smoke. It gives off less smoke if it burns, so it’s preferred in apartments, hospitals and offices.',
  current: 'The current the breaker is rated to carry continuously, in amperes (A).',
  poles: 'SP: single pole. DP: double pole. TP: three pole. TPN: three pole plus neutral, for three-phase supply.',
  curve: 'B curve trips quickly, for lighting and sockets. C curve allows short start-up surges, for motors, pumps and ACs.',
  breaking: 'The largest fault current the breaker can safely interrupt, in kiloamperes (kA).',
  sensitivity: 'How small a leakage current trips the RCCB. 30 mA protects people from electric shock; 100 mA protects against fire risk.',
  dcr: 'DCR (Domestic Content Requirement) modules use Indian-made cells. Government subsidy schemes such as PM Surya Ghar require DCR modules.',
  system: 'On-grid systems feed your home and the grid. Hybrid systems also charge a battery for power cuts.',
  rating: 'Maximum current the switch or socket is designed for. 6 A for lights and fans, 16 A for heavy appliances.',
  capacity: 'Wp is the panel’s peak output, kW the inverter’s output, kWh the energy a battery stores.',
};

// --------------------------------------------------------------- categories
export const categories: Category[] = [
  {
    slug: 'solar-equipment',
    name: 'Solar equipment',
    short: 'Modules, inverters and batteries for rooftop and ground-mount systems.',
    description: 'The building blocks of a solar system: panels that generate, inverters that convert, and batteries that store power for later.',
    image: 'prd01',
    icon: 'solar-panel',
    attrs: [
      { key: 'product', label: 'Product', promoted: true },
      { key: 'capacity', label: 'Capacity', promoted: true, numeric: true, help: H.capacity },
      { key: 'system', label: 'System type', promoted: true, help: H.system },
      { key: 'technology', label: 'Technology' },
      { key: 'dcr', label: 'DCR / non-DCR', help: H.dcr },
      { key: 'phase', label: 'Phase' },
    ],
  },
  {
    slug: 'lighting',
    name: 'Lighting',
    short: 'LED bulbs, battens, street lights and flood lights.',
    description: 'Efficient LED lighting for homes, offices, roads and open spaces, with the light colour printed on every option, so you know what you’re choosing.',
    image: 'prd02',
    icon: 'bulb',
    attrs: [
      { key: 'type', label: 'Type', promoted: true },
      { key: 'wattage', label: 'Wattage', promoted: true, numeric: true, help: H.wattage },
      { key: 'cct', label: 'Light colour', promoted: true, swatch: true, help: H.cct },
      { key: 'ip', label: 'IP rating', help: H.ip },
      { key: 'lumens', label: 'Lumens', numeric: true, help: H.lumens },
    ],
    subs: [
      {
        slug: 'led-bulbs', name: 'LED bulbs', short: 'Everyday bulbs for every room.', image: 'pf04',
        description: 'Bright, efficient LED bulbs with the standard B22 base used in most Indian homes.',
        attrs: [
          { key: 'wattage', label: 'Wattage', promoted: true, numeric: true, help: H.wattage },
          { key: 'base', label: 'Base', promoted: true, help: H.base },
          { key: 'cct', label: 'Light colour', promoted: true, swatch: true, help: H.cct },
          { key: 'lumens', label: 'Lumens', numeric: true, help: H.lumens },
          { key: 'shape', label: 'Shape' },
        ],
      },
      {
        slug: 'tube-lights-battens', name: 'Tube lights & battens', short: 'Slim, even light for rooms and corridors.', image: 'pf05',
        description: 'Integrated LED battens that replace old tube lights, with even, flicker-free light.',
        attrs: [
          { key: 'length', label: 'Length', promoted: true },
          { key: 'wattage', label: 'Wattage', promoted: true, numeric: true, help: H.wattage },
          { key: 'cct', label: 'Light colour', promoted: true, swatch: true, help: H.cct },
          { key: 'mounting', label: 'Mounting' },
        ],
      },
      {
        slug: 'street-lights', name: 'Street lights', short: 'LED and solar street lights for roads and lanes.', image: 'pf06',
        description: 'Grid-connected LED street lights and self-powered solar street lights for roads, lanes and campuses.',
        attrs: [
          { key: 'wattage', label: 'Wattage', promoted: true, numeric: true, help: H.wattage },
          { key: 'type', label: 'Type', promoted: true },
          { key: 'mounting', label: 'Mounting', promoted: true },
          { key: 'lumens', label: 'Lumens', numeric: true, help: H.lumens },
          { key: 'cct', label: 'Light colour', swatch: true, help: H.cct },
          { key: 'ip', label: 'IP rating', help: H.ip },
        ],
      },
      {
        slug: 'flood-lights', name: 'Flood lights', short: 'Wide, powerful light for open areas.', image: 'pf08',
        description: 'Weatherproof LED flood lights for facades, yards, grounds and signage.',
        attrs: [
          { key: 'wattage', label: 'Wattage', promoted: true, numeric: true, help: H.wattage },
          { key: 'cct', label: 'Light colour', promoted: true, swatch: true, help: H.cct },
          { key: 'ip', label: 'IP rating', promoted: true, help: H.ip },
          { key: 'lumens', label: 'Lumens', numeric: true, help: H.lumens },
        ],
      },
    ],
  },
  {
    slug: 'switches-sockets',
    name: 'Switches & sockets',
    short: 'Modular switches and sockets for homes and offices.',
    description: 'Modular switches and sockets with Indian three-pin layouts, made to fit standard modular plates and boxes.',
    image: 'prd03',
    icon: 'switch',
    attrs: [
      { key: 'series', label: 'Range', promoted: true },
      { key: 'type', label: 'Type', promoted: true },
      { key: 'rating', label: 'Rating', promoted: true, numeric: true, help: H.rating },
      { key: 'modules', label: 'Module size' },
      { key: 'finish', label: 'Finish' },
    ],
  },
  {
    slug: 'wires-cables',
    name: 'Wires & cables',
    short: 'House wires and solar DC cable in every common size.',
    description: 'Flexible copper house wires and solar DC cable. Every size explained in plain words, so you can choose the right one for each circuit.',
    image: 'prd04',
    icon: 'cable',
    tableView: true,
    attrs: [
      { key: 'size', label: 'Size', promoted: true, numeric: true, help: H.size },
      { key: 'insulation', label: 'Insulation', promoted: true, help: H.insulation },
      { key: 'length', label: 'Coil length', promoted: true, numeric: true },
      { key: 'colour', label: 'Colour' },
      { key: 'cores', label: 'Cores' },
      { key: 'voltage', label: 'Voltage grade' },
      { key: 'class', label: 'Conductor class' },
    ],
  },
  {
    slug: 'switchgear-panels',
    name: 'Switchgear & panels',
    short: 'MCBs, RCCBs, isolators, distribution boards and control panels.',
    description: 'Protection and distribution for every circuit, from a single MCB to an outdoor street-light control panel.',
    image: 'prd05',
    icon: 'breaker',
    tableView: true,
    attrs: [
      { key: 'product', label: 'Product', promoted: true },
      { key: 'current', label: 'Current rating', promoted: true, numeric: true, help: H.current },
      { key: 'poles', label: 'Poles', promoted: true, help: H.poles },
      { key: 'curve', label: 'Tripping curve', help: H.curve },
      { key: 'breaking', label: 'Breaking capacity', help: H.breaking },
      { key: 'sensitivity', label: 'Sensitivity (RCCB)', help: H.sensitivity },
      { key: 'ways', label: 'Ways (DB)' },
    ],
  },
];

// ---------------------------------------------------------------- families
const families: Family[] = [];
const add = (f: Family) => families.push(f);

// ---- Solar equipment -------------------------------------------------------
add({
  slug: 'solar-module-bifacial', category: 'solar-equipment', sample: true,
  name: 'Mono PERC bifacial solar module', series: 'Solar modules',
  benefit: 'Half-cut, dual-glass module that also captures light reflected onto its rear side.',
  image: 'pf01', unit: pcs,
  axes: [{ key: 'capacity', label: 'Power' }, { key: 'dcr', label: 'Cells' }],
  variants: combos({ capacity: ['540 Wp', '545 Wp', '550 Wp'], dcr: ['DCR', 'Non-DCR'] }).map((c) => ({
    sku: `EC-SM-BF-${n(c.capacity)}-${c.dcr === 'DCR' ? 'D' : 'N'}`,
    label: `${c.capacity} · ${c.dcr}`,
    v: { ...c, product: 'Module', technology: 'Mono PERC bifacial', efficiency: `${(20.9 + (n(c.capacity) - 540) * 0.039).toFixed(1)}%`, cells: '144 half-cut' },
  })),
  keySpecs: [{ key: 'capacity', label: 'Peak power' }, { key: 'efficiency', label: 'Module efficiency' }, { key: 'cells', label: 'Cells' }, { key: 'dcr', label: 'Cell origin' }],
  cardSpecs: [{ key: 'capacity', label: 'Power' }, { key: 'technology', label: 'Technology' }, { key: 'dcr', label: 'Cells' }, { key: 'efficiency', label: 'Efficiency' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Peak power (Pmax)', v.v.capacity], ['Module efficiency', v.v.efficiency], ['Maximum system voltage', '1500 V DC'], ['Power tolerance', '0 to +5 W']] },
    { title: 'Physical', rows: [['Cells', '144 half-cut, monocrystalline PERC'], ['Dimensions', '2278 × 1134 × 35 mm'], ['Weight', '≈ 32 kg'], ['Glass', '2.0 mm + 2.0 mm dual glass'], ['Frame', 'Anodised aluminium']] },
    { title: 'Compliance', rows: [['Cell origin', v.v.dcr === 'DCR' ? 'Domestic Content Requirement (DCR)' : 'Non-DCR'], certPending] },
    { title: 'Packaging', rows: [['Pallet', '31 modules (sample)']] },
  ],
  where: ['Rooftop and ground-mount systems for homes, businesses and solar parks.', 'Choose DCR modules where a government subsidy requires them.'],
  worksWith: ['ongrid-string-inverter', 'solar-dc-cable', 'lifepo4-home-battery'],
  faqs: [
    { q: 'What does “bifacial” mean?', a: 'The module can also generate from light reflected onto its back, for example from a light-coloured roof or ground, which can add a few percent more energy.' },
    { q: 'Do I need DCR modules?', a: 'If you are applying for a government subsidy such as PM Surya Ghar, the scheme requires DCR modules. Otherwise either works.' },
  ],
});
add({
  slug: 'ongrid-string-inverter', category: 'solar-equipment', sample: true,
  name: 'On-grid string inverter', series: 'Solar inverters',
  benefit: 'Converts solar DC power into AC for your home and exports the surplus to the grid.',
  image: 'pf02', unit: pcs,
  axes: [{ key: 'capacity', label: 'Capacity' }],
  variants: [
    ['3 kW', 'Single-phase', '1'], ['5 kW', 'Single-phase', '2'], ['10 kW', 'Three-phase', '2'],
  ].map(([capacity, phase, mppt]) => ({
    sku: `EC-INV-OG-${n(capacity)}K-${phase === 'Single-phase' ? '1P' : '3P'}`,
    label: `${capacity} · ${phase}`,
    v: { product: 'Inverter', capacity, phase, system: 'On-grid', technology: 'String inverter', mppt, efficiency: '97.6%' },
  })),
  keySpecs: [{ key: 'capacity', label: 'Rated output' }, { key: 'phase', label: 'Phase' }, { key: 'mppt', label: 'MPPT trackers' }, { key: 'efficiency', label: 'Max. efficiency' }],
  cardSpecs: [{ key: 'capacity', label: 'Output' }, { key: 'phase', label: 'Phase' }, { key: 'system', label: 'System' }, { key: 'mppt', label: 'MPPTs' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Rated AC output', v.v.capacity], ['Grid connection', v.v.phase], ['MPPT trackers', v.v.mppt], ['Maximum efficiency', v.v.efficiency]] },
    { title: 'Physical', rows: [['Protection', 'IP65'], ['Cooling', 'Natural convection'], ['Monitoring', 'Wi-Fi (app)']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Rooftop solar for homes and small businesses with a grid connection and net metering.'],
  worksWith: ['solar-module-bifacial', 'solar-dc-cable', 'mcb'],
  faqs: [{ q: 'Will it work during a power cut?', a: 'No. For safety, on-grid inverters switch off when the grid fails. If you need backup, ask us about a hybrid system with a battery.' }],
});
add({
  slug: 'lifepo4-home-battery', category: 'solar-equipment', sample: true,
  name: 'LiFePO4 home battery', series: 'Energy storage',
  benefit: 'Stores solar power for the evening and keeps essentials running during cuts.',
  image: 'pf03', unit: pcs,
  axes: [{ key: 'capacity', label: 'Capacity' }],
  variants: ['5.12 kWh', '10.24 kWh'].map((capacity) => ({
    sku: `EC-BAT-LFP-${Math.round(n(capacity))}K`,
    label: capacity,
    v: { product: 'Battery', capacity, system: 'Hybrid', technology: 'Lithium iron phosphate', voltage: '51.2 V', cycles: '6,000' },
  })),
  keySpecs: [{ key: 'capacity', label: 'Energy' }, { key: 'voltage', label: 'Nominal voltage' }, { key: 'cycles', label: 'Cycles at 80% DoD' }, { key: 'technology', label: 'Chemistry' }],
  cardSpecs: [{ key: 'capacity', label: 'Energy' }, { key: 'technology', label: 'Chemistry' }, { key: 'voltage', label: 'Voltage' }, { key: 'cycles', label: 'Cycles' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Usable energy', v.v.capacity], ['Nominal voltage', v.v.voltage], ['Cycle life', `${v.v.cycles} cycles at 80% depth of discharge`]] },
    { title: 'Physical', rows: [['Mounting', 'Wall or floor'], ['Protection', 'IP55']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Homes and businesses with a hybrid inverter that want backup during power cuts.'],
  worksWith: ['ongrid-string-inverter', 'solar-module-bifacial'],
  faqs: [{ q: 'How long will it run my home?', a: 'It depends on what’s connected. 5 kWh can run lights, fans, a fridge and Wi-Fi for several hours; we size it at your site survey.' }],
});

// ---- Lighting --------------------------------------------------------------
add({
  slug: 'led-bulb-b22', category: 'lighting', sub: 'led-bulbs', sample: true, isNew: true,
  name: 'LED bulb B22', series: 'Everyday LED',
  benefit: 'Bright, flicker-free light with the standard B22 base, fits the holders already in your home.',
  image: 'pf04', gallery: ['pf04', 'pf04c', 'pf04b', 'pf04d', 'pf04e'], litImage: 'pf04c',
  unit: { one: 'box', many: 'boxes', note: '10 bulbs each' },
  axes: [{ key: 'wattage', label: 'Wattage' }, { key: 'cct', label: 'Light colour' }],
  variants: combos({ wattage: ['9 W', '12 W', '15 W'], cct: ['2700 K', '4000 K', '6500 K'] }).map((c) => ({
    sku: `EC-L-B22-${n(c.wattage)}-${n(c.cct) / 100}`,
    label: `${c.wattage} · ${c.cct}`,
    v: { ...c, type: 'LED bulb', base: 'B22', shape: 'A60', ip: 'IP20', lumens: `${n(c.wattage) * 100} lm`, efficacy: '100 lm/W', colourName: CCT[c.cct] },
  })),
  keySpecs: [{ key: 'wattage', label: 'Power' }, { key: 'lumens', label: 'Light output' }, { key: 'cct', label: 'Light colour' }, { key: 'base', label: 'Base' }],
  cardSpecs: [{ key: 'wattage', label: 'Wattage' }, { key: 'base', label: 'Base' }, { key: 'cct', label: 'Light colour' }, { key: 'lumens', label: 'Lumens' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Power', v.v.wattage], ['Input voltage', '100–300 V AC, 50 Hz'], ['Power factor', '> 0.9']] },
    { title: 'Performance', rows: [['Light output', v.v.lumens], ['Efficacy', v.v.efficacy], ['Colour temperature', `${v.v.cct} (${v.v.colourName})`], ['Colour rendering', 'CRI > 80'], ['Rated life', '25,000 hours']] },
    { title: 'Physical', rows: [['Base', 'B22 bayonet'], ['Shape', 'A60'], ['Diffuser', 'Frosted polycarbonate']] },
    { title: 'Compliance', rows: [certPending] },
    { title: 'Packaging', rows: [['Box', '10 bulbs'], ['Carton', '100 bulbs (sample)']] },
  ],
  where: ['Bedrooms and living rooms: 9–12 W in warm or natural white.', 'Kitchens, study and workspaces: 12–15 W in cool daylight.'],
  worksWith: ['modular-switch', 'fr-pvc-house-wire'],
  faqs: [
    { q: 'Which light colour should I choose?', a: '2700 K is warm and relaxing for bedrooms, 4000 K is natural for living spaces, and 6500 K is crisp daylight for kitchens and study areas.' },
    { q: 'Will it fit my existing holder?', a: 'Yes, if your holder takes the push-and-twist B22 bayonet base, which most Indian homes use.' },
  ],
});
add({
  slug: 'led-batten-4ft', category: 'lighting', sub: 'tube-lights-battens', sample: true,
  name: 'LED batten 4 ft', series: 'Linear LED',
  benefit: 'A slim, integrated replacement for old tube lights, with even, glare-free light.',
  image: 'pf05', unit: pcs,
  axes: [{ key: 'wattage', label: 'Wattage' }, { key: 'cct', label: 'Light colour' }],
  variants: combos({ wattage: ['18 W', '20 W', '22 W'], cct: ['4000 K', '6500 K'] }).map((c) => ({
    sku: `EC-L-BT4-${n(c.wattage)}-${n(c.cct) / 100}`,
    label: `${c.wattage} · ${c.cct}`,
    v: { ...c, type: 'LED batten', length: '4 ft', mounting: 'Surface', ip: 'IP20', lumens: `${n(c.wattage) * 110} lm`, colourName: CCT[c.cct] },
  })),
  keySpecs: [{ key: 'wattage', label: 'Power' }, { key: 'lumens', label: 'Light output' }, { key: 'length', label: 'Length' }, { key: 'cct', label: 'Light colour' }],
  cardSpecs: [{ key: 'wattage', label: 'Wattage' }, { key: 'length', label: 'Length' }, { key: 'cct', label: 'Light colour' }, { key: 'lumens', label: 'Lumens' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Power', v.v.wattage], ['Input voltage', '140–270 V AC'], ['Power factor', '> 0.95']] },
    { title: 'Performance', rows: [['Light output', v.v.lumens], ['Colour temperature', `${v.v.cct} (${v.v.colourName})`], ['Rated life', '25,000 hours']] },
    { title: 'Physical', rows: [['Length', '1200 mm (4 ft)'], ['Mounting', 'Surface, with clips'], ['Diffuser', 'Opal polycarbonate']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Corridors, kitchens, shops, classrooms and offices.'],
  worksWith: ['modular-switch', 'fr-pvc-house-wire'],
  faqs: [{ q: 'Can it replace my old tube light directly?', a: 'Yes. Remove the old fitting and choke, and fix the batten in its place. It runs directly on mains supply.' }],
});
add({
  slug: 'led-street-light', category: 'lighting', sub: 'street-lights', sample: true,
  name: 'LED street light', series: 'Road lighting',
  benefit: 'Efficient, weatherproof road lighting with even spread and long life.',
  image: 'pf06', unit: pcs,
  axes: [{ key: 'wattage', label: 'Wattage' }, { key: 'cct', label: 'Light colour' }],
  variants: combos({ wattage: ['30 W', '45 W', '60 W', '90 W'], cct: ['4000 K', '5700 K'] }).map((c) => ({
    sku: `EC-L-SL-${n(c.wattage)}-${n(c.cct) / 100}`,
    label: `${c.wattage} · ${c.cct}`,
    v: { ...c, type: 'LED street light', mounting: 'Pole side-entry', ip: 'IP66', lumens: `${(n(c.wattage) * 120).toLocaleString('en-IN')} lm`, colourName: CCT[c.cct] },
  })),
  keySpecs: [{ key: 'wattage', label: 'Power' }, { key: 'lumens', label: 'Light output' }, { key: 'ip', label: 'Protection' }, { key: 'cct', label: 'Light colour' }],
  cardSpecs: [{ key: 'wattage', label: 'Wattage' }, { key: 'lumens', label: 'Lumens' }, { key: 'ip', label: 'IP rating' }, { key: 'mounting', label: 'Mounting' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Power', v.v.wattage], ['Input voltage', '140–270 V AC'], ['Surge protection', '10 kV']] },
    { title: 'Performance', rows: [['Light output', v.v.lumens], ['Efficacy', '120 lm/W'], ['Colour temperature', `${v.v.cct} (${v.v.colourName})`]] },
    { title: 'Physical', rows: [['Body', 'Die-cast aluminium'], ['Protection', 'IP66, IK08'], ['Mounting', 'Side entry, 40–60 mm spigot']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Main roads (60–90 W), colony roads and lanes (30–45 W), campuses and parking.'],
  worksWith: ['street-light-control-panel', 'solar-street-light-all-in-one'],
  faqs: [{ q: 'Do you also install street lights?', a: 'Yes, see Street & highway lighting under Infrastructure for survey, supply, installation and maintenance.' }],
});
add({
  slug: 'solar-street-light-all-in-one', category: 'lighting', sub: 'street-lights', sample: true,
  name: 'All-in-one solar street light', series: 'Solar lighting',
  benefit: 'Panel, battery and LED in one unit, no cabling, no electricity bill.',
  image: 'pf07', unit: pcs,
  axes: [{ key: 'wattage', label: 'Wattage' }],
  variants: [['20 W', '60 Wp', '384 Wh'], ['30 W', '80 Wp', '512 Wh'], ['40 W', '100 Wp', '768 Wh']].map(([wattage, panel, battery]) => ({
    sku: `EC-L-SSL-${n(wattage)}`,
    label: wattage,
    v: { wattage, panel, battery, type: 'Solar street light', mounting: 'Pole top or side', ip: 'IP65', cct: '5700 K', lumens: `${(n(wattage) * 150).toLocaleString('en-IN')} lm`, autonomy: '2 nights' },
  })),
  keySpecs: [{ key: 'wattage', label: 'LED power' }, { key: 'panel', label: 'Solar panel' }, { key: 'battery', label: 'Battery' }, { key: 'autonomy', label: 'Backup' }],
  cardSpecs: [{ key: 'wattage', label: 'Wattage' }, { key: 'panel', label: 'Panel' }, { key: 'battery', label: 'Battery' }, { key: 'ip', label: 'IP rating' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['LED power', v.v.wattage], ['Solar panel', `${v.v.panel}, monocrystalline`], ['Battery', `${v.v.battery} LiFePO4`], ['Autonomy', v.v.autonomy]] },
    { title: 'Performance', rows: [['Light output', v.v.lumens], ['Control', 'Dusk-to-dawn with motion sensing'], ['Colour temperature', '5700 K']] },
    { title: 'Physical', rows: [['Protection', 'IP65'], ['Mounting', 'Pole top or side, adjustable bracket']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Village lanes, farm roads, campuses and anywhere grid power is unreliable or far away.'],
  worksWith: ['led-street-light'],
  faqs: [{ q: 'What happens on cloudy days?', a: 'The battery is sized for about two nights without sun. Output also dims gently late at night to save energy.' }],
});
add({
  slug: 'led-flood-light', category: 'lighting', sub: 'flood-lights', sample: true,
  name: 'LED flood light', series: 'Area lighting',
  benefit: 'Powerful, weatherproof light for yards, facades, grounds and signage.',
  image: 'pf08', unit: pcs,
  axes: [{ key: 'wattage', label: 'Wattage' }, { key: 'cct', label: 'Light colour' }],
  variants: combos({ wattage: ['50 W', '100 W', '200 W'], cct: ['4000 K', '6500 K'] }).map((c) => ({
    sku: `EC-L-FL-${n(c.wattage)}-${n(c.cct) / 100}`,
    label: `${c.wattage} · ${c.cct}`,
    v: { ...c, type: 'LED flood light', ip: 'IP65', beam: '120°', mounting: 'U-bracket', lumens: `${(n(c.wattage) * 100).toLocaleString('en-IN')} lm`, colourName: CCT[c.cct] },
  })),
  keySpecs: [{ key: 'wattage', label: 'Power' }, { key: 'lumens', label: 'Light output' }, { key: 'beam', label: 'Beam angle' }, { key: 'ip', label: 'Protection' }],
  cardSpecs: [{ key: 'wattage', label: 'Wattage' }, { key: 'lumens', label: 'Lumens' }, { key: 'ip', label: 'IP rating' }, { key: 'cct', label: 'Light colour' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Power', v.v.wattage], ['Input voltage', '140–270 V AC']] },
    { title: 'Performance', rows: [['Light output', v.v.lumens], ['Beam angle', v.v.beam], ['Colour temperature', `${v.v.cct} (${v.v.colourName})`]] },
    { title: 'Physical', rows: [['Body', 'Die-cast aluminium, black'], ['Protection', 'IP65'], ['Mounting', 'Adjustable U-bracket']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Building facades, factory yards, sports grounds, hoardings and security lighting.'],
  worksWith: ['fr-pvc-house-wire', 'mcb'],
  faqs: [{ q: 'Can it be used in rain?', a: 'Yes. IP65 means it’s protected against dust and water jets from any direction.' }],
});

// ---- Switches & sockets ----------------------------------------------------
add({
  slug: 'modular-switch', category: 'switches-sockets', sample: true,
  name: 'Modular switch', series: 'Series A',
  benefit: 'Smooth, quiet rocker switches that fit standard modular plates and boxes.',
  image: 'pf09', unit: { one: 'box', many: 'boxes', note: '20 switches each' },
  axes: [{ key: 'type', label: 'Type' }, { key: 'rating', label: 'Rating' }],
  variants: [['1-way', '6 A'], ['1-way', '16 A'], ['2-way', '6 A'], ['Bell push', '6 A']].map(([type, rating]) => ({
    sku: `EC-S-${type === '1-way' ? 'SW1' : type === '2-way' ? 'SW2' : 'BP'}-${n(rating)}`,
    label: `${type} · ${rating}`,
    v: { type, rating, series: 'Series A', modules: '1 module', finish: 'Gloss white', terminals: 'Brass, screw type' },
  })),
  keySpecs: [{ key: 'rating', label: 'Rating' }, { key: 'type', label: 'Type' }, { key: 'modules', label: 'Size' }, { key: 'finish', label: 'Finish' }],
  cardSpecs: [{ key: 'type', label: 'Type' }, { key: 'rating', label: 'Rating' }, { key: 'modules', label: 'Size' }, { key: 'finish', label: 'Finish' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Rating', `${v.v.rating}, 240 V AC`], ['Type', v.v.type], ['Terminals', v.v.terminals]] },
    { title: 'Physical', rows: [['Module size', v.v.modules], ['Finish', v.v.finish], ['Material', 'Polycarbonate']] },
    { title: 'Compliance', rows: [certPending] },
    { title: 'Packaging', rows: [['Box', '20 switches']] },
  ],
  where: ['6 A for lights and fans; 16 A for geysers, ACs and other heavy appliances.', '2-way switches let you control one light from two places, such as a staircase.'],
  worksWith: ['modular-socket', 'fr-pvc-house-wire', 'led-bulb-b22'],
  faqs: [{ q: 'Will these fit my existing plates?', a: 'They fit standard Indian modular plates and boxes of the same series. Ask us to confirm compatibility with another brand’s plates.' }],
});
add({
  slug: 'modular-socket', category: 'switches-sockets', sample: true,
  name: 'Modular socket', series: 'Series A',
  benefit: 'Indian three-pin sockets with safety shutters that keep little fingers out.',
  image: 'pf10', unit: { one: 'box', many: 'boxes', note: '10 sockets each' },
  axes: [{ key: 'rating', label: 'Rating' }],
  variants: [['6/16 A', '3 modules', 'Universal (6 A and 16 A plugs)'], ['6 A', '2 modules', '6 A plugs']].map(([rating, modules, accepts]) => ({
    sku: `EC-S-SKT-${rating === '6/16 A' ? '616' : '6'}`,
    label: rating,
    v: { type: 'Socket', rating, modules, accepts, series: 'Series A', finish: 'Gloss white' },
  })),
  keySpecs: [{ key: 'rating', label: 'Rating' }, { key: 'modules', label: 'Size' }, { key: 'accepts', label: 'Accepts' }, { key: 'finish', label: 'Finish' }],
  cardSpecs: [{ key: 'rating', label: 'Rating' }, { key: 'modules', label: 'Size' }, { key: 'type', label: 'Type' }, { key: 'finish', label: 'Finish' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Rating', `${v.v.rating}, 240 V AC`], ['Accepts', v.v.accepts], ['Shutters', 'Yes, child-safe']] },
    { title: 'Physical', rows: [['Module size', v.v.modules], ['Finish', v.v.finish]] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Universal 6/16 A sockets suit kitchens and living rooms, where both small and large plugs are used.'],
  worksWith: ['modular-switch', 'fr-pvc-house-wire', 'mcb'],
  faqs: [{ q: 'What does “universal” mean here?', a: 'It accepts both the small 6 A and the large 16 A Indian three-pin plugs.' }],
});

// ---- Wires & cables --------------------------------------------------------
const WIRE: Record<string, { strands: string; ins: string; res: string; amps: string }> = {
  '0.75': { strands: '24 / 0.20 mm', ins: '0.6 mm', res: '26.0 Ω/km', amps: '7 A' },
  '1': { strands: '32 / 0.20 mm', ins: '0.6 mm', res: '19.5 Ω/km', amps: '11 A' },
  '1.5': { strands: '30 / 0.25 mm', ins: '0.6 mm', res: '13.3 Ω/km', amps: '14 A' },
  '2.5': { strands: '50 / 0.25 mm', ins: '0.7 mm', res: '7.98 Ω/km', amps: '18 A' },
  '4': { strands: '56 / 0.30 mm', ins: '0.8 mm', res: '4.95 Ω/km', amps: '26 A' },
  '6': { strands: '84 / 0.30 mm', ins: '0.8 mm', res: '3.30 Ω/km', amps: '31 A' },
};
const COLOURS = ['Red', 'Yellow', 'Blue', 'Black', 'Green'];
const houseWire = (slug: string, insulation: 'FR' | 'FRLS', sizes: string[], image: ImageId, name: string, benefit: string) =>
  add({
    slug, category: 'wires-cables', sample: true, name, series: 'House wires', benefit, image,
    unit: { one: 'coil', many: 'coils', note: '90 m each' },
    axes: [{ key: 'size', label: 'Size' }, { key: 'colour', label: 'Colour' }],
    variants: combos({ size: sizes, colour: COLOURS }).map((c) => {
      const w = WIRE[c.size];
      return {
        sku: `EC-W-${insulation}-${c.size}-${c.colour.slice(0, 2).toUpperCase()}-90`,
        label: `${c.size} sq mm · ${c.colour}`,
        v: { size: `${c.size} sq mm`, colour: c.colour, insulation, length: '90 m', cores: 'Single core', voltage: '1100 V', class: 'Class 5 (flexible)', strands: w.strands, thickness: w.ins, resistance: w.res, amps: w.amps },
      };
    }),
    keySpecs: [{ key: 'size', label: 'Conductor size' }, { key: 'amps', label: 'Current (typical)' }, { key: 'resistance', label: 'Max. resistance at 20 °C' }, { key: 'length', label: 'Coil' }],
    cardSpecs: [{ key: 'size', label: 'Size' }, { key: 'insulation', label: 'Insulation' }, { key: 'length', label: 'Coil' }, { key: 'colour', label: 'Colours' }],
    specs: (v) => [
      { title: 'Electrical', rows: [['Voltage grade', '1100 V'], ['Current rating (typical, in conduit)', v.v.amps], ['Max. conductor resistance at 20 °C', v.v.resistance]] },
      { title: 'Physical', rows: [['Conductor', 'Bare annealed copper, class 5 flexible'], ['Strands', v.v.strands], ['Insulation', `${insulation === 'FR' ? 'Flame retardant' : 'Flame retardant, low smoke'} PVC, ${v.v.thickness} nominal`], ['Colour', v.v.colour], ['Operating temperature', 'Up to 70 °C']] },
      { title: 'Compliance', rows: [certPending] },
      { title: 'Packaging', rows: [['Coil length', '90 m'], ['Pack', 'Shrink-wrapped coil with label']] },
    ],
    where: ['1–1.5 sq mm: lighting and fan circuits.', '2.5 sq mm: socket circuits.', '4–6 sq mm: AC, geyser and main supply lines.'],
    worksWith: ['mcb', 'modular-switch', 'distribution-board'],
    faqs: [
      { q: 'Which size do I need?', a: 'As a rule of thumb: 1.5 sq mm for lights and fans, 2.5 sq mm for sockets, 4 sq mm for AC points. Your electrician should confirm sizes for your actual loads.' },
      { q: 'What do the colours mean?', a: 'Red, yellow and blue are used for phases, black for neutral and green for earth. Using the right colours makes future repairs safer.' },
    ],
  });
houseWire('fr-pvc-house-wire', 'FR', ['0.75', '1', '1.5', '2.5', '4', '6'], 'pf11', 'FR PVC house wire', 'Flexible copper house wire with flame-retardant insulation, for everyday home wiring.');
houseWire('frls-house-wire', 'FRLS', ['1', '1.5', '2.5', '4'], 'pf12', 'FRLS house wire', 'Gives off less smoke if it ever burns, preferred for apartments, hospitals and offices.');
add({
  slug: 'solar-dc-cable', category: 'wires-cables', sample: true,
  name: 'Solar DC cable', series: 'Solar cables',
  benefit: 'UV-resistant, double-insulated cable for connecting solar panels to the inverter.',
  image: 'pf13', unit: { one: 'drum', many: 'drums', note: '100 m each' },
  axes: [{ key: 'size', label: 'Size' }, { key: 'colour', label: 'Colour' }],
  variants: combos({ size: ['4', '6'], colour: ['Red', 'Black'] }).map((c) => ({
    sku: `EC-W-DC-${c.size}-${c.colour.slice(0, 2).toUpperCase()}-100`,
    label: `${c.size} sq mm · ${c.colour}`,
    v: { size: `${c.size} sq mm`, colour: c.colour, insulation: 'XLPO (solar)', length: '100 m', cores: 'Single core', voltage: '1.5 kV DC', class: 'Class 5, tinned', amps: c.size === '4' ? '55 A' : '70 A' },
  })),
  keySpecs: [{ key: 'size', label: 'Conductor size' }, { key: 'voltage', label: 'Rated voltage' }, { key: 'amps', label: 'Current (in air)' }, { key: 'length', label: 'Drum' }],
  cardSpecs: [{ key: 'size', label: 'Size' }, { key: 'voltage', label: 'Voltage' }, { key: 'length', label: 'Drum' }, { key: 'colour', label: 'Colours' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Rated voltage', '1.5 kV DC'], ['Current rating (in air)', v.v.amps]] },
    { title: 'Physical', rows: [['Conductor', 'Tinned copper, class 5'], ['Insulation & sheath', 'Electron-beam cross-linked polyolefin (XLPO), UV-resistant'], ['Operating temperature', '−40 °C to +90 °C'], ['Colour', v.v.colour]] },
    { title: 'Compliance', rows: [certPending] },
    { title: 'Packaging', rows: [['Drum length', '100 m']] },
  ],
  where: ['Between solar panels, and from the array to the inverter. Use red for positive and black for negative.'],
  worksWith: ['solar-module-bifacial', 'ongrid-string-inverter'],
  faqs: [{ q: 'Why not use ordinary wire?', a: 'Solar cable is built for years of direct sun, heat and DC voltage on rooftops. Ordinary PVC wire degrades outdoors.' }],
});

// ---- Switchgear & panels ---------------------------------------------------
add({
  slug: 'mcb', category: 'switchgear-panels', sample: true,
  name: 'Miniature circuit breaker (MCB)', series: 'Circuit protection',
  benefit: 'Trips instantly on overload or short circuit, protecting wiring and appliances.',
  image: 'pf14', unit: pcs,
  axes: [{ key: 'poles', label: 'Poles' }, { key: 'curve', label: 'Curve' }, { key: 'current', label: 'Rating' }],
  variants: combos({ poles: ['SP', 'DP', 'TP', 'TPN'], curve: ['B', 'C'], current: ['6 A', '10 A', '16 A', '20 A', '25 A', '32 A', '40 A', '63 A'] }).map((c) => ({
    sku: `EC-SG-MCB-${c.poles}-${c.curve}${n(c.current)}`,
    label: `${c.poles} · ${c.curve} curve · ${c.current}`,
    v: { ...c, curve: `${c.curve} curve`, product: 'MCB', breaking: '10 kA', modules: `${{ SP: 1, DP: 2, TP: 3, TPN: 4 }[c.poles]} module${c.poles === 'SP' ? '' : 's'}` },
  })),
  keySpecs: [{ key: 'current', label: 'Rated current' }, { key: 'curve', label: 'Tripping curve' }, { key: 'poles', label: 'Poles' }, { key: 'breaking', label: 'Breaking capacity' }],
  cardSpecs: [{ key: 'current', label: 'Rating' }, { key: 'poles', label: 'Poles' }, { key: 'curve', label: 'Curve' }, { key: 'breaking', label: 'Breaking' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Rated current', v.v.current], ['Tripping curve', v.v.curve], ['Breaking capacity', v.v.breaking], ['Rated voltage', v.v.poles === 'SP' ? '240 V AC' : '415 V AC']] },
    { title: 'Physical', rows: [['Poles', v.v.poles], ['Width', v.v.modules], ['Mounting', '35 mm DIN rail']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['B curve: lighting and socket circuits.', 'C curve: motors, pumps, ACs and other loads with start-up surges.'],
  worksWith: ['distribution-board', 'rccb', 'fr-pvc-house-wire'],
  faqs: [{ q: 'MCB or RCCB, do I need both?', a: 'Yes, ideally. An MCB protects the wiring from overload and short circuits; an RCCB protects people from electric shock caused by leakage current.' }],
});
add({
  slug: 'rccb', category: 'switchgear-panels', sample: true,
  name: 'Residual current circuit breaker (RCCB)', series: 'Circuit protection',
  benefit: 'Detects leakage current and disconnects supply in milliseconds, protection against shock.',
  image: 'pf15', unit: pcs,
  axes: [{ key: 'poles', label: 'Poles' }, { key: 'current', label: 'Rating' }, { key: 'sensitivity', label: 'Sensitivity' }],
  variants: combos({ poles: ['2P', '4P'], current: ['25 A', '40 A', '63 A'], sensitivity: ['30 mA', '100 mA'] }).map((c) => ({
    sku: `EC-SG-RC-${c.poles}-${n(c.current)}-${n(c.sensitivity)}`,
    label: `${c.poles} · ${c.current} · ${c.sensitivity}`,
    v: { ...c, product: 'RCCB', type: 'Type AC' },
  })),
  keySpecs: [{ key: 'current', label: 'Rated current' }, { key: 'sensitivity', label: 'Sensitivity' }, { key: 'poles', label: 'Poles' }, { key: 'type', label: 'Type' }],
  cardSpecs: [{ key: 'current', label: 'Rating' }, { key: 'poles', label: 'Poles' }, { key: 'sensitivity', label: 'Sensitivity' }, { key: 'type', label: 'Type' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Rated current', v.v.current], ['Rated residual current', v.v.sensitivity], ['Type', 'AC'], ['Test button', 'Yes']] },
    { title: 'Physical', rows: [['Poles', v.v.poles], ['Mounting', '35 mm DIN rail']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['30 mA at the main board of every home for personal safety.', '100 mA for fire protection on larger installations.'],
  worksWith: ['mcb', 'distribution-board'],
  faqs: [{ q: 'How often should I press the test button?', a: 'Once a month. It should trip immediately, if it doesn’t, have it checked.' }],
});
add({
  slug: 'distribution-board', category: 'switchgear-panels', sample: true,
  name: 'Distribution board', series: 'Enclosures',
  benefit: 'Powder-coated steel board that keeps breakers organised, protected and easy to service.',
  image: 'pf16', unit: pcs,
  axes: [{ key: 'poles', label: 'Type' }, { key: 'ways', label: 'Ways' }],
  variants: [['SPN', '4 way'], ['SPN', '8 way'], ['SPN', '12 way'], ['TPN', '4 way'], ['TPN', '8 way']].map(([poles, ways]) => ({
    sku: `EC-SG-DB-${poles}-${n(ways)}`,
    label: `${poles} · ${ways}`,
    v: { product: 'Distribution board', poles, ways, current: poles === 'SPN' ? '63 A' : '100 A', mounting: 'Flush', ip: 'IP42' },
  })),
  keySpecs: [{ key: 'ways', label: 'Ways' }, { key: 'poles', label: 'Supply' }, { key: 'current', label: 'Busbar rating' }, { key: 'ip', label: 'Protection' }],
  cardSpecs: [{ key: 'ways', label: 'Ways' }, { key: 'poles', label: 'Supply' }, { key: 'current', label: 'Busbar' }, { key: 'ip', label: 'IP rating' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Supply', v.v.poles === 'SPN' ? 'Single phase + neutral' : 'Three phase + neutral'], ['Outgoing ways', v.v.ways], ['Busbar rating', v.v.current]] },
    { title: 'Physical', rows: [['Construction', 'CRCA steel, powder-coated'], ['Mounting', 'Flush (concealed)'], ['Protection', v.v.ip], ['Door', 'Hinged, with lock provision']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['SPN boards for single-phase homes and shops; TPN boards for three-phase supply.'],
  worksWith: ['mcb', 'rccb', 'isolator'],
  faqs: [{ q: 'How many ways do I need?', a: 'One way per MCB, plus spare ways for the future. A typical 2BHK uses an 8-way SPN board.' }],
});
add({
  slug: 'isolator', category: 'switchgear-panels', sample: true,
  name: 'Isolator', series: 'Circuit protection',
  benefit: 'A clearly marked main switch to safely cut off supply for maintenance.',
  image: 'pf17', unit: pcs,
  axes: [{ key: 'poles', label: 'Poles' }, { key: 'current', label: 'Rating' }],
  variants: combos({ poles: ['2P', '4P'], current: ['40 A', '63 A', '100 A'] }).map((c) => ({
    sku: `EC-SG-ISO-${c.poles}-${n(c.current)}`,
    label: `${c.poles} · ${c.current}`,
    v: { ...c, product: 'Isolator' },
  })),
  keySpecs: [{ key: 'current', label: 'Rated current' }, { key: 'poles', label: 'Poles' }, { key: 'product', label: 'Type' }],
  cardSpecs: [{ key: 'current', label: 'Rating' }, { key: 'poles', label: 'Poles' }, { key: 'product', label: 'Type' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Rated current', v.v.current], ['Function', 'Isolation (switch-disconnector)']] },
    { title: 'Physical', rows: [['Poles', v.v.poles], ['Mounting', '35 mm DIN rail']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['As the main incoming switch of a distribution board.'],
  worksWith: ['distribution-board', 'mcb'],
  faqs: [{ q: 'Does an isolator protect against overload?', a: 'No. It only switches the supply on and off. Use MCBs and RCCBs for protection.' }],
});
add({
  slug: 'street-light-control-panel', category: 'switchgear-panels', sample: true,
  name: 'Street-light control panel', series: 'Outdoor panels',
  benefit: 'Weatherproof feeder pillar that switches street lights automatically at dusk and dawn.',
  image: 'pf18', unit: pcs,
  axes: [{ key: 'ways', label: 'Feeders' }, { key: 'control', label: 'Control' }],
  variants: [['1 feeder', 'Astronomical timer'], ['2 feeders', 'Astronomical timer'], ['2 feeders', 'Smart (remote monitoring)']].map(([ways, control]) => ({
    sku: `EC-SG-SLCP-${n(ways)}F-${control.startsWith('Smart') ? 'S' : 'T'}`,
    label: `${ways} · ${control}`,
    v: { product: 'Control panel', ways, control, current: '63 A', poles: 'TPN', ip: 'IP55' },
  })),
  keySpecs: [{ key: 'ways', label: 'Feeders' }, { key: 'control', label: 'Control' }, { key: 'current', label: 'Incomer' }, { key: 'ip', label: 'Protection' }],
  cardSpecs: [{ key: 'ways', label: 'Feeders' }, { key: 'control', label: 'Control' }, { key: 'ip', label: 'IP rating' }, { key: 'current', label: 'Incomer' }],
  specs: (v) => [
    { title: 'Electrical', rows: [['Incomer', `${v.v.current} TPN`], ['Outgoing feeders', v.v.ways], ['Control', v.v.control]] },
    { title: 'Physical', rows: [['Enclosure', 'Outdoor steel, powder-coated, with rain canopy'], ['Protection', v.v.ip], ['Mounting', 'Plinth']] },
    { title: 'Compliance', rows: [certPending] },
  ],
  where: ['Municipal roads, colonies, campuses and highway lighting circuits.'],
  worksWith: ['led-street-light', 'mcb'],
  faqs: [{ q: 'What is an astronomical timer?', a: 'It calculates sunset and sunrise for your location every day, so lights switch on and off at the right time all year without adjustment.' }],
});

export const allFamilies = families;

// ----------------------------------------------------------------- queries
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const familiesIn = (cat: string, sub?: string) =>
  families.filter((f) => f.category === cat && (!sub || f.sub === sub));
export const getFamily = (slug: string) => families.find((f) => f.slug === slug);
export const familyUrl = (f: Family) => u(`/products/${f.category}/${f.slug}/`);
export const categoryUrl = (c: string, sub?: string) => u(`/products/${c}/${sub ? sub + '/' : ''}`);
export const variantCount = (cat: string) => familiesIn(cat).reduce((s, f) => s + f.variants.length, 0);

export const toNum = (s: string) => parseFloat(String(s).replace(/,/g, ''));

/** Family-level summary for a card spec, e.g. "0.75–6 sq mm" or "5 options". */
export function summarise(f: Family, key: string): string {
  const vals = [...new Set(f.variants.map((v) => v.v[key]).filter(Boolean))];
  if (vals.length === 0) return '-';
  if (vals.length === 1) return vals[0];
  const nums = vals.map(toNum);
  if (nums.every((x) => !Number.isNaN(x))) {
    const unit = vals[0].replace(/^[\d.,/]+\s*/, '');
    const sorted = [...nums].sort((a, b) => a - b);
    const fmt = (x: number) => x.toLocaleString('en-IN');
    if (unit && sorted[0] !== sorted.at(-1) && vals.every((x) => x.endsWith(unit)) && !vals.some((x) => x.includes('/')))
      return `${fmt(sorted[0])}–${fmt(sorted.at(-1)!)} ${unit}`.trim();
  }
  if (key === 'colour') return `${vals.length} colours`;
  return vals.length <= 2 ? vals.join(' / ') : `${vals.length} options`;
}

export const CCT_SWATCH: Record<string, string> = {
  '2700 K': '#ffd59a', '3000 K': '#ffe0b0', '4000 K': '#fff3dc', '5700 K': '#eef4ff', '6500 K': '#e3edff',
};

/** Search synonyms: everyday words customers use on the phone (C16, to extend). */
export const SYNONYMS: Record<string, string[]> = {
  taar: ['wire'], tar: ['wire'], wire: ['cable'], cable: ['wire'],
  tubelight: ['batten'], 'tube light': ['batten'], tube: ['batten'],
  'circuit breaker': ['mcb'], breaker: ['mcb'], trip: ['mcb'],
  'bijli ka switch': ['switch'], button: ['switch'], plug: ['socket'],
  bulb: ['led bulb'], light: ['led'], batti: ['bulb', 'led'],
  panel: ['solar module', 'distribution board'], plate: ['solar module'], pv: ['solar module'],
  battery: ['lifepo4'], lithium: ['lifepo4'], inverter: ['inverter'],
  'street light': ['street light'], khamba: ['street light'], pole: ['street light'],
  db: ['distribution board'], earth: ['rccb'], elcb: ['rccb'], 'main switch': ['isolator'],
};
