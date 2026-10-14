import type { ImageId } from './images';
import type { T } from './site';

export type MegaItem = { label: T; desc: T; href: string; icon: string; image: ImageId };
export type NavEntry = {
  key: string;
  label: T;
  href: string;
  mega?: { items: MegaItem[]; overview: T; foot: { label: T; href: string; icon: string } };
};

export const nav: NavEntry[] = [
  {
    key: 'solar',
    label: { en: 'Solar', hi: 'सोलर' },
    href: '/solar/',
    mega: {
      overview: { en: 'All of Solar', hi: 'पूरा सोलर सेक्शन' },
      items: [
        { label: { en: 'Solar for homes', hi: 'घरों के लिए सोलर' }, desc: { en: 'Rooftop systems, sized to your bill', hi: 'आपके बिल के अनुसार रूफ़टॉप सिस्टम' }, href: '/solar/homes/', icon: 'home', image: 'sol02' },
        { label: { en: 'Businesses & institutions', hi: 'व्यवसाय और संस्थान' }, desc: { en: 'Factories, schools, hospitals, storage', hi: 'फ़ैक्ट्री, स्कूल, अस्पताल, कोल्ड स्टोरेज' }, href: '/solar/business/', icon: 'factory', image: 'sol03' },
        { label: { en: 'Solar parks & EPC', hi: 'सोलर पार्क और EPC' }, desc: { en: 'Design to commissioning', hi: 'डिज़ाइन से कमीशनिंग तक' }, href: '/solar/parks-epc/', icon: 'grid', image: 'sol04' },
        { label: { en: 'Solar pumps', hi: 'सोलर पंप' }, desc: { en: 'Irrigation without diesel', hi: 'बिना डीज़ल के सिंचाई' }, href: '/solar/pumps/', icon: 'droplet', image: 'sol05' },
        { label: { en: 'How a solar project works', hi: 'सोलर प्रोजेक्ट कैसे होता है' }, desc: { en: 'Survey → install → net meter', hi: 'सर्वे → इंस्टॉल → नेट मीटर' }, href: '/solar/how-it-works/', icon: 'route', image: 'sol01' },
        { label: { en: 'Solar savings estimator', hi: 'सोलर बचत अनुमान' }, desc: { en: 'See your size, cost and savings', hi: 'साइज़, लागत और बचत देखें' }, href: '/solar/estimator/', icon: 'calculator', image: 'sol02' },
      ],
      foot: { label: { en: 'Book a free site survey', hi: 'मुफ़्त साइट सर्वे बुक करें' }, href: '/quote/?intent=solar', icon: 'calendar' },
    },
  },
  {
    key: 'infrastructure',
    label: { en: 'Infrastructure', hi: 'इन्फ्रास्ट्रक्चर' },
    href: '/infrastructure/',
    mega: {
      overview: { en: 'All of Infrastructure', hi: 'पूरा इन्फ्रास्ट्रक्चर' },
      items: [
        { label: { en: 'Street & highway lighting', hi: 'स्ट्रीट और हाईवे लाइटिंग' }, desc: { en: 'LED, solar and smart lighting', hi: 'LED, सोलर और स्मार्ट लाइटिंग' }, href: '/infrastructure/street-highway-lighting/', icon: 'street-light', image: 'inf02' },
        { label: { en: 'Public & decorative lighting', hi: 'सार्वजनिक और सजावटी लाइटिंग' }, desc: { en: 'Parks, promenades, civic spaces', hi: 'पार्क, घाट, सार्वजनिक स्थान' }, href: '/infrastructure/public-decorative-lighting/', icon: 'lamp', image: 'inf03' },
        { label: { en: 'Traffic & electrical signals', hi: 'ट्रैफ़िक और विद्युत सिग्नल' }, desc: { en: 'Junctions and road safety', hi: 'चौराहे और सड़क सुरक्षा' }, href: '/infrastructure/traffic-signals/', icon: 'traffic', image: 'inf04' },
        { label: { en: 'Rural electrification & smart city', hi: 'ग्रामीण विद्युतीकरण और स्मार्ट सिटी' }, desc: { en: 'Villages, towns and campuses', hi: 'गाँव, कस्बे और परिसर' }, href: '/infrastructure/rural-smart-city/', icon: 'village', image: 'inf05' },
        { label: { en: 'Government & tenders', hi: 'सरकारी और टेंडर' }, desc: { en: 'Registrations, eligibility, profile', hi: 'पंजीकरण, पात्रता, प्रोफ़ाइल' }, href: '/infrastructure/government-tenders/', icon: 'landmark', image: 'dl01' },
      ],
      foot: { label: { en: 'Company profile (PDF)', hi: 'कंपनी प्रोफ़ाइल (PDF)' }, href: '/downloads/#company', icon: 'download' },
    },
  },
  {
    key: 'products',
    label: { en: 'Products', hi: 'उत्पाद' },
    href: '/products/',
    mega: {
      overview: { en: 'All products', hi: 'सभी उत्पाद' },
      items: [
        { label: { en: 'Solar equipment', hi: 'सोलर उपकरण' }, desc: { en: 'Modules, inverters, batteries', hi: 'मॉड्यूल, इन्वर्टर, बैटरी' }, href: '/products/solar-equipment/', icon: 'solar-panel', image: 'prd01' },
        { label: { en: 'Lighting', hi: 'लाइटिंग' }, desc: { en: 'Bulbs, battens, street & flood', hi: 'बल्ब, बैटन, स्ट्रीट और फ़्लड' }, href: '/products/lighting/', icon: 'bulb', image: 'prd02' },
        { label: { en: 'Switches & sockets', hi: 'स्विच और सॉकेट' }, desc: { en: 'Modular range', hi: 'मॉड्यूलर रेंज' }, href: '/products/switches-sockets/', icon: 'switch', image: 'prd03' },
        { label: { en: 'Wires & cables', hi: 'तार और केबल' }, desc: { en: 'House wire, solar DC cable', hi: 'हाउस वायर, सोलर DC केबल' }, href: '/products/wires-cables/', icon: 'cable', image: 'prd04' },
        { label: { en: 'Switchgear & panels', hi: 'स्विचगियर और पैनल' }, desc: { en: 'MCB, RCCB, DB, control panels', hi: 'MCB, RCCB, DB, कंट्रोल पैनल' }, href: '/products/switchgear-panels/', icon: 'breaker', image: 'prd05' },
      ],
      foot: { label: { en: 'Product catalogue (PDF)', hi: 'उत्पाद कैटलॉग (PDF)' }, href: '/downloads/#products', icon: 'download' },
    },
  },
  { key: 'partners', label: { en: 'Partners', hi: 'पार्टनर' }, href: '/partners/' },
  { key: 'about', label: { en: 'About', hi: 'हमारे बारे में' }, href: '/about/' },
  { key: 'contact', label: { en: 'Contact', hi: 'संपर्क' }, href: '/contact/' },
];

