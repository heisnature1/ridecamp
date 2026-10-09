/**
 * Rough equirectangular map of Africa rendered as a dot matrix.
 * The outline below is a hand-simplified polygon (lon, lat) used only
 * to place dots and city pins — it is not geographic survey data.
 */
export const AFRICA_OUTLINE: [number, number][] = [
  [-17, 15], [-16, 12], [-13, 9], [-8, 5], [-4, 5], [0, 5.8], [3, 6.4],
  [8, 4.5], [9, 4], [9, 1], [12, -5], [12, -17], [14, -22], [17, -28],
  [20, -34], [25, -34], [30, -31], [32, -28], [35, -24], [35, -17],
  [40, -15], [40, -10], [39.5, -6.8], [39.7, -4], [42, -1.5], [45.3, 2],
  [51.3, 11.8], [43.3, 11.5], [43.3, 12.5], [39, 15], [37, 22], [34, 28],
  [32, 31], [25, 31.5], [20, 30.5], [15, 32.5], [10, 37], [3, 36.8],
  [-2, 35], [-6, 35.8], [-9, 33], [-13, 27.7], [-17, 21], [-16, 16],
];

export const MAP_BOUNDS = { minLon: -19, maxLon: 53, minLat: -36, maxLat: 38 };

export function project(lon: number, lat: number, w: number, h: number) {
  const x = ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * w;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * h;
  return { x, y };
}

function inside(lon: number, lat: number): boolean {
  let ok = false;
  const n = AFRICA_OUTLINE.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = AFRICA_OUTLINE[i];
    const [xj, yj] = AFRICA_OUTLINE[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      ok = !ok;
    }
  }
  return ok;
}

/** Dot grid inside the Africa outline, in map coordinates 0..w / 0..h */
export function africaDots(w: number, h: number, stepDeg = 1.15): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];
  for (let lat = MAP_BOUNDS.minLat; lat <= MAP_BOUNDS.maxLat; lat += stepDeg) {
    for (let lon = MAP_BOUNDS.minLon; lon <= MAP_BOUNDS.maxLon; lon += stepDeg) {
      if (inside(lon, lat)) dots.push(project(lon, lat, w, h));
    }
  }
  return dots;
}
