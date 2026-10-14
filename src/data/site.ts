/**
 * Company facts and contact details.
 *
 * REAL = verified from the company's own documents (MCA, GST, Udyam, DPIIT).
 * SAMPLE = temporary values. Every sample value carries `sample: true` and is
 * rendered with a `data-sample` attribute so `npm run check:launch` can find it.
 * Replace via planning/02_Content_Update_Checklist.md.
 */

export type Lang = 'en' | 'hi';
export type T = { en: string; hi?: string };

export const SITE_MODE = (import.meta.env.PUBLIC_SITE_MODE ?? 'preview') as 'preview' | 'production';
export const IS_PREVIEW = SITE_MODE !== 'production';

// ---------------------------------------------------------------- REAL facts
export const company = {
  name: 'Ecorayy',
  legalName: 'ECORAYY POWER TECH PRIVATE LIMITED',
  legalNameTitle: 'Ecorayy Power Tech Private Limited',
  tagline: { en: 'Brighter tomorrow together', hi: 'उज्ज्वल कल, साथ मिलकर' },
  cin: 'U35105UP2026PTC249351',
  incorporatedISO: '2026-06-24',
  incorporated: { en: '24 June 2026', hi: '24 जून 2026' },
  roc: 'ROC Uttar Pradesh I',
  gstin: '09AAJCE7875P2ZI',
  udyam: 'UDYAM-UP-23-0040614',
  udyamType: { en: 'Micro enterprise', hi: 'सूक्ष्म उद्यम' },
  dpiit: {
    number: 'DIPP284762',
    issued: { en: '24 September 2026', hi: '24 सितंबर 2026' },
    validTo: { en: '23 June 2036', hi: '23 जून 2036' },
    sectors: { en: 'Renewable Energy; Manufacture of Electrical Equipment', hi: 'नवीकरणीय ऊर्जा; विद्युत उपकरण निर्माण' },
  },
  // Checklist A4: the "C/O" line is intentionally omitted until confirmed.
  registeredOffice: {
    street: 'Narayan Nagar, Ushra Adda Road',
    city: 'Etawah',
    state: 'Uttar Pradesh',
    pin: '206001',
    oneLine: 'Narayan Nagar, Ushra Adda Road, Etawah, Uttar Pradesh 206001',
    // Address kept in English on Hindi pages until a verified Hindi spelling is provided.
  },
} as const;

export type Registration = {
  key: 'cin' | 'gstin' | 'udyam' | 'dpiit';
  short: string;
  label: T;
  value: string;
  meta: T;
  issuer: T;
  steps: { en: string[]; hi: string[] };
  portal: { label: string; href: string };
};

