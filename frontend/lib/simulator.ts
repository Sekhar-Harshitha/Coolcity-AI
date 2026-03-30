// CoolCity-AI Simulator - Ported from Python backend to TypeScript for offline support
export interface StrategyInfo {
  name: string;
  temp_drop_per_unit: number;
  cost_per_unit: number;
  coverage_m2: number;
}

export const STRATEGIES_DB: Record<string, StrategyInfo> = {
  tree_plantation: { name: "Trees", temp_drop_per_unit: 0.05, cost_per_unit: 1500, coverage_m2: 25 },
  cool_roofs: { name: "Cool Roofs", temp_drop_per_unit: 0.02, cost_per_unit: 800, coverage_m2: 50 },
  green_walls: { name: "Green Walls", temp_drop_per_unit: 0.03, cost_per_unit: 1200, coverage_m2: 20 },
  water_bodies: { name: "Water Bodies", temp_drop_per_unit: 0.15, cost_per_unit: 15000, coverage_m2: 100 },
};

export interface SimulationResult {
  strategies_ranked: any[];
  optimal_mix: Record<string, number>;
  temp_reduction: number;
  total_cost: number;
  budget_remaining: number;
}

export function simulateLocally(strategyType: 'balanced' | 'green_first' | 'tech_first', budget: number, zoneAreaM2: number): SimulationResult {
  let budgetRemaining = budget;
  let areaRemaining = zoneAreaM2 * 0.4; // Only 40% of area usually available for intervention
  let totalTempDrop = 0;
  const optimalMix: Record<string, number> = {};

  // Priorities based on strategy type
  const priorities = strategyType === 'green_first' 
    ? ['tree_plantation', 'green_walls', 'cool_roofs', 'water_bodies']
    : strategyType === 'tech_first'
      ? ['cool_roofs', 'water_bodies', 'green_walls', 'tree_plantation']
      : ['tree_plantation', 'cool_roofs', 'green_walls', 'water_bodies'];

  // Initialize all strategy keys in optimalMix to 0
  Object.keys(STRATEGIES_DB).forEach(key => optimalMix[key] = 0);

  for (const sKey of priorities) {
    const s = STRATEGIES_DB[sKey];
    if (!s) continue;

    const maxByBudget = Math.floor(budgetRemaining / s.cost_per_unit);
    const maxByArea = Math.floor(areaRemaining / s.coverage_m2);
    const units = Math.min(maxByBudget, maxByArea);

    if (units > 0) {
      optimalMix[sKey] = units;
      budgetRemaining -= units * s.cost_per_unit;
      areaRemaining -= units * s.coverage_m2;
      totalTempDrop += units * s.temp_drop_per_unit;
    }
  }

  return {
    strategies_ranked: priorities.map(k => STRATEGIES_DB[k]),
    optimal_mix: optimalMix,
    temp_reduction: Number(totalTempDrop.toFixed(2)),
    total_cost: budget - budgetRemaining,
    budget_remaining: budgetRemaining
  };
}
