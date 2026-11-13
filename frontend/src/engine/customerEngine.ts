import { Customer, CustomerArchetype, Recipe, RecipeKey, WeatherInfo } from '../types';

const ARCHETYPE_NAMES: Record<CustomerArchetype, string[]> = {
  COLLEGE_STUDENT: ['Rohan', 'Sneha', 'Kabir', 'Ananya', 'Tanya', 'Aakash'],
  IT_TECHIE: ['Vikram S.', 'Aditi K.', 'Sameer Rao', 'Divya M.', 'Karthik N.'],
  LOCAL_UNCLE: ['Sharma Ji', 'Gupta Uncle', 'Patel Kaka', 'Bose Da', 'Verma Ji'],
  COMMUTER: ['Ramesh', 'Priya', 'Deepak', 'Meena', 'Sunil', 'Vijay'],
};

export function spawnCustomer(
  _dayNumber: number,
  weather: WeatherInfo,
  unlockedRecipes: Record<RecipeKey, Recipe>,
  hasRadio: boolean,
  hasKulhad: boolean
): Customer {
  const archetypes: CustomerArchetype[] = ['COLLEGE_STUDENT', 'IT_TECHIE', 'LOCAL_UNCLE', 'COMMUTER'];
  const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];

  const namePool = ARCHETYPE_NAMES[archetype];
  const name = namePool[Math.floor(Math.random() * namePool.length)];

  // Determine available recipes to order
  const availableKeys = (Object.keys(unlockedRecipes) as RecipeKey[]).filter(
    (key) => unlockedRecipes[key].unlocked
  );

  // Preference bias based on archetype & weather
  let orderKey: RecipeKey = 'CUTTING_CHAI';

  if (weather.type === 'MONSOON' && availableKeys.includes('SAMOSA') && Math.random() < 0.4) {
    orderKey = 'SAMOSA';
  } else if (archetype === 'COLLEGE_STUDENT') {
    orderKey = Math.random() < 0.6 || !availableKeys.includes('SAMOSA') ? 'CUTTING_CHAI' : 'SAMOSA';
  } else if (archetype === 'IT_TECHIE') {
    if (availableKeys.includes('ADRAK_ELAICHI') && Math.random() < 0.5) {
      orderKey = 'ADRAK_ELAICHI';
    } else if (availableKeys.includes('BUN_MASKA') && Math.random() < 0.4) {
      orderKey = 'BUN_MASKA';
    } else {
      orderKey = 'MASALA_CHAI';
    }
  } else if (archetype === 'LOCAL_UNCLE') {
    orderKey = availableKeys.includes('MASALA_CHAI') ? 'MASALA_CHAI' : 'CUTTING_CHAI';
  } else {
    orderKey = 'CUTTING_CHAI';
  }

  // Ensure chosen key is actually unlocked
  if (!unlockedRecipes[orderKey]?.unlocked) {
    orderKey = 'CUTTING_CHAI';
  }

  // Base patience in seconds
  let basePatience = 12;
  let priceTolerance = 15.0;

  switch (archetype) {
    case 'COLLEGE_STUDENT':
      basePatience = 11;
      priceTolerance = 14.0;
      break;
    case 'IT_TECHIE':
      basePatience = 13;
      priceTolerance = 30.0;
      break;
    case 'LOCAL_UNCLE':
      basePatience = 18;
      priceTolerance = 22.0;
      break;
    case 'COMMUTER':
      basePatience = 8;
      priceTolerance = 16.0;
      break;
  }

  // Upgrade bonuses
  if (hasRadio) basePatience = Math.round(basePatience * 1.3); // +30% patience from radio tunes
  if (hasKulhad) priceTolerance += 5.0; // Higher price tolerance in clay cups

  return {
    id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    archetype,
    name,
    avatarSeed: Math.floor(Math.random() * 1000),
    orderRecipeKey: orderKey,
    orderQuantity: 1,
    patience: basePatience,
    maxPatience: basePatience,
    priceTolerance,
    status: 'WAITING',
  };
}