export const registrations: Registration[] = [
  {
    key: 'cin',
    short: 'CIN',
    label: { en: 'Corporate Identification Number', hi: 'कॉर्पोरेट पहचान संख्या (CIN)' },
    value: company.cin,
    meta: { en: 'Incorporated 24 June 2026 · ROC Uttar Pradesh I', hi: 'निगमन 24 जून 2026 · आरओसी उत्तर प्रदेश I' },
    issuer: { en: 'Ministry of Corporate Affairs', hi: 'कॉर्पोरेट कार्य मंत्रालय' },
    steps: {
      en: ['Open the MCA portal.', 'Go to MCA Services → Master Data → View Company or LLP Master Data.', `Enter the CIN ${company.cin}.`],
      hi: ['MCA पोर्टल खोलें।', 'MCA Services → Master Data → View Company or LLP Master Data पर जाएँ।', `CIN ${company.cin} दर्ज करें।`],
    },
    portal: { label: 'mca.gov.in', href: 'https://www.mca.gov.in/' },
  },
  {
    key: 'gstin',
    short: 'GSTIN',
    label: { en: 'GST Identification Number', hi: 'जीएसटी पहचान संख्या (GSTIN)' },
    value: company.gstin,
    meta: { en: 'State code 09 · Uttar Pradesh', hi: 'राज्य कोड 09 · उत्तर प्रदेश' },
    issuer: { en: 'Goods and Services Tax Network', hi: 'जीएसटी नेटवर्क' },
    steps: {
      en: ['Open the GST portal.', 'Choose Search Taxpayer → Search by GSTIN/UIN.', `Enter ${company.gstin}.`],
      hi: ['GST पोर्टल खोलें।', 'Search Taxpayer → Search by GSTIN/UIN चुनें।', `${company.gstin} दर्ज करें।`],
    },
    portal: { label: 'gst.gov.in', href: 'https://www.gst.gov.in/' },
  },
  {
    key: 'udyam',
    short: 'Udyam',
    label: { en: 'Udyam Registration (MSME)', hi: 'उद्यम पंजीकरण (MSME)' },
    value: company.udyam,
    meta: { en: 'Micro enterprise', hi: 'सूक्ष्म उद्यम' },
    issuer: { en: 'Ministry of MSME', hi: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय' },
    steps: {
      en: ['Open the Udyam Registration portal.', 'Choose Print / Verify → Verify Udyam Registration Number.', `Enter ${company.udyam}.`],
      hi: ['उद्यम पंजीकरण पोर्टल खोलें।', 'Print / Verify → Verify Udyam Registration Number चुनें।', `${company.udyam} दर्ज करें।`],
    },
    portal: { label: 'udyamregistration.gov.in', href: 'https://udyamregistration.gov.in/' },
  },
  {
    key: 'dpiit',
    short: 'DPIIT',
    label: { en: 'DPIIT startup recognition', hi: 'DPIIT स्टार्टअप मान्यता' },
    value: company.dpiit.number,
    meta: { en: 'Issued 24 Sep 2026 · valid to 23 Jun 2036', hi: 'जारी 24 सितंबर 2026 · 23 जून 2036 तक मान्य' },
    issuer: { en: 'DPIIT, Ministry of Commerce & Industry', hi: 'DPIIT, वाणिज्य एवं उद्योग मंत्रालय' },
    steps: {
      en: ['Scan the “Scan to Verify” QR code on the certificate (shown on our Registrations page), or', 'search for the company on the Startup India portal.'],
      hi: ['प्रमाणपत्र पर दिए “Scan to Verify” QR कोड को स्कैन करें (हमारे पंजीकरण पेज पर उपलब्ध), या', 'Startup India पोर्टल पर कंपनी खोजें।'],
    },
    portal: { label: 'startupindia.gov.in', href: 'https://www.startupindia.gov.in/' },
  },
];

// -------------------------------------------------------------- SAMPLE contact
// Checklist B1–B12. The placeholder number and .example domain can never
// reach a real person, and they are deliberately not clickable.
export const contact = {
  sample: true,
  phoneDisplay: '+91 00000 00000',
  phoneHref: null as string | null, // e.g. 'tel:+919XXXXXXXXX'
  whatsappHref: null as string | null, // e.g. 'https://wa.me/919XXXXXXXXX'
  email: 'ecorayypowertech@gmail.com', // REAL (provided by the company)
  emailHref: 'mailto:ecorayypowertech@gmail.com' as string | null,
  hours: { en: 'Mon–Sat, 10:00 am – 6:00 pm', hi: 'सोम–शनि, सुबह 10:00 – शाम 6:00' },
  hoursShort: { en: 'Mon–Sat 10–6', hi: 'सोम–शनि 10–6' },
  hoursSpec: { days: [1, 2, 3, 4, 5, 6], open: 10, close: 18 },
  responsePromise: {
    en: 'We reply to every enquiry within one working day.',
    hi: 'हम हर पूछताछ का जवाब एक कार्यदिवस में देते हैं।',
  },
} as const;

// ------------------------------------------------------- Vision and motto (REAL)
// Provided by the company. Soldier welfare is stated as an aspiration only:
// do not describe specific initiatives until they actually exist.
export const motto = [
  { en: 'Powering the Nation.', hi: 'राष्ट्र को ऊर्जा।', icon: 'bolt' },
  { en: 'Honouring Our Heroes.', hi: 'वीरों को सम्मान।', icon: 'shield-check' },
  { en: 'Illuminating the Future.', hi: 'भविष्य को प्रकाश।', icon: 'sun' },
] as const;

export const vision = {
  title: { en: 'Powering progress, honouring our heroes', hi: 'प्रगति को ऊर्जा, वीरों को सम्मान' },
  intro: {
    en: 'We envision a future where technology, sustainability and social responsibility work together for the progress of our nation. As a company engaged in electrical equipment and solar energy solutions, we aspire to illuminate homes, industries and communities through reliable, energy-efficient and environmentally responsible products.',
    hi: 'हम ऐसे भविष्य की कल्पना करते हैं जहाँ तकनीक, स्थिरता और सामाजिक ज़िम्मेदारी मिलकर देश की प्रगति के लिए काम करें। विद्युत उपकरण और सौर ऊर्जा समाधानों से जुड़ी कंपनी के रूप में, हम भरोसेमंद, ऊर्जा-कुशल और पर्यावरण के प्रति ज़िम्मेदार उत्पादों से घरों, उद्योगों और समुदायों को रोशन करना चाहते हैं।',
  },
  heroes: {
    en: 'With deep respect for the brave soldiers who safeguard our country’s sovereignty and protect its citizens, we aim to make soldier welfare an integral part of our corporate vision. We aspire to contribute to the well-being of serving and retired defence personnel and their families, through meaningful initiatives, support for their communities, and opportunities that recognise their service and sacrifice.',
    hi: 'देश की संप्रभुता की रक्षा करने वाले और नागरिकों की सुरक्षा करने वाले वीर सैनिकों के प्रति गहरे सम्मान के साथ, हम सैनिक कल्याण को अपनी कॉर्पोरेट दृष्टि का अभिन्न अंग बनाना चाहते हैं। हम सेवारत और सेवानिवृत्त रक्षा कर्मियों और उनके परिवारों की भलाई में योगदान देना चाहते हैं, सार्थक पहलों, उनके समुदायों के सहयोग, और उनकी सेवा और बलिदान को सम्मान देने वाले अवसरों के माध्यम से।',
  },
  belief: {
    en: 'We believe that true progress is not measured only by the power we generate, but also by the lives we uplift.',
    hi: 'हमारा मानना है कि सच्ची प्रगति केवल उत्पन्न की गई ऊर्जा से नहीं, बल्कि उन जीवनों से भी मापी जाती है जिन्हें हम बेहतर बनाते हैं।',
  },
  close: {
    en: 'Through innovation, integrity, clean energy and a commitment to national service, Ecorayy Power Tech strives to become a trusted Indian brand that not only powers the nation but also stands with those who protect it.',
    hi: 'नवाचार, ईमानदारी, स्वच्छ ऊर्जा और राष्ट्र सेवा के संकल्प के साथ, Ecorayy Power Tech एक भरोसेमंद भारतीय ब्रांड बनने का प्रयास करती है, जो न केवल देश को ऊर्जा दे, बल्कि उसकी रक्षा करने वालों के साथ भी खड़ा रहे।',
  },
  pillars: [
    { icon: 'solar-panel', title: { en: 'Clean energy', hi: 'स्वच्छ ऊर्जा' }, text: { en: 'Reliable, energy-efficient solar and electrical products for homes, industries and communities.', hi: 'घरों, उद्योगों और समुदायों के लिए भरोसेमंद, ऊर्जा-कुशल सोलर और विद्युत उत्पाद।' } },
    { icon: 'shield-check', title: { en: 'Soldier welfare', hi: 'सैनिक कल्याण' }, text: { en: 'Standing with serving and retired defence personnel and their families.', hi: 'सेवारत और सेवानिवृत्त रक्षा कर्मियों और उनके परिवारों के साथ।' } },
    { icon: 'landmark', title: { en: 'National service', hi: 'राष्ट्र सेवा' }, text: { en: 'Innovation and integrity, in service of the nation’s progress.', hi: 'नवाचार और ईमानदारी, देश की प्रगति की सेवा में।' } },
  ],
} as const;

export const PREVIEW_NOTE = {
  en: 'Coming soon',
  hi: 'जल्द उपलब्ध',
};

// ------------------------------------------------------------------ Directors
// Names and designations are REAL. Bios are DRAFTS awaiting each Director's
// approval (checklist L5, L6). Never add any family-relationship wording.
export const directors = [
  {
    id: 'yy-singh',
    name: 'YY Singh',
    role: { en: 'Director', hi: 'निदेशक' },
    image: 'dir01',
    circle: 'dir01c',
    short: {
      en: 'More than 30 years of experience in a military environment, across inventory control, distribution and operational management.',
      hi: 'सैन्य वातावरण में 30 से अधिक वर्षों का अनुभव, इन्वेंटरी नियंत्रण, वितरण और परिचालन प्रबंधन में।',
    },
    bio: {
      en: 'YY Singh brings more than thirty years of experience from a military environment, where his work centred on inventory control, distribution, operational management and organisational coordination: keeping materials accounted for, schedules met, and teams working to a common plan. At Ecorayy, he brings that same discipline to what solar and electrical projects depend on: careful planning, reliable supply, and clear coordination from the first survey to the final handover.',
      hi: 'YY Singh सैन्य वातावरण में तीस से अधिक वर्षों का अनुभव लेकर आते हैं, जहाँ उनका काम इन्वेंटरी नियंत्रण, वितरण, परिचालन प्रबंधन और संगठनात्मक समन्वय पर केंद्रित रहा, सामग्री का पूरा हिसाब, समय पर काम, और एक साझा योजना पर चलती टीमें। Ecorayy में वे यही अनुशासन उन चीज़ों में लाते हैं जिन पर सोलर और बिजली के प्रोजेक्ट टिके होते हैं: सावधान योजना, भरोसेमंद आपूर्ति, और पहले सर्वे से अंतिम हैंडओवर तक स्पष्ट समन्वय।',
    },
  },
  {
    id: 'rama-yadav',
    name: 'Rama Yadav',
    role: { en: 'Director', hi: 'निदेशक' },
    image: 'dir02',
    circle: 'dir02c',
    short: {
      en: 'Part of the board that guides the company’s direction and the standards it holds itself to.',
      hi: 'कंपनी की दिशा और उसके मानकों का मार्गदर्शन करने वाले बोर्ड की सदस्य।',
    },
    // Option A (recommended) from plan §12.3.
    bio: {
      en: 'Rama Yadav is a Director of Ecorayy Power Tech. As a member of the company’s board, she shares responsibility for the direction Ecorayy takes and the standards it keeps: that customers are dealt with honestly, that commitments are honoured, and that every enquiry is answered by a person.',
      hi: 'Rama Yadav, Ecorayy Power Tech की निदेशक हैं। कंपनी के बोर्ड की सदस्य के रूप में वे Ecorayy की दिशा और उसके मानकों की ज़िम्मेदारी साझा करती हैं: कि ग्राहकों से ईमानदारी से व्यवहार हो, वादे निभाए जाएँ, और हर पूछताछ का जवाब एक इंसान दे।',
    },
  },
] as const;