export const footerCols: { title: T; links: { label: T; href: string }[] }[] = [
  {
    title: { en: 'Solar', hi: 'सोलर' },
    links: [
      { label: { en: 'Homes', hi: 'घर' }, href: '/solar/homes/' },
      { label: { en: 'Businesses & institutions', hi: 'व्यवसाय और संस्थान' }, href: '/solar/business/' },
      { label: { en: 'Parks & EPC', hi: 'पार्क और EPC' }, href: '/solar/parks-epc/' },
      { label: { en: 'Pumps', hi: 'पंप' }, href: '/solar/pumps/' },
      { label: { en: 'How it works', hi: 'कैसे काम होता है' }, href: '/solar/how-it-works/' },
      { label: { en: 'Savings estimator', hi: 'बचत अनुमान' }, href: '/solar/estimator/' },
    ],
  },
  {
    title: { en: 'Infrastructure', hi: 'इन्फ्रास्ट्रक्चर' },
    links: [
      { label: { en: 'Street & highway', hi: 'स्ट्रीट और हाईवे' }, href: '/infrastructure/street-highway-lighting/' },
      { label: { en: 'Public & decorative', hi: 'सार्वजनिक और सजावटी' }, href: '/infrastructure/public-decorative-lighting/' },
      { label: { en: 'Traffic signals', hi: 'ट्रैफ़िक सिग्नल' }, href: '/infrastructure/traffic-signals/' },
      { label: { en: 'Rural & smart city', hi: 'ग्रामीण और स्मार्ट सिटी' }, href: '/infrastructure/rural-smart-city/' },
      { label: { en: 'Government & tenders', hi: 'सरकारी और टेंडर' }, href: '/infrastructure/government-tenders/' },
    ],
  },
  {
    title: { en: 'Products', hi: 'उत्पाद' },
    links: [
      { label: { en: 'Solar equipment', hi: 'सोलर उपकरण' }, href: '/products/solar-equipment/' },
      { label: { en: 'Lighting', hi: 'लाइटिंग' }, href: '/products/lighting/' },
      { label: { en: 'Switches & sockets', hi: 'स्विच और सॉकेट' }, href: '/products/switches-sockets/' },
      { label: { en: 'Wires & cables', hi: 'तार और केबल' }, href: '/products/wires-cables/' },
      { label: { en: 'Switchgear & panels', hi: 'स्विचगियर और पैनल' }, href: '/products/switchgear-panels/' },
    ],
  },
  {
    title: { en: 'Company', hi: 'कंपनी' },
    links: [
      { label: { en: 'About', hi: 'हमारे बारे में' }, href: '/about/' },
      { label: { en: 'How we work', hi: 'हम कैसे काम करते हैं' }, href: '/about/how-we-work/' },
      { label: { en: 'Leadership', hi: 'नेतृत्व' }, href: '/about/team/' },
      { label: { en: 'Registrations & licences', hi: 'पंजीकरण और लाइसेंस' }, href: '/about/registrations/' },
      { label: { en: 'Partners', hi: 'पार्टनर' }, href: '/partners/' },
      { label: { en: 'Downloads', hi: 'डाउनलोड' }, href: '/downloads/' },
    ],
  },
  {
    title: { en: 'Help', hi: 'सहायता' },
    links: [
      { label: { en: 'Contact', hi: 'संपर्क' }, href: '/contact/' },
      { label: { en: 'Warranty', hi: 'वारंटी' }, href: '/warranty/' },
      { label: { en: 'Support & FAQs', hi: 'सहायता और प्रश्न' }, href: '/support/' },
      { label: { en: 'Grievance officer', hi: 'शिकायत अधिकारी' }, href: '/grievance/' },
    ],
  },
];

/** Which nav section a path belongs to (for the green "you are here" triangle). */
export function sectionOf(path: string): string | undefined {
  const p = path.replace(/^\/hi(?=\/)/, '');
  if (p.startsWith('/solar')) return 'solar';
  if (p.startsWith('/infrastructure')) return 'infrastructure';
  if (p.startsWith('/products')) return 'products';
  if (p.startsWith('/partners')) return 'partners';
  if (p.startsWith('/about')) return 'about';
  if (p.startsWith('/contact')) return 'contact';
  return undefined;
}
