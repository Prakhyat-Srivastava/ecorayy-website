import type { ImageMetadata } from 'astro';
import type { T } from './site';

/**
 * Central image registry. Every image has an id, alt text and a truth tier
 * (planning/03_Image_Generation_Prompts.md §1.1):
 *  - brand:        permanent, abstract or diagrammatic
 *  - illustrative: generic scene, never captioned as Ecorayy's own work
 *  - placeholder:  stands in for a specific sample product; labelled
 *                  "Representative image" and blocked by check:launch
 *  - portrait:     identity-preserving Director portrait (needs approval, L4)
 */
export type Tier = 'brand' | 'illustrative' | 'placeholder' | 'portrait';
export type Img = { src: ImageMetadata; alt: T; tier: Tier; night?: boolean };

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/**/*.jpg', { eager: true });
const f = (path: string): ImageMetadata => {
  const m = files[`../assets/images/${path}.jpg`];
  if (!m) throw new Error(`Missing image: ${path}`);
  return m.default;
};

export const images = {
  // 01 Brand
  br01: { src: f('01-brand/br-01-first-light-town'), tier: 'illustrative', alt: { en: 'Sunrise over the flat rooftops of a small North Indian town, with solar panels on several houses.', hi: 'एक छोटे उत्तर भारतीय शहर की छतों पर सूर्योदय, कई घरों पर सोलर पैनल।' } },
  br03: { src: f('01-brand/br-03-first-light-panel'), tier: 'brand', alt: { en: 'First morning light along the edge of a solar panel.', hi: 'सोलर पैनल के किनारे पर सुबह की पहली रोशनी।' } },
  br02: { src: f('01-brand/br-02-unplugged-404'), tier: 'brand', alt: { en: 'A white plug lying unplugged, a short distance from a wall socket.' } },
  // 02 Home
  hm01: { src: f('02-home/hm-01-hero-sun-to-street'), tier: 'illustrative', alt: { en: 'A solar street light glowing at dusk in a quiet lane, beside a house with solar panels on its roof.', hi: 'शाम के समय एक शांत गली में जलती सोलर स्ट्रीट लाइट, पास में छत पर सोलर पैनलों वाला घर।' } },
  // 03 Sun to Switch (Night objects)
  sts01: { src: f('03-sun-to-switch/sts-01-solar-panel'), tier: 'brand', night: true, alt: { en: 'Solar panel', hi: 'सोलर पैनल' } },
  sts02: { src: f('03-sun-to-switch/sts-02-inverter-battery'), tier: 'brand', night: true, alt: { en: 'Solar inverter and home battery', hi: 'सोलर इन्वर्टर और बैटरी' } },
  sts03: { src: f('03-sun-to-switch/sts-03-switchgear'), tier: 'brand', night: true, alt: { en: 'Distribution board with circuit breakers', hi: 'सर्किट ब्रेकर वाला डिस्ट्रीब्यूशन बोर्ड' } },
  sts04: { src: f('03-sun-to-switch/sts-04-cable'), tier: 'brand', night: true, alt: { en: 'Electrical cable with copper conductor', hi: 'तांबे के कंडक्टर वाली बिजली की केबल' } },
  sts05: { src: f('03-sun-to-switch/sts-05-switch'), tier: 'brand', night: true, alt: { en: 'Modular switch and socket', hi: 'मॉड्यूलर स्विच और सॉकेट' } },
  sts06a: { src: f('03-sun-to-switch/sts-06a-bulb-off'), tier: 'brand', night: true, alt: { en: 'LED bulb, switched off', hi: 'बंद LED बल्ब' } },
  sts06b: { src: f('03-sun-to-switch/sts-06b-bulb-on'), tier: 'brand', night: true, alt: { en: 'LED bulb glowing', hi: 'जलता हुआ LED बल्ब' } },
  sts07a: { src: f('03-sun-to-switch/sts-07a-streetlight-off'), tier: 'brand', night: true, alt: { en: 'Street light, switched off', hi: 'बंद स्ट्रीट लाइट' } },
  sts07b: { src: f('03-sun-to-switch/sts-07b-streetlight-on'), tier: 'brand', night: true, alt: { en: 'Street light illuminating a road at night', hi: 'रात में सड़क को रोशन करती स्ट्रीट लाइट' } },
  // 04 Solar
  sol01: { src: f('04-solar/sol-01-solar-hub-rooftop-rows'), tier: 'illustrative', alt: { en: 'Rows of rooftop solar panels in morning light.', hi: 'सुबह की रोशनी में छत पर सोलर पैनलों की कतारें।' } },
  sol02: { src: f('04-solar/sol-02-homes-rooftop-house'), tier: 'illustrative', alt: { en: 'A two-storey house with solar panels on an elevated frame on its roof.', hi: 'छत पर ऊँचे ढाँचे पर सोलर पैनलों वाला दो-मंज़िला घर।' } },
  sol03: { src: f('04-solar/sol-03-business-industrial-roof'), tier: 'illustrative', alt: { en: 'Solar panels covering the roof of an industrial building.', hi: 'एक औद्योगिक इमारत की छत पर लगे सोलर पैनल।' } },
  sol04: { src: f('04-solar/sol-04-parks-ground-mount'), tier: 'illustrative', alt: { en: 'Aerial view of rows of ground-mounted solar panels.', hi: 'ज़मीन पर लगे सोलर पैनलों की कतारों का ऊपर से दृश्य।' } },
  sol05: { src: f('04-solar/sol-05-pumps-farm'), tier: 'illustrative', alt: { en: 'Solar panels powering a water pump beside a wheat field.', hi: 'गेहूँ के खेत के पास पानी का पंप चलाते सोलर पैनल।' } },
  // 05 Infrastructure
  inf01: { src: f('05-infrastructure/inf-01-hub-highway-lights'), tier: 'illustrative', alt: { en: 'A highway lit by a long row of LED street lights at dusk.' } },
  inf02: { src: f('05-infrastructure/inf-02-street-light-luminaire'), tier: 'illustrative', alt: { en: 'Close-up of an LED street light glowing at dusk.', hi: 'शाम को जलती LED स्ट्रीट लाइट का नज़दीकी दृश्य।' } },
  inf03: { src: f('05-infrastructure/inf-03-public-decorative-promenade'), tier: 'illustrative', alt: { en: 'Decorative lamp posts lighting a riverside walkway at dusk.' } },
  inf04: { src: f('05-infrastructure/inf-04-traffic-signal-intersection'), tier: 'illustrative', alt: { en: 'LED traffic signal at a city junction at dusk.' } },
  inf05: { src: f('05-infrastructure/inf-05-rural-lane-electrification'), tier: 'illustrative', alt: { en: 'A village lane lit by new LED and solar street lights at dusk.' } },
  // 06 Products
  prd00: { src: f('06-products/prd-00-range-still-life'), tier: 'illustrative', alt: { en: 'An LED bulb, a switch, a coil of wire, a circuit breaker and a solar panel.', hi: 'LED बल्ब, स्विच, तार का बंडल, सर्किट ब्रेकर और सोलर पैनल।' } },
  prd01: { src: f('06-products/prd-01-cat-solar-equipment'), tier: 'illustrative', alt: { en: 'Solar panel, inverter and home battery.' } },
  prd02: { src: f('06-products/prd-02-cat-lighting'), tier: 'illustrative', alt: { en: 'LED batten, LED bulb and flood light.' } },
  prd03: { src: f('06-products/prd-03-cat-switches-sockets'), tier: 'illustrative', alt: { en: 'Modular switch plate with switches and socket.' } },
  prd04: { src: f('06-products/prd-04-cat-wires-cables'), tier: 'illustrative', alt: { en: 'Cut ends of five house wires showing copper strands.' } },
  prd05: { src: f('06-products/prd-05-cat-switchgear-panels'), tier: 'illustrative', alt: { en: 'Circuit breakers, RCCB and distribution board.' } },
  prd06: { src: f('06-products/prd-06-lighting-showroom-night'), tier: 'illustrative', night: true, alt: { en: 'LED bulb, batten, flood light and street light, all switched on against a dark background.' } },
  // 07 Product samples (placeholders)
  pf01: { src: f('07-product-samples/pf-01-solar-module-bifacial'), tier: 'placeholder', alt: { en: 'Bifacial solar module' } },
  pf02: { src: f('07-product-samples/pf-02-ongrid-inverter'), tier: 'placeholder', alt: { en: 'On-grid solar inverter' } },
  pf03: { src: f('07-product-samples/pf-03-lithium-battery'), tier: 'placeholder', alt: { en: 'Lithium home battery' } },
  pf04: { src: f('07-product-samples/pf-04-led-bulb-b22'), tier: 'placeholder', alt: { en: 'LED bulb with B22 base' } },
  pf04b: { src: f('07-product-samples/pf-04b-led-bulb-side'), tier: 'placeholder', alt: { en: 'Side view of the LED bulb' } },
  pf04c: { src: f('07-product-samples/pf-04c-led-bulb-lit-navy'), tier: 'placeholder', night: true, alt: { en: 'The LED bulb switched on' } },
  pf04d: { src: f('07-product-samples/pf-04d-led-bulb-base-detail'), tier: 'placeholder', alt: { en: 'Close-up of the bulb’s B22 base' } },
  pf04e: { src: f('07-product-samples/pf-04e-led-bulb-in-use'), tier: 'placeholder', alt: { en: 'LED bulb lighting a dining table at home' } },
  pf05: { src: f('07-product-samples/pf-05-led-batten-4ft'), tier: 'placeholder', alt: { en: '4-foot LED batten' } },
  pf06: { src: f('07-product-samples/pf-06-led-street-light'), tier: 'placeholder', alt: { en: 'LED street light' } },
  pf07: { src: f('07-product-samples/pf-07-solar-street-light-aio'), tier: 'placeholder', alt: { en: 'All-in-one solar street light' } },
  pf08: { src: f('07-product-samples/pf-08-led-flood-light'), tier: 'placeholder', alt: { en: 'LED flood light' } },
  pf09: { src: f('07-product-samples/pf-09-modular-switch'), tier: 'placeholder', alt: { en: 'Modular rocker switch' } },
  pf10: { src: f('07-product-samples/pf-10-modular-socket'), tier: 'placeholder', alt: { en: 'Modular power socket' } },
  pf11: { src: f('07-product-samples/pf-11-fr-pvc-house-wire'), tier: 'placeholder', alt: { en: 'Cross-section of a red house wire showing copper strands' } },
  pf12: { src: f('07-product-samples/pf-12-frls-house-wire-coil'), tier: 'placeholder', alt: { en: 'Coil of blue house wire' } },
  pf13: { src: f('07-product-samples/pf-13-solar-dc-cable'), tier: 'placeholder', alt: { en: 'Red and black solar DC cables with connectors' } },
  pf14: { src: f('07-product-samples/pf-14-mcb'), tier: 'placeholder', alt: { en: 'Miniature circuit breaker' } },
  pf15: { src: f('07-product-samples/pf-15-rccb'), tier: 'placeholder', alt: { en: 'Four-pole RCCB' } },
  pf16: { src: f('07-product-samples/pf-16-distribution-board'), tier: 'placeholder', alt: { en: 'Distribution board with breakers' } },
  pf17: { src: f('07-product-samples/pf-17-isolator'), tier: 'placeholder', alt: { en: 'Two-pole isolator' } },
  pf18: { src: f('07-product-samples/pf-18-street-light-control-panel'), tier: 'placeholder', alt: { en: 'Outdoor street-light control panel' } },
  // 08 Partners
  ptn01: { src: f('08-partners/ptn-01-dealer-counter'), tier: 'illustrative', alt: { en: 'A neatly organised electrical shop counter and shelves.' } },
  ptn02: { src: f('08-partners/ptn-02-electrician-toolkit'), tier: 'illustrative', alt: { en: 'An electrician’s tools neatly arranged on a table.' } },
  ptn03: { src: f('08-partners/ptn-03-project-site-supply'), tier: 'illustrative', alt: { en: 'Wire coils and a distribution board on a building site.' } },
  // 09 Downloads
  dl01: { src: f('09-downloads/dl-01-documents-mockup'), tier: 'brand', alt: { en: 'Product catalogue, company profile and datasheet.' } },
  // 10 Directors
  dir01: { src: f('10-directors/dir-01-yy-singh-director-portrait'), tier: 'portrait', alt: { en: 'YY Singh, Director, Ecorayy Power Tech.', hi: 'YY Singh, निदेशक, Ecorayy Power Tech.' } },
  dir02: { src: f('10-directors/dir-02-rama-yadav-director-portrait'), tier: 'portrait', alt: { en: 'Rama Yadav, Director, Ecorayy Power Tech.', hi: 'Rama Yadav, निदेशक, Ecorayy Power Tech.' } },
  dir01c: { src: f('10-directors/dir-01-yy-singh-circle'), tier: 'portrait', alt: { en: 'YY Singh, Director', hi: 'YY Singh, निदेशक' } },
  dir02c: { src: f('10-directors/dir-02-rama-yadav-circle'), tier: 'portrait', alt: { en: 'Rama Yadav, Director', hi: 'Rama Yadav, निदेशक' } },
  // 11 Certificates (real documents, published deliberately; no personal data)
  cert01: { src: f('11-certificates/dpiit-recognition-certificate'), tier: 'brand', alt: { en: 'DPIIT Certificate of Recognition issued to Ecorayy Power Tech Private Limited, certificate number DIPP284762, valid up to 23 June 2036.', hi: 'Ecorayy Power Tech Private Limited को जारी DPIIT मान्यता प्रमाणपत्र, प्रमाणपत्र संख्या DIPP284762, 23 जून 2036 तक मान्य।' } },
} satisfies Record<string, Img>;

export type ImageId = keyof typeof images;
