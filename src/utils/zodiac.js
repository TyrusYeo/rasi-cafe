// Zodiac sign determination based on birth month and day
export const getZodiacSign = (birthMonth, birthDay) => {
  const month = parseInt(birthMonth);
  const day = parseInt(birthDay);
  
  // Aries (Ram): March 21–April 19
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'Aries';
  }
  // Taurus (Bull): April 20–May 20
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'Taurus';
  }
  // Gemini (Twins): May 21–June 21
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return 'Gemini';
  }
  // Cancer (Crab): June 22–July 22
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return 'Cancer';
  }
  // Leo (Lion): July 23–August 22
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'Leo';
  }
  // Virgo (Virgin): August 23–September 22
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'Virgo';
  }
  // Libra (Balance): September 23–October 23
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return 'Libra';
  }
  // Scorpius (Scorpion): October 24–November 21
  if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) {
    return 'Scorpio';
  }
  // Sagittarius (Archer): November 22–December 21
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'Sagittarius';
  }
  // Capricornus (Goat): December 22–January 19
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'Capricorn';
  }
  // Aquarius (Water Bearer): January 20–February 18
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'Aquarius';
  }
  // Pisces (Fish): February 19–March 20
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 'Pisces';
  }
  
  return 'Unknown';
};

// Element mapping for compatibility
const zodiacElements = {
  'Aries': 'fire',
  'Leo': 'fire',
  'Sagittarius': 'fire',
  'Taurus': 'earth',
  'Virgo': 'earth',
  'Capricorn': 'earth',
  'Gemini': 'air',
  'Libra': 'air',
  'Aquarius': 'air',
  'Cancer': 'water',
  'Scorpio': 'water',
  'Pisces': 'water'
};

// Traditional compatibility rules
const compatibilityRules = {
  fire: ['fire', 'air'], // Fire signs are compatible with fire and air
  earth: ['earth', 'water'], // Earth signs are compatible with earth and water
  air: ['air', 'fire'], // Air signs are compatible with air and fire
  water: ['water', 'earth'] // Water signs are compatible with water and earth
};

// Check if two zodiac signs are compatible
export const areCompatible = (sign1, sign2) => {
  const element1 = zodiacElements[sign1];
  const element2 = zodiacElements[sign2];
  
  if (!element1 || !element2) return false;
  
  // Same element is always compatible
  if (element1 === element2) return true;
  
  // Check if elements are compatible according to traditional rules
  return compatibilityRules[element1]?.includes(element2) || 
         compatibilityRules[element2]?.includes(element1);
};

// Generate unique match code
export const generateMatchCode = (...signs) => {
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const signsString = signs.join('-');
  return `${signsString}-${randomChars}`;
};

// Month names for dropdown
export const monthNames = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

// Generate days for dropdown (1-31)
export const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push({ value: i.toString(), label: i.toString() });
  }
  return days;
}; 