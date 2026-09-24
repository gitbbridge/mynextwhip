import { ListingLocation } from '../types';

export interface MarketRegion {
  id: string;
  name: string;
  defaultZip: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const POPULAR_MARKETS: MarketRegion[] = [
  { id: 'denver', name: 'Denver / Front Range, CO', defaultZip: '80202', city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 },
  { id: 'austin', name: 'Austin / Central Texas', defaultZip: '78701', city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
  { id: 'portland', name: 'Portland / Pacific NW', defaultZip: '97201', city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784 },
  { id: 'atlanta', name: 'Atlanta Metro, GA', defaultZip: '30303', city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880 },
  { id: 'phoenix', name: 'Phoenix / Valley, AZ', defaultZip: '85001', city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
  { id: 'chicago', name: 'Chicago & Suburbs, IL', defaultZip: '60601', city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { id: 'colospr', name: 'Colorado Springs, CO', defaultZip: '80903', city: 'Colorado Springs', state: 'CO', lat: 38.8339, lng: -104.8214 },
  { id: 'dallas', name: 'Dallas-Fort Worth, TX', defaultZip: '75201', city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
  { id: 'seattle', name: 'Seattle Metro, WA', defaultZip: '98101', city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
  { id: 'losangeles', name: 'Los Angeles / SoCal', defaultZip: '90012', city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
];

export const RADIUS_OPTIONS = [
  { label: '10 miles', value: 10 },
  { label: '25 miles', value: 25 },
  { label: '50 miles (Default)', value: 50 },
  { label: '100 miles', value: 100 },
  { label: '250 miles', value: 250 },
  { label: 'Nationwide', value: 99999 },
];

// Lightweight dictionary of common ZIP prefixes to approximate coordinates
const ZIP_COORDINATE_CACHE: Record<string, { lat: number; lng: number; city: string; state: string }> = {
  '80202': { lat: 39.7531, lng: -104.9998, city: 'Denver', state: 'CO' },
  '80014': { lat: 39.6644, lng: -104.8398, city: 'Aurora', state: 'CO' },
  '80302': { lat: 40.0150, lng: -105.2705, city: 'Boulder', state: 'CO' },
  '80903': { lat: 38.8339, lng: -104.8214, city: 'Colorado Springs', state: 'CO' },
  '80524': { lat: 40.5853, lng: -105.0844, city: 'Fort Collins', state: 'CO' },
  '78701': { lat: 30.2711, lng: -97.7437, city: 'Austin', state: 'TX' },
  '78704': { lat: 30.2458, lng: -97.7661, city: 'South Austin', state: 'TX' },
  '78660': { lat: 30.4394, lng: -97.6200, city: 'Pflugerville', state: 'TX' },
  '78201': { lat: 29.4754, lng: -98.5283, city: 'San Antonio', state: 'TX' },
  '75201': { lat: 32.7876, lng: -96.7997, city: 'Dallas', state: 'TX' },
  '97201': { lat: 45.5036, lng: -122.6841, city: 'Portland', state: 'OR' },
  '97034': { lat: 45.4182, lng: -122.6706, city: 'Lake Oswego', state: 'OR' },
  '98101': { lat: 47.6101, lng: -122.3344, city: 'Seattle', state: 'WA' },
  '85001': { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' },
  '85251': { lat: 33.4942, lng: -111.9261, city: 'Scottsdale', state: 'AZ' },
  '30303': { lat: 33.7537, lng: -84.3916, city: 'Atlanta', state: 'GA' },
  '60601': { lat: 41.8858, lng: -87.6229, city: 'Chicago', state: 'IL' },
  '90012': { lat: 34.0625, lng: -118.2383, city: 'Los Angeles', state: 'CA' },
  '91501': { lat: 34.1808, lng: -118.3090, city: 'Burbank', state: 'CA' },
  '37201': { lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN' },
};

/**
 * Calculates Great-Circle distance using Haversine formula in miles
 */
export function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Resolves a ZIP code to coordinates and city/state
 */
export function resolveLocationFromZip(zipInput: string): ListingLocation {
  const cleanZip = zipInput.trim().slice(0, 5);

  if (ZIP_COORDINATE_CACHE[cleanZip]) {
    const cached = ZIP_COORDINATE_CACHE[cleanZip];
    return {
      zip: cleanZip,
      city: cached.city,
      state: cached.state,
      lat: cached.lat,
      lng: cached.lng,
    };
  }

  // Hash-based heuristic so any 5-digit US ZIP generates realistic consistent US coords
  let hash = 0;
  for (let i = 0; i < cleanZip.length; i++) {
    hash = (hash << 5) - hash + cleanZip.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 2000) / 100) - 10;
  const lngOffset = ((Math.abs(hash * 3) % 2000) / 100) - 10;

  return {
    zip: cleanZip || '80202',
    city: 'Local Area',
    state: 'CO',
    lat: 39.7392 + (latOffset * 0.1),
    lng: -104.9903 + (lngOffset * 0.1),
  };
}

export function formatDistance(miles?: number): string {
  if (miles === undefined || miles === null) return '';
  if (miles < 1) return '< 1 mi';
  return `${miles} mi`;
}
