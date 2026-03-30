from pydantic import BaseModel
from typing import List, Dict, Any

class StrategyInfo:
    def __init__(self, name: str, temp_drop_per_unit: float, cost_per_unit: float, coverage_m2: float):
        self.name = name
        self.temp_drop_per_unit = temp_drop_per_unit
        self.cost_per_unit = cost_per_unit
        self.coverage_m2 = coverage_m2

STRATEGIES_DB = {
    "tree_plantation": StrategyInfo("tree_plantation", 0.008, 450, 25),
    "cool_roofs": StrategyInfo("cool_roofs", 0.015, 1200, 10),
    "green_walls": StrategyInfo("green_walls", 0.005, 800, 5),
    "water_bodies": StrategyInfo("water_bodies", 0.020, 8000, 100),
}

def simulate(zone_area_m2: float, strategies: List[str], budget_inr: float) -> Dict[str, Any]:
    # 1. Rank strategies by efficiency (temp drop per rupee)
    strategies_ranked_data = []
    
    for s_name in strategies:
        if s_name not in STRATEGIES_DB:
            continue
        info = STRATEGIES_DB[s_name]
        
        # Efficiency: °C drop per rupee
        efficiency_score = info.temp_drop_per_unit / info.cost_per_unit
        
        strategies_ranked_data.append({
            "name": s_name,
            "info": info,
            "efficiency_score": efficiency_score
        })
        
    # Greedy sort top-down by efficiency
    strategies_ranked_data.sort(key=lambda x: x["efficiency_score"], reverse=True)
    
    ranked_output = []
    optimal_mix = []
    budget_remaining = budget_inr
    area_remaining = zone_area_m2
    total_predicted_temp_drop = 0.0
    
    for s_data in strategies_ranked_data:
        info = s_data["info"]
        
        # For ranked list output (potential max_units without sharing area/budget with others)
        max_units_potential = min(budget_inr / info.cost_per_unit, zone_area_m2 / info.coverage_m2)
        total_temp_drop_potential = max_units_potential * info.temp_drop_per_unit
        total_cost_potential = max_units_potential * info.cost_per_unit
        
        ranked_output.append({
            "name": info.name,
            "units": int(max_units_potential),
            "temp_drop": round(total_temp_drop_potential, 4),
            "cost": round(total_cost_potential, 2),
            "efficiency_score": s_data["efficiency_score"]
        })
        
        # Allocate budget & space for optimal mix (greedy allocation)
        affordable_units = budget_remaining / info.cost_per_unit
        space_units = area_remaining / info.coverage_m2
        actual_units = int(min(affordable_units, space_units))
        
        if actual_units > 0:
            allocated_cost = actual_units * info.cost_per_unit
            allocated_drop = actual_units * info.temp_drop_per_unit
            
            budget_remaining -= allocated_cost
            area_remaining -= actual_units * info.coverage_m2
            total_predicted_temp_drop += allocated_drop
            
            optimal_mix.append({
                "name": info.name,
                "units": actual_units,
                "budget_allocated": round(allocated_cost, 2),
                "temp_drop": round(allocated_drop, 4)
            })

    budget_used = budget_inr - budget_remaining
    
    return {
        "strategies_ranked": ranked_output,
        "optimal_mix": optimal_mix,
        "total_predicted_temp_drop": round(total_predicted_temp_drop, 4),
        "budget_used": round(budget_used, 2),
        "budget_remaining": round(budget_remaining, 2)
    }
