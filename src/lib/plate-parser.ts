// English to Bengali digit map
const DIGIT_MAP: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

export function convertToBengaliDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => DIGIT_MAP[d] || d);
}

const CITY_LOOKUP: Record<string, string> = {
  dhaka: "ঢাকা মেট্রো",
  "dhaka metro": "ঢাকা মেট্রো",
  dhk: "ঢাকা মেট্রো",
  ctg: "চট্টগ্রাম মেট্রো",
  chattogram: "চট্টগ্রাম মেট্রো",
  chittagong: "চট্টগ্রাম মেট্রো",
  sylhet: "সিলেট মেট্রো",
  rajshahi: "রাজশাহী মেট্রো",
  khulna: "খুলনা মেট্রো",
  barishal: "বরিশাল মেট্রো",
  barisal: "বরিশাল মেট্রো",
  rangpur: "রংপুর মেট্রো",
  mymensingh: "ময়মনসিংহ মেট্রো",
  gazipur: "গাজীপুর",
  narayanganj: "নারায়ণগঞ্জ",
  cumilla: "কুমিল্লা",
  comilla: "কুমিল্লা",
  jessore: "যশোর",
  jashore: "যশোর",
  bogra: "বগুড়া",
  bogura: "বগুড়া",
  pabna: "পাবনা",
  tangail: "টাঙ্গাইল",
  faridpur: "ফরিদপুর",
  kushtia: "কুষ্টিয়া",
  noakhali: "নোয়াখালী",
  dinajpur: "দিনাজপুর",
  coxsbazar: "কক্সবাজার",
};

const LETTER_LOOKUP: Record<string, string> = {
  la: "ল",
  l: "ল",
  ha: "হ",
  h: "হ",
  ka: "ক",
  k: "ক",
  kha: "খ",
  kh: "খ",
  ga: "গ",
  g: "গ",
  gha: "ঘ",
  gh: "ঘ",
  cha: "চ",
  ch: "চ",
  chha: "ছ",
  ja: "জ",
  j: "জ",
  jha: "ঝ",
  jh: "ঝ",
  ta: "ট",
  t: "ট",
  tha: "ঠ",
  da: "ড",
  dha: "ঢ",
  to: "ত",
  tho: "থ",
  th: "থ",
  do: "দ",
  d: "দ",
  dho: "ধ",
  dh: "ধ",
  na: "ন",
  n: "ন",
  pa: "প",
  p: "প",
  fa: "ফ",
  f: "ফ",
  ba: "ব",
  b: "ব",
  bha: "ভ",
  bh: "ভ",
  ma: "ম",
  m: "ম",
  ya: "য",
  y: "য",
  ra: "র",
  r: "র",
  sha: "শ",
  sh: "শ",
  sa: "স",
  s: "স",
};

export function parseQuickPlateString(raw: string): {
  metroCity?: string;
  vehicleClass?: string;
  seriesNumber?: string;
  plateNumber?: string;
} {
  const clean = raw.trim();
  if (!clean) return {};

  const result: {
    metroCity?: string;
    vehicleClass?: string;
    seriesNumber?: string;
    plateNumber?: string;
  } = {};

  // Standardize hyphens and spaces
  const normalized = clean
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const parts = normalized.split(" ");

  // 1. Detect City
  for (const [key, bengaliCity] of Object.entries(CITY_LOOKUP)) {
    if (normalized.includes(key)) {
      result.metroCity = bengaliCity;
      break;
    }
  }

  // Also check if city is in Bengali directly
  const bengaliCities = [
    "ঢাকা মেট্রো",
    "চট্টগ্রাম মেট্রো",
    "সিলেট মেট্রো",
    "রাজশাহী মেট্রো",
    "খুলনা মেট্রো",
    "বরিশাল মেট্রো",
    "রংপুর মেট্রো",
    "ময়মনসিংহ মেট্রো",
    "গাজীপুর",
    "নারায়ণগঞ্জ",
    "কুমিল্লা",
    "যশোর",
    "বগুড়া",
    "পাবনা",
  ];
  for (const bc of bengaliCities) {
    if (clean.includes(bc)) {
      result.metroCity = bc;
      break;
    }
  }

  // 2. Extract digits
  // Find all numbers in the string
  const digitsMatch = clean.match(/([0-9০-৯]+)/g);
  if (digitsMatch) {
    if (digitsMatch.length >= 2) {
      result.seriesNumber = convertToBengaliDigits(digitsMatch[digitsMatch.length - 2]);
      result.plateNumber = convertToBengaliDigits(digitsMatch[digitsMatch.length - 1]);
    } else if (digitsMatch.length === 1) {
      const numStr = digitsMatch[0];
      if (numStr.length >= 6) {
        result.seriesNumber = convertToBengaliDigits(numStr.slice(0, 2));
        result.plateNumber = convertToBengaliDigits(numStr.slice(2));
      } else {
        result.plateNumber = convertToBengaliDigits(numStr);
      }
    }
  }

  // 3. Extract letter class
  // Strip out the detected city name from the string to prevent matching letters inside city name (e.g. 'ঢ' in 'ঢাকা')
  let stringWithoutCity = clean;
  if (result.metroCity) {
    stringWithoutCity = stringWithoutCity.replace(result.metroCity, "");
    stringWithoutCity = stringWithoutCity.replace(/ঢাকা|চট্টগ্রাম|সিলেট|রাজশাহী|খুলনা|বরিশাল|রংপুর|ময়মনসিংহ|গাজীপুর|নারায়ণগঞ্জ|মেট্রো/g, "");
  }

  // Check for Bengali letter inside remaining string
  const bLetterMatch = stringWithoutCity.match(/([কখগঘঙচছজঝটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়])/);
  if (bLetterMatch) {
    result.vehicleClass = bLetterMatch[1];
  } else {
    // Check parts for English letter
    for (const part of parts) {
      if (LETTER_LOOKUP[part]) {
        result.vehicleClass = LETTER_LOOKUP[part];
        break;
      }
    }
  }

  return result;
}
