/**
 * Stylised dot-matrix map of Ghana (lon, lat outline — hand-simplified,
 * not survey data) used for the swap-network section.
 */
export const GHANA_OUTLINE: [number, number][] = [
  [-3.25, 5.1], [-2.7, 5.1], [-2.2, 4.9], [-1.6, 4.75], [-0.8, 5.0],
  [-0.02, 5.55], [0.7, 5.7], [1.19, 6.1], [1.07, 6.9], [0.7, 7.0],
  [0.5, 8.5], [0.35, 10.0], [0.05, 11.09], [-0.5, 10.99], [-1.5, 11.17],
  [-2.9, 11.0], [-3.25, 9.5], [-2.9, 8.0], [-3.1, 6.7],
];

export const MAP_BOUNDS = { minLon: -3.8, maxLon: 1.7, minLat: 4.4, maxLat: 11.6 };

export function project(lon: number, lat: number, w: number, h: number) {
  const x = ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * w;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * h;
  return { x, y };
}

function inside(lon: number, lat: number): boolean {
  let ok = false;
  const n = GHANA_OUTLINE.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = GHANA_OUTLINE[i];
    const [xj, yj] = GHANA_OUTLINE[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      ok = !ok;
    }
  }
  return ok;
}

export function ghanaDots(w: number, h: number, stepDeg = 0.22): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];
  for (let lat = MAP_BOUNDS.minLat; lat <= MAP_BOUNDS.maxLat; lat += stepDeg) {
    for (let lon = MAP_BOUNDS.minLon; lon <= MAP_BOUNDS.maxLon; lon += stepDeg) {
      if (inside(lon, lat)) dots.push(project(lon, lat, w, h));
    }
  }
  return dots;
}

export const GHANA_CITIES = [
  { name: "Accra", lon: -0.19, lat: 5.6, status: "Launch city" },
  { name: "Tema", lon: 0.01, lat: 5.67, status: "Launch city" },
  { name: "Kumasi", lon: -1.62, lat: 6.69, status: "Coming soon" },
  { name: "Takoradi", lon: -1.76, lat: 4.93, status: "Coming soon" },
  { name: "Cape Coast", lon: -1.25, lat: 5.1, status: "Coming soon" },
  { name: "Tamale", lon: -0.84, lat: 9.4, status: "Coming soon" },
];
