import { Inventory, Recipe } from '../types';

/**
 * Pure deterministic validation: Checks whether the current inventory
 * strictly satisfies all ingredient requirements for the target recipe.
 * GUARANTEES: Never permits fulfillment if any ingredient is deficient.
 */
export function canFulfillOrder(inventory: Inventory, recipe: Recipe): boolean {
  const req = recipe.ingredients;

  if (req.milk > 0 && inventory.milk < req.milk) return false;
  if (req.teaLeaves > 0 && inventory.teaLeaves < req.teaLeaves) return false;
  if (req.sugar > 0 && inventory.sugar < req.sugar) return false;
  if (req.ginger > 0 && inventory.ginger < req.ginger) return false;
  if (req.cardamom > 0 && inventory.cardamom < req.cardamom) return false;
  if (req.cups > 0 && inventory.cups < req.cups) return false;
  if (req.bunMaska && req.bunMaska > 0 && inventory.bunMaska < req.bunMaska) return false;
  if (req.samosa && req.samosa > 0 && inventory.samosa < req.samosa) return false;

  return true;
}

/**
 * Pure atomic deduction of ingredients.
 * INVARIANT: Every inventory value is strictly clamped to >= 0.
 * If canFulfillOrder fails, throws an error and does not mutate state.
 */
export function deductIngredients(inventory: Inventory, recipe: Recipe): Inventory {
  if (!canFulfillOrder(inventory, recipe)) {
    throw new Error(
      `Zero Negative Inventory Invariant Violation: Insufficient stock for recipe "${recipe.name}".`
    );
  }

  const req = recipe.ingredients;

  return {
    milk: Math.max(0, inventory.milk - (req.milk || 0)),
    teaLeaves: Math.max(0, inventory.teaLeaves - (req.teaLeaves || 0)),
    sugar: Math.max(0, inventory.sugar - (req.sugar || 0)),
    ginger: Math.max(0, inventory.ginger - (req.ginger || 0)),
    cardamom: Math.max(0, inventory.cardamom - (req.cardamom || 0)),
    cups: Math.max(0, inventory.cups - (req.cups || 0)),
    bunMaska: Math.max(0, inventory.bunMaska - (req.bunMaska || 0)),
    samosa: Math.max(0, inventory.samosa - (req.samosa || 0)),
  };
}

/**
 * Calculates the maximum number of servings possible for a recipe
 * given current available inventory.
 */
export function calculateMaxPossibleServings(inventory: Inventory, recipe: Recipe): number {
  const req = recipe.ingredients;
  const limits: number[] = [];

  if (req.milk > 0) limits.push(Math.floor(inventory.milk / req.milk));
  if (req.teaLeaves > 0) limits.push(Math.floor(inventory.teaLeaves / req.teaLeaves));
  if (req.sugar > 0) limits.push(Math.floor(inventory.sugar / req.sugar));
  if (req.ginger > 0) limits.push(Math.floor(inventory.ginger / req.ginger));
  if (req.cardamom > 0) limits.push(Math.floor(inventory.cardamom / req.cardamom));
  if (req.cups > 0) limits.push(Math.floor(inventory.cups / req.cups));
  if (req.bunMaska && req.bunMaska > 0) limits.push(Math.floor(inventory.bunMaska / req.bunMaska));
  if (req.samosa && req.samosa > 0) limits.push(Math.floor(inventory.samosa / req.samosa));

  if (limits.length === 0) return 0;
  return Math.max(0, Math.min(...limits));
}

/**
 * Returns human-readable diagnostic messages for missing ingredients.
 */
export function getMissingIngredients(inventory: Inventory, recipe: Recipe): string[] {
  const missing: string[] = [];
  const req = recipe.ingredients;

  if (req.milk > 0 && inventory.milk < req.milk) {
    missing.push(`Milk (${inventory.milk}ml / ${req.milk}ml needed)`);
  }
  if (req.teaLeaves > 0 && inventory.teaLeaves < req.teaLeaves) {
    missing.push(`Tea Leaves (${inventory.teaLeaves}g / ${req.teaLeaves}g needed)`);
  }
  if (req.sugar > 0 && inventory.sugar < req.sugar) {
    missing.push(`Sugar (${inventory.sugar}g / ${req.sugar}g needed)`);
  }
  if (req.ginger > 0 && inventory.ginger < req.ginger) {
    missing.push(`Ginger (${inventory.ginger} / ${req.ginger} needed)`);
  }
  if (req.cardamom > 0 && inventory.cardamom < req.cardamom) {
    missing.push(`Cardamom (${inventory.cardamom} / ${req.cardamom} needed)`);
  }
  if (req.cups > 0 && inventory.cups < req.cups) {
    missing.push(`Cups (${inventory.cups} / ${req.cups} needed)`);
  }
  if (req.bunMaska && req.bunMaska > 0 && inventory.bunMaska < req.bunMaska) {
    missing.push(`Bun Maska (0 in stock)`);
  }
  if (req.samosa && req.samosa > 0 && inventory.samosa < req.samosa) {
    missing.push(`Samosas (0 in stock)`);
  }

  return missing;
}

/**
 * Calculates spoilage of unpreserved perishables overnight (unboiled milk).
 */
export function calculateSpoilage(
  inventory: Inventory,
  rate: number
): { spoiledMilkMl: number; remainingInventory: Inventory } {
  const spoiledMilkMl = Math.floor(inventory.milk * rate);
  const remainingInventory: Inventory = {
    ...inventory,
    milk: Math.max(0, inventory.milk - spoiledMilkMl),
  };
  return { spoiledMilkMl, remainingInventory };
}
