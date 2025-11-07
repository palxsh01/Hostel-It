// Campus location coordinates mapping
// Using approximate coordinates for a typical college campus
// You should replace these with actual coordinates for your campus

export interface LocationCoordinates {
  lng: number;
  lat: number;
}

const CAMPUS_COORDINATES: Record<string, LocationCoordinates> = {
  'boys-hostel-a': { lng: 77.2090, lat: 28.6139 },
  'boys-hostel-b': { lng: 77.2100, lat: 28.6149 },
  'girls-hostel-a': { lng: 77.2110, lat: 28.6159 },
  'girls-hostel-b': { lng: 77.2120, lat: 28.6169 },
  'library': { lng: 77.2130, lat: 28.6179 },
  'main-building': { lng: 77.2140, lat: 28.6189 },
  'cafeteria': { lng: 77.2150, lat: 28.6199 },
  'sports-complex': { lng: 77.2160, lat: 28.6209 },
  'medical-center': { lng: 77.2170, lat: 28.6219 },
};

export function getLocationCoordinates(locationSlug: string): LocationCoordinates {
  const coords = CAMPUS_COORDINATES[locationSlug.toLowerCase()];
  if (!coords) {
    // Default to center of campus if location not found
    return { lng: 77.2090, lat: 28.6139 };
  }
  return coords;
}

export function locationSlugToName(slug: string): string {
  const nameMap: Record<string, string> = {
    'boys-hostel-a': 'Boys Hostel A',
    'boys-hostel-b': 'Boys Hostel B',
    'girls-hostel-a': 'Girls Hostel A',
    'girls-hostel-b': 'Girls Hostel B',
    'library': 'Library',
    'main-building': 'Main Building',
    'cafeteria': 'Cafeteria',
    'sports-complex': 'Sports Complex',
    'medical-center': 'Medical Center',
  };
  return nameMap[slug.toLowerCase()] || slug;
}

