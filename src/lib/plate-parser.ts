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

export function parsePlateNumberInput(val: string): {
  seriesNumber: string;
  plateNumber: string;
  formattedNumber: string;
} {
  const converted = convertToBengaliDigits(val.trim());
  if (!converted) {
    return { seriesNumber: "", plateNumber: "", formattedNumber: "" };
  }

  // If input contains hyphen or space: e.g. "১৩-১২৩৪" or "১৩ ১২৩৪"
  const parts = converted.split(/[-\s]+/).filter(Boolean);
  if (parts.length >= 2) {
    const s = parts[0];
    const n = parts.slice(1).join("");
    return {
      seriesNumber: s,
      plateNumber: n,
      formattedNumber: `${s}-${n}`,
    };
  }

  // Single string of digits
  const digitsOnly = converted.replace(/[^০-৯0-9]/g, "");
  if (digitsOnly.length >= 5) {
    // 5 or 6 digits total: first 2 digits are series number, remaining are plate number
    const s = digitsOnly.slice(0, 2);
    const n = digitsOnly.slice(2);
    return {
      seriesNumber: s,
      plateNumber: n,
      formattedNumber: `${s}-${n}`,
    };
  }

  // 1-4 digits: e.g. "১২৩৪" (4-digit plate) or partial input
  return {
    seriesNumber: "",
    plateNumber: digitsOnly,
    formattedNumber: digitsOnly,
  };
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

export function convertToBengaliLetter(input: string): string {
  const clean = input.trim().toLowerCase();
  if (LETTER_LOOKUP[clean]) {
    return LETTER_LOOKUP[clean];
  }
  const bMatch = input.match(/[কখগঘঙচছজঝটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়]/);
  if (bMatch) {
    return bMatch[0];
  }
  return input;
}

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
  const BENGALI_CITIES: [string, string][] = [
    ["ঢাকা মেট্রো", "ঢাকা মেট্রো"],
    ["ঢাকা", "ঢাকা মেট্রো"],
    ["চট্টগ্রাম মেট্রো", "চট্টগ্রাম মেট্রো"],
    ["চট্টগ্রাম", "চট্টগ্রাম মেট্রো"],
    ["সিলেট মেট্রো", "সিলেট মেট্রো"],
    ["সিলেট", "সিলেট মেট্রো"],
    ["রাজশাহী মেট্রো", "রাজশাহী মেট্রো"],
    ["রাজশাহী", "রাজশাহী মেট্রো"],
    ["খুলনা মেট্রো", "খুলনা মেট্রো"],
    ["খুলনা", "খুলনা মেট্রো"],
    ["বরিশাল মেট্রো", "বরিশাল মেট্রো"],
    ["বরিশাল", "বরিশাল মেট্রো"],
    ["রংপুর মেট্রো", "রংপুর মেট্রো"],
    ["রংপুর", "রংপুর মেট্রো"],
    ["ময়মনসিংহ মেট্রো", "ময়মনসিংহ মেট্রো"],
    ["ময়মনসিংহ", "ময়মনসিংহ মেট্রো"],
    ["গাজীপুর", "গাজীপুর"],
    ["নারায়ণগঞ্জ", "নারায়ণগঞ্জ"],
    ["কুমিল্লা", "কুমিল্লা"],
    ["যশোর", "যশোর"],
    ["বগুড়া", "বগুড়া"],
    ["পাবনা", "পাবনা"],
    ["টাঙ্গাইল", "টাঙ্গাইল"],
    ["ফরিদপুর", "ফরিদপুর"],
    ["কুষ্টিয়া", "কুষ্টিয়া"],
    ["নোয়াখালী", "নোয়াখালী"],
    ["দিনাজপুর", "দিনাজপুর"],
    ["কক্সবাজার", "কক্সবাজার"],
  ];
  for (const [key, standardCity] of BENGALI_CITIES) {
    if (clean.includes(key)) {
      result.metroCity = standardCity;
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
  // Strip out the detected city name from the string to prevent matching letters inside city name
  let stringWithoutCity = clean;
  if (result.metroCity) {
    stringWithoutCity = stringWithoutCity.replace(result.metroCity, "");
  }
  stringWithoutCity = stringWithoutCity.replace(
    /ঢাকা|চট্টগ্রাম|সিলেট|রাজশাহী|খুলনা|বরিশাল|রংপুর|ময়মনসিংহ|গাজীপুর|নারায়ণগঞ্জ|মেট্রো|dhaka|metro|dhk|ctg|chattogram|chittagong|sylhet|rajshahi|khulna|barishal|barisal|rangpur|mymensingh|gazipur|narayanganj/gi,
    ""
  );

  // Check for Bengali letter inside remaining string
  const bLetterMatch = stringWithoutCity.match(/([কখগঘঙচছজঝটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়])/);
  if (bLetterMatch) {
    result.vehicleClass = bLetterMatch[1];
  } else {
    // Check non-city parts for English letter
    const cityTokens = new Set([
      "dhaka",
      "metro",
      "dhk",
      "ctg",
      "chattogram",
      "chittagong",
      "sylhet",
      "rajshahi",
      "khulna",
      "barishal",
      "barisal",
      "rangpur",
      "mymensingh",
      "gazipur",
      "narayanganj",
    ]);
    for (const part of parts) {
      if (!cityTokens.has(part) && LETTER_LOOKUP[part]) {
        result.vehicleClass = LETTER_LOOKUP[part];
        break;
      }
    }
  }

  return result;
}

export interface PlateDisplayData {
  city?: string;
  vehicleClass?: string;
  series?: string;
  number?: string;
  rawText?: string;
  isStructured: boolean;
}

export function getPlateDisplaySegments(raw?: string): PlateDisplayData {
  if (!raw || !raw.trim()) {
    return {
      city: "ঢাকা মেট্রো",
      vehicleClass: "ল",
      series: "১১",
      number: "১২৩৪",
      isStructured: true,
    };
  }

  const clean = raw.trim();
  const parsed = parseQuickPlateString(clean);

  const hasAnyParsed = Boolean(
    parsed.metroCity || parsed.vehicleClass || parsed.seriesNumber || parsed.plateNumber
  );

  if (hasAnyParsed) {
    return {
      city: parsed.metroCity,
      vehicleClass: parsed.vehicleClass,
      series: parsed.seriesNumber,
      number: parsed.plateNumber,
      isStructured: true,
    };
  }

  // Fallback for custom free-form text:
  return {
    rawText: convertToBengaliDigits(clean).replace(/-/g, " - "),
    isStructured: false,
  };
}
