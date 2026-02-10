export function generateCityZones(lat, lon, baseOffset, bbox) {
  const zones = [{ name: "Center", lat, lon }];

  if (!bbox) return zones;

  const [south, north, west, east] = bbox;

  const latRad = (lat * Math.PI) / 180;
  const lonScale = Math.cos(latRad);

  // Available space in each direction (degrees)
  const northSpace = north - lat;
  const southSpace = lat - south;
  const eastSpace = (east - lon) * lonScale;
  const westSpace = (lon - west) * lonScale;

  // Use only what is safely available
  const northOffset = Math.min(baseOffset, northSpace * 0.8);
  const southOffset = Math.min(baseOffset, southSpace * 0.8);
  const eastOffset  = Math.min(baseOffset, eastSpace * 0.8);
  const westOffset  = Math.min(baseOffset, westSpace * 0.8);

  if (northOffset > 0) {
    zones.push({
      name: "North",
      lat: lat + northOffset,
      lon
    });
  }

  if (southOffset > 0) {
    zones.push({
      name: "South",
      lat: lat - southOffset,
      lon
    });
  }

  if (eastOffset > 0) {
    zones.push({
      name: "East",
      lat,
      lon: lon + eastOffset / lonScale
    });
  }

  if (westOffset > 0) {
    zones.push({
      name: "West",
      lat,
      lon: lon - westOffset / lonScale
    });
  }

  return zones;
}
