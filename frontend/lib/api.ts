const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeRegion(bbox: any, zoom: number = 14) {
  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bbox: {
          north: bbox.getNorth(),
          south: bbox.getSouth(),
          east: bbox.getEast(),
          west: bbox.getWest()
        },
        zoom
      }),
    });
    
    if (!response.ok) throw new Error('Analysis failed');
    const data = await response.json();
    
    // Map backend grid structure to what frontend expects
    return {
      cells: data.grid.map((c: any) => ({
        lat: c.lat,
        lng: c.lng,
        intensity: c.heat_score,
        level: c.risk_level === 'critical' ? 'high' : c.risk_level === 'high' ? 'medium' : 'low'
      })),
      areaM2: 50000 // Mock area if not in response
    };
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
