import type { Lang } from '../../data/site';

/** The five solar steps (strategy §10.1). Durations are omitted until
 *  operations confirms them (checklist D3). */
export function solarSteps(lang: Lang) {
  const hi = lang === 'hi';
  return [
    {
      icon: 'map-pin',
      title: hi ? 'साइट सर्वे' : 'Site survey',
      text: hi ? 'हम छत, छाया, दिशा, बिजली कनेक्शन और आपका बिल देखते हैं।' : 'We check the roof, shade, direction, your electricity connection and your bill.',
      who: hi ? 'Ecorayy टीम' : 'Ecorayy team',
      you: hi ? 'बिल और छत तक पहुँच' : 'Share a bill, give roof access',
    },
    {
      icon: 'ruler',
      title: hi ? 'सिस्टम डिज़ाइन' : 'System design',
      text: hi ? 'पैनल लेआउट, इन्वर्टर का साइज़ और ढाँचा, लिखित प्रस्ताव के साथ।' : 'Panel layout, inverter size and structure, in a written proposal.',
      who: hi ? 'Ecorayy इंजीनियर' : 'Ecorayy engineer',
      you: hi ? 'प्रस्ताव मंज़ूर करें' : 'Approve the proposal',
    },
    {
      icon: 'tool',
      title: hi ? 'इंस्टॉलेशन' : 'Installation',
      text: hi ? 'ढाँचा, पैनल, इन्वर्टर, वायरिंग और सुरक्षा उपकरण लगाए जाते हैं और जाँचे जाते हैं।' : 'Structure, panels, inverter, wiring and protection are installed and tested.',
      who: hi ? 'इंस्टॉलेशन टीम' : 'Installation team',
      you: hi ? 'पहुँच और जगह' : 'Access to the site',
    },
    {
      icon: 'document',
      title: hi ? 'नेट मीटर आवेदन' : 'Net-meter application',
      text: hi ? 'आपकी बिजली वितरण कंपनी (DISCOM) में आवेदन, ताकि अतिरिक्त बिजली ग्रिड में जाए।' : 'Application to your electricity distribution company (DISCOM), so surplus power is exported.',
      who: hi ? 'Ecorayy (आपकी ओर से)' : 'Ecorayy, for you',
      you: hi ? 'दस्तावेज़ पर हस्ताक्षर' : 'Sign the documents',
    },
    {
      icon: 'shield-check',
      title: hi ? 'सेवा और निगरानी' : 'Service & monitoring',
      text: hi ? 'सिस्टम की निगरानी, सफ़ाई की सलाह और ज़रूरत पड़ने पर सर्विस।' : 'Monitoring, cleaning guidance and service when you need it.',
      who: hi ? 'Ecorayy सहायता' : 'Ecorayy support',
      you: hi ? 'पैनल साफ़ रखें' : 'Keep panels clean',
    },
  ];
}
