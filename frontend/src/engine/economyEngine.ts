import { MarketPrices, Recipe } from '../types';

/**
 * Calculates exact unit cost of goods sold (COGS) for a single serving of a recipe
 * based on current spot market prices.
 */
export function calculateRecipeUnitCost(recipe: Recipe, market: MarketPrices): number {
  const req = recipe.ingredients;

  const milkCost = (req.milk / 1000) * market.milkPerLiter;
  const teaCost = (req.teaLeaves / 1000) * market.teaLeavesPerKg;
  const sugarCost = (req.sugar / 1000) * market.sugarPerKg;
  const gingerCost = (req.ginger / 100) * market.gingerPer100g;
  const cardamomCost = (req.cardamom / 50) * market.cardamomPer50g;
  const cupCost = (req.cups / 50) * market.cupsPer50Units;
  const bunCost = (req.bunMaska || 0) * market.bunMaskaPerUnit;
  const samosaCost = (req.samosa || 0) * market.samosaPerUnit;

  const totalCost =
    milkCost + teaCost + sugarCost + gingerCost + cardamomCost + cupCost + bunCost + samosaCost;

  return Math.round(totalCost * 100) / 100;
}

/**
 * Calculates expected profit margin percentage for a recipe.
 */
export function calculateProfitMarginPercent(price: number, unitCost: number): number {
  if (price <= 0) return 0;
  return Math.round(((price - unitCost) / price) * 100);
}

/**
 * Determines customer rating (1 to 5 stars) based on:
 * - Price fairness relative to customer price tolerance
 * - Speed of service relative to maximum patience
 * - Upgrades active (e.g., earthen kulhad gives +0.5 star bonus)
 */
export function calculateCustomerRating(
  price: number,
  priceTolerance: number,
  remainingPatience: number,
  maxPatience: number,
  hasKulhad: boolean
): { stars: number; tip: number; feedback: string } {
  let score = 5.0;

  // Price penalty
  if (price > priceTolerance) {
    const overchargeRatio = (price - priceTolerance) / priceTolerance;
    score -= overchargeRatio * 3.5;
  } else if (price < priceTolerance * 0.8) {
    // Value bonus
    score += 0.5;
  }

  // Speed penalty
  const speedRatio = remainingPatience / maxPatience;
  if (speedRatio < 0.3) {
    score -= 1.5; // Waited too long
  } else if (speedRatio > 0.7) {
    score += 0.5; // Super quick
  }

  if (hasKulhad) {
    score += 0.5;
  }

  const finalStars = Math.max(1, Math.min(5, Math.round(score)));

  // Calculate tip based on final satisfaction
  let tip = 0;
  let feedback = '';

  if (finalStars === 5) {
    tip = Math.round(price * 0.2); // 20% tip
    feedback = hasKulhad
      ? 'Aaha! Proper kulhad aroma and blazing fast service. Zabardast!'
      : 'Excellent kadak chai, perfect sweetness! Keep it up!';
  } else if (finalStars === 4) {
    tip = Math.round(price * 0.1);
    feedback = 'Good tea, hot and refreshing.';
  } else if (finalStars === 3) {
    feedback = 'Decent chai, but a bit pricey for the portion.';
  } else if (finalStars === 2) {
    feedback = 'Took too long to brew and charged too much!';
  } else {
    feedback = 'Cold service, unreasonable prices. Not returning!';
  }

  return { stars: finalStars, tip, feedback };
}
