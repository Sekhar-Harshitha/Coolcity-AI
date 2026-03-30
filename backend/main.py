from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CoolCity AI API", version="1.0.0")

# Allow requests from the Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    lat: float
    lng: float
    radius_km: float


class AnalyzeResponse(BaseModel):
    status: str
    zone_id: str


@app.get("/")
def root():
    return {"message": "CoolCity AI API is running"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    """
    Stub endpoint that accepts geographic coordinates and a radius,
    and returns a zone identifier for analysis.
    """
    print(f"Received: lat={payload.lat}, lng={payload.lng}, radius_km={payload.radius_km}")
    return AnalyzeResponse(status="ok", zone_id="test")
