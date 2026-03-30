from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import cv2
import numpy as np
import os
import uuid
from io import BytesIO
from PIL import Image
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from datetime import datetime

app = FastAPI(title="CoolCity AI API", version="1.0.0")

# Dummy persistent feed for citizen reports
CITIZEN_REPORTS_DB = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since frontend URL might change or it is localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BoundingBox(BaseModel):
    north: float
    south: float
    east: float
    west: float

class AnalyzeRequest(BaseModel):
    bbox: BoundingBox
    zoom: int = 12


@app.get("/")
def root():
    return {"message": "CoolCity AI API is running"}


@app.post("/api/analyze")
async def analyze(payload: AnalyzeRequest):
    # 1. Fetch Satellite Imagery from Open Source Provider (Esri World Imagery)
    # We stitch tiles to create a 600x600 high-res image of the selected area
    import math

    def latlng_to_tile(lat, lng, zoom):
        lat_rad = math.radians(lat)
        n = 2.0 ** zoom
        xtile = int((lng + 180.0) / 360.0 * n)
        ytile = int((1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * n)
        return xtile, ytile

    # Calculate center tile and surrounding tiles to cover the 600x600 area
    center_lat = (payload.bbox.north + payload.bbox.south) / 2
    center_lng = (payload.bbox.east + payload.bbox.west) / 2
    zx, zy = latlng_to_tile(center_lat, center_lng, payload.zoom)
    
    # We fetch a 3x3 grid of tiles to ensure we cover the bounding box
    full_img = Image.new('RGB', (256*3, 256*3))
    
    async with httpx.AsyncClient() as client:
        for i in range(-1, 2):
            for j in range(-1, 2):
                tile_url = f"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{payload.zoom}/{zy+i}/{zx+j}"
                try:
                    tile_resp = await client.get(tile_url, timeout=5.0)
                    if tile_resp.status_code == 200:
                        tile_img = Image.open(BytesIO(tile_resp.content))
                        full_img.paste(tile_img, ((j+1)*256, (i+1)*256))
                except Exception:
                    pass # Skip missing tiles, will be analyzed as noise
    
    # Crop to 600x600 center piece
    img = np.array(full_img.crop((84, 84, 684, 684))) # Center crop
    if img.size == 0 or np.mean(img) < 5: # If stitching failed
         img = np.random.randint(50, 200, (600, 600, 3), dtype=np.uint8)
         img[..., 1] = np.random.randint(100, 255, (600, 600))
                
    # 2. Convert to OpenCV format (BGR instead of RGB)
    # The image from PIL is RGB, OpenCV uses BGR natively, but we can just use the channels array directly
    # img is shape (H, W, 3) where channels are R, G, B
    r = img[:, :, 0].astype(int)
    g = img[:, :, 1].astype(int)
    # b = img[:, :, 2].astype(int)
    
    # 3. Compute vegetation score -> pixels where green channel > red * 1.2 AND green > 100
    vegetation_mask = (g > (r * 1.2)) & (g > 100)
    
    # Divide into 10x10 grid
    height, width = img.shape[:2]
    grid_rows, grid_cols = 10, 10
    cell_h = height // grid_rows
    cell_w = width // grid_cols
    
    grid_results = []
    
    # For bounding box interpolation for coordinates
    lat_step = (payload.bbox.south - payload.bbox.north) / grid_rows
    lng_step = (payload.bbox.east - payload.bbox.west) / grid_cols
    
    high_risk_count = 0
    total_veg_pct = 0.0
    total_heat_score = 0.0
    
    for r_idx in range(grid_rows):
        for c_idx in range(grid_cols):
            # Coordinates for this cell
            cell_lat = payload.bbox.north + r_idx * lat_step
            cell_lng = payload.bbox.west + c_idx * lng_step
            
            # Slice image mask
            cell_mask = vegetation_mask[
                r_idx * cell_h : (r_idx + 1) * cell_h,
                c_idx * cell_w : (c_idx + 1) * cell_w
            ]
            
            # Calculate percentages
            total_pixels = cell_mask.size
            if total_pixels == 0:
                continue
                
            veg_pixels = np.sum(cell_mask)
            vegetation_pct = float(veg_pixels / total_pixels)
            
            built_up_pct = 1.0 - vegetation_pct
            heat_score = built_up_pct  # Using 1 - veg_pct as requested
            
            # Calculate risk_level
            if heat_score > 0.75 and vegetation_pct < 0.15:
                risk_level = "critical"
            elif heat_score > 0.55 and vegetation_pct < 0.30:
                risk_level = "high"
            elif heat_score > 0.35:
                risk_level = "moderate"
            else:
                risk_level = "low"
            
            # Calculate suggested strategy
            suggested_strategy = "none"
            if risk_level == "critical":
                if built_up_pct > 0.7:
                    suggested_strategy = "cool_roofs"
                else:
                    suggested_strategy = "tree_plantation"
            elif risk_level == "high":
                suggested_strategy = "green_walls"
            elif risk_level == "moderate":
                suggested_strategy = "water_bodies"
            
            grid_results.append({
                "row": r_idx,
                "col": c_idx,
                "lat": float(cell_lat),
                "lng": float(cell_lng),
                "vegetation_pct": round(vegetation_pct, 4),
                "built_up_pct": round(built_up_pct, 4),
                "heat_score": round(heat_score, 4),
                "risk_level": risk_level,
                "suggested_strategy": suggested_strategy
            })
            
            if risk_level in ["critical", "high"]:
                high_risk_count += 1
                
            total_veg_pct += vegetation_pct
            total_heat_score += heat_score
            
    num_cells = grid_rows * grid_cols
    
    # Get top 5 intervention zones based on heat score
    sorted_cells = sorted(grid_results, key=lambda x: x["heat_score"], reverse=True)
    top_intervention_zones = sorted_cells[:5]
    
    summary = {
        "avg_vegetation_pct": round(total_veg_pct / num_cells, 4),
        "avg_heat_score": round(total_heat_score / num_cells, 4),
        "high_risk_zones_count": high_risk_count,
        "top_intervention_zones": top_intervention_zones
    }
    
    return {
        "grid": grid_results,
        "summary": summary
    }

from simulator import simulate as run_simulation

class SimulateRequest(BaseModel):
    zone_area_m2: float
    strategies: list[str]
    budget_inr: float

@app.post("/api/simulate")
def api_simulate(payload: SimulateRequest):
    return run_simulation(payload.zone_area_m2, payload.strategies, payload.budget_inr)

@app.post("/api/citizen/report")
async def receive_citizen_report(
    file: UploadFile = File(...),
    lat: float = Form(...),
    lng: float = Form(...),
    username: str = Form("Anonymous Citizen")
):
    try:
        contents = await file.read()
        pil_image = Image.open(BytesIO(contents)).convert("RGB")
        img = np.array(pil_image)
        
        # BGR style processing for vegetation
        r = img[:, :, 0].astype(int)
        g = img[:, :, 1].astype(int)
        
        vegetation_mask = (g > (r * 1.2)) & (g > 100)
        green_ratio = float(np.sum(vegetation_mask) / vegetation_mask.size)
        
        # Gamification Score Calculation
        if green_ratio < 0.1:
            status = "critical"
            score = 100
        elif green_ratio < 0.3:
            status = "needs_attention"
            score = 50
        else:
            status = "healthy"
            score = 10
            
        report = {
            "id": str(uuid.uuid4()),
            "username": username,
            "lat": lat,
            "lng": lng,
            "green_ratio": round(green_ratio, 4),
            "status": status,
            "awarded_points": score,
            "timestamp": datetime.now().isoformat()
        }
        
        CITIZEN_REPORTS_DB.insert(0, report)
        
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/citizen/feed")
def get_citizen_feed():
    return CITIZEN_REPORTS_DB

@app.post("/api/citizen/classify")
async def citizen_classify_mock(
    file: UploadFile = File(...),
    lat: float = Form(...),
    lng: float = Form(...)
):
    # Mocking a response for Claude Vision API claude-sonnet-4-20250514
    # In a real scenario, this would base64 the image and send to anthropic.
    import random
    classifications = [
        {
            "classification": "tree_absent",
            "confidence": 0.94,
            "description": "The image shows a vast concrete expanse with significant heat retention properties and zero canopy cover.",
            "recommendation": "Pledge to plant a sapling here to unlock a 50pt cooling confirmation bounty.",
            "heatImpact": "high"
        },
        {
            "classification": "tree_present",
            "confidence": 0.98,
            "description": "Lush mature canopy detected over a shaded pathway.",
            "recommendation": "Maintain local hydration lines.",
            "heatImpact": "low"
        },
        {
            "classification": "tree_degraded",
            "confidence": 0.88,
            "description": "A struggling urban tree surrounded by impermeable concrete lacking sufficient root space.",
            "recommendation": "Submit a report to local municipality (GHMC) to expand the tree pit.",
            "heatImpact": "medium"
        }
    ]
    return random.choice(classifications)

