import fs from 'fs'
import path from 'path'

export interface Location {
  current: string
  region: string
  country: string
  emoji: string
  since: string
  approxCoordinates: {
    lat: number
    lng: number
    note: string
  }
}

export function getLocation(): Location {
  const filePath = path.join(process.cwd(), 'content', 'location.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents)
}

// Map country codes to approximate center coordinates
export const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  'DE': { lat: 51.1657, lng: 10.4515 }, // Germany center
  'MY': { lat: 4.2105, lng: 101.9758 }, // Malaysia center
  'TH': { lat: 15.8700, lng: 100.9925 }, // Thailand center
  'ID': { lat: -0.7893, lng: 113.9213 }, // Indonesia center
  'VN': { lat: 14.0583, lng: 108.2772 }, // Vietnam center
  'SG': { lat: 1.3521, lng: 103.8198 }, // Singapore
  // Add more as needed
}

export function getCountryCenter(countryCode: string) {
  return countryCoordinates[countryCode] || { lat: 0, lng: 0 }
}