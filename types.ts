
export interface PlanetData {
  id: string;
  name: string;
  fullName: string;
  url: string;
  category: string;
  description: string;
  color: string;
  orbit: number;
  orbitSpeed: number;
  rotationSpeed: number;
  size: number;
  frequency: number;
  thumbnailUrl: string;
  status?: 'new' | 'beta' | 'live'; // Added status field
  planet: {
    texture: string;
    rings: boolean;
    atmosphere: boolean;
    bands?: boolean;
    tilt?: boolean;
  };
  astronomy: {
    realName: string;
    symbol: string;
    distanceFromSun: string;
    diameter: string;
    orbitalPeriod: string;
    rotationPeriod: string;
    temperature: string;
    moons: number;
    composition: string;
    facts: string[];
    scientificData: {
      mass: string;
      gravity: string;
      escapeVelocity: string;
      density: string;
      albedo: string;
    };
    weather: {
      today: string;
      forecast: string;
      windSpeed: string;
    };
  };
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface AudioVolumeState {
  inputVolume: number;
  outputVolume: number;
}
