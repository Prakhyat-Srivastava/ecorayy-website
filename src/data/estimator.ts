/**
 * SAMPLE estimator assumptions, NOT for real decisions (checklist D4).
 * Replace with figures your team signs off, with the source and the date
 * they were last checked. The UI shows every one of these to the visitor.
 */
export const ESTIMATOR = {
  sample: true,
  lastChecked: '- (sample values)',
  states: [
    { id: 'UP', en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', tariff: 6.5, gen: 4.2 },
    { id: 'DL', en: 'Delhi', hi: 'दिल्ली', tariff: 6.0, gen: 4.3 },
    { id: 'HR', en: 'Haryana', hi: 'हरियाणा', tariff: 6.5, gen: 4.5 },
    { id: 'RJ', en: 'Rajasthan', hi: 'राजस्थान', tariff: 6.8, gen: 5.0 },
    { id: 'MP', en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', tariff: 6.6, gen: 4.6 },
    { id: 'BR', en: 'Bihar', hi: 'बिहार', tariff: 7.0, gen: 4.2 },
    { id: 'UK', en: 'Uttarakhand', hi: 'उत्तराखंड', tariff: 5.5, gen: 4.0 },
    { id: 'OT', en: 'Other state', hi: 'अन्य राज्य', tariff: 6.5, gen: 4.3 },
  ],
  buildings: [
    { id: 'home', en: 'Home', hi: 'घर', costMin: 55000, costMax: 65000 },
    { id: 'business', en: 'Shop, office or factory', hi: 'दुकान, ऑफ़िस या फ़ैक्ट्री', costMin: 45000, costMax: 55000 },
    { id: 'institution', en: 'School, hospital or institution', hi: 'स्कूल, अस्पताल या संस्थान', costMin: 45000, costMax: 55000 },
  ],
  sqftPerKw: 100,
  minKw: 1,
  stepKw: 0.5,
} as const;
