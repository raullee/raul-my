
import type { PlanetData } from './types';

export const ACHIEVEMENTS = [
  "🎵 The Crossing — Official [ADE] Underground Showcase",
  "⚖️ ALIM — Over 25+ Working Partnerships & Counting",
  "🎹 Cliff Coffin — New Album 'Fault Tolerance' Launch Set for 10 January 2026",
  "💼 Sync Primitive — Boutique Electronic Imprint",
  "🤖 Mat Selamat AI — Legal Tech Innovation [Coming Soon]"
];

export const SUN_DATA: PlanetData = {
  id: 'sun',
  name: 'Sol',
  fullName: 'The Sun',
  url: '',
  category: 'Star',
  description: 'The heart of the system. Source of light, heat, and gravity.',
  color: '#fb923c',
  orbit: 0,
  orbitSpeed: 0,
  rotationSpeed: 0,
  size: 109,
  frequency: 126.22,
  thumbnailUrl: '',
  planet: {
    texture: '',
    rings: false,
    atmosphere: true
  },
  astronomy: {
    realName: 'The Sun',
    symbol: '☉',
    distanceFromSun: '0 km',
    diameter: '1.39 million km',
    orbitalPeriod: 'N/A (Orbit center)',
    rotationPeriod: '27 Earth days',
    temperature: '5,500°C (Surface)',
    moons: 0,
    composition: 'Hydrogen (73%), Helium (25%)',
    facts: [
      'Contains 99.86% of solar system mass',
      'A Yellow Dwarf star (G-type main-sequence)',
      'Surface temperature is 5,500°C',
      'Core temperature is 15 million°C',
      'Will eventually become a Red Giant',
      'Light takes 8 minutes to reach Earth'
    ],
    scientificData: {
      mass: '1.989 × 10³⁰ kg',
      gravity: '274 m/s² (28× Earth)',
      escapeVelocity: '617.7 km/s',
      density: '1.41 g/cm³',
      albedo: 'N/A (Emits light)'
    },
    weather: {
      today: 'Solar Storms',
      forecast: 'Constant nuclear fusion. Solar flares and coronal mass ejections likely. Intense magnetic activity.',
      windSpeed: '400 km/s (Solar Wind)',
    }
  }
};

export const SOLAR_SYSTEM_DATA: PlanetData[] = [
  {
    id: 'cliffcoffin',
    name: 'Cliff Coffin',
    fullName: 'Album / Live Shows',
    url: 'cliffcoffin.com',
    category: 'Artist',
    description: 'Darker palettes. Immersive sonic architecture. The evolution.',
    color: '#B464FF',
    orbit: 3.2,
    orbitSpeed: 30,
    rotationSpeed: 10,
    size: 38,
    frequency: 494,
    thumbnailUrl: '/assets/thumb-cc.png',
    status: 'new',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #a78bfa 0%, #7c3aed 50%, #5b21b6 100%)',
      rings: false,
      atmosphere: false
    },
    astronomy: {
      realName: 'Mercury',
      symbol: '☿',
      distanceFromSun: '57.9 million km',
      diameter: '4,879 km',
      orbitalPeriod: '88 Earth days',
      rotationPeriod: '58.6 Earth days',
      temperature: '-173°C to 427°C',
      moons: 0,
      composition: 'Rocky, metallic core (70% metal)',
      facts: [
        'Smallest planet in the solar system',
        'Closest to the Sun',
        'No atmosphere to retain heat',
        'Extreme temperature swings (600°C range)',
        'Surface covered in craters like our Moon',
        'Has a magnetic field despite slow rotation'
      ],
      scientificData: {
        mass: '3.3011 × 10²³ kg',
        gravity: '3.7 m/s² (38% of Earth)',
        escapeVelocity: '4.3 km/s',
        density: '5.427 g/cm³',
        albedo: '0.142 (very dark)'
      },
      weather: {
        today: 'Extreme Temperature Shift',
        forecast: 'Scorching daytime highs followed by freezing nights. No precipitation.',
        windSpeed: 'Essentially none (no atmosphere)',
      }
    }
  },
  {
    id: 'matselamat',
    name: 'Mat Selamat',
    fullName: 'Legal AI',
    url: 'matselamat.com',
    category: 'Tech',
    description: 'Small claims drafter powered by fine-tuned language models.',
    color: '#64D4FF',
    orbit: 4.6,
    orbitSpeed: 45,
    rotationSpeed: -15, 
    size: 95,
    frequency: 294,
    thumbnailUrl: '/assets/thumb-matsel.png',
    status: 'beta',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #67e8f9 0%, #06b6d4 50%, #0e7490 100%)',
      rings: false,
      atmosphere: true
    },
    astronomy: {
      realName: 'Venus',
      symbol: '♀',
      distanceFromSun: '108.2 million km',
      diameter: '12,104 km',
      orbitalPeriod: '225 Earth days',
      rotationPeriod: '243 Earth days (retrograde)',
      temperature: '462°C (hottest planet)',
      moons: 0,
      composition: 'Rocky with thick CO₂ atmosphere',
      facts: [
        'Hottest planet in the solar system',
        'Rotates BACKWARDS (retrograde motion)',
        'Similar size to Earth (Earth\'s twin)',
        'Crushing atmospheric pressure (92× Earth)',
        'One day longer than one year',
        'Brightest object in night sky after Moon'
      ],
      scientificData: {
        mass: '4.8675 × 10²⁴ kg',
        gravity: '8.87 m/s² (90% of Earth)',
        escapeVelocity: '10.36 km/s',
        density: '5.243 g/cm³',
        albedo: '0.689 (highly reflective)'
      },
      weather: {
        today: 'Crushing & Caustic',
        forecast: 'Thick sulfuric acid clouds. Constant extreme heat. No precipitation.',
        windSpeed: '360 km/h (upper atmosphere)',
      }
    }
  },
  {
    id: 'raul-law',
    name: 'Litigation',
    fullName: 'RLB Advocates & Solicitors',
    url: 'raul.com.my',
    category: 'Practice',
    description: 'Contemporary litigation and dispute resolution-focused practice.',
    color: '#8B9FFF',
    orbit: 6.0,
    orbitSpeed: 60,
    rotationSpeed: 1,
    size: 100,
    frequency: 262,
    thumbnailUrl: '/assets/thumb-rlbas.png',
    status: 'live',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #3b82f6 40%, #1e3a8a 100%)',
      rings: false,
      atmosphere: true
    },
    astronomy: {
      realName: 'Earth',
      symbol: '⊕',
      distanceFromSun: '149.6 million km',
      diameter: '12,742 km',
      orbitalPeriod: '365.25 days',
      rotationPeriod: '24 hours (1 day)',
      temperature: '-88°C to 58°C',
      moons: 1,
      composition: 'Rocky with 71% water surface',
      facts: [
        'Only planet with life (that we know of)',
        'Liquid water on surface',
        'Protective magnetic field blocks solar wind',
        'Perfect position in habitable zone',
        'Atmosphere: 78% nitrogen, 21% oxygen',
        'Only planet not named after a deity'
      ],
      scientificData: {
        mass: '5.9724 × 10²⁴ kg',
        gravity: '9.807 m/s² (reference)',
        escapeVelocity: '11.186 km/s',
        density: '5.514 g/cm³',
        albedo: '0.306'
      },
      weather: {
        today: 'Variable & Dynamic',
        forecast: 'A mix of sun, clouds, and precipitation across different regions. Generally pleasant.',
        windSpeed: '0-300+ km/h (in storms)',
      }
    }
  },
  {
    id: 'raullee',
    name: '@raulleemusic',
    fullName: 'Music Producer / DJ',
    url: 'raullee.com',
    category: 'Musician',
    description: 'Progressive electronic music. Ambient to peak-time.',
    color: '#FFB464',
    orbit: 7.4,
    orbitSpeed: 75,
    rotationSpeed: 1.03,
    size: 53,
    frequency: 392,
    thumbnailUrl: '/assets/thumb-outpost.png',
    status: 'live',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #fb923c 0%, #ea580c 50%, #9a3412 100%)',
      rings: false,
      atmosphere: false
    },
    astronomy: {
      realName: 'Mars',
      symbol: '♂',
      distanceFromSun: '227.9 million km',
      diameter: '6,779 km',
      orbitalPeriod: '687 Earth days',
      rotationPeriod: '24.6 hours (1.03 Earth days)',
      temperature: '-125°C to 20°C',
      moons: 2,
      composition: 'Rocky with iron oxide (rust)',
      facts: [
        'The Red Planet (iron oxide surface)',
        'Olympus Mons: largest volcano in solar system',
        'Polar ice caps of water and CO₂',
        'Target for human colonization',
        'Day length nearly identical to Earth',
        'Two small moons: Phobos and Deimos'
      ],
      scientificData: {
        mass: '6.4171 × 10²³ kg',
        gravity: '3.721 m/s² (38% of Earth)',
        escapeVelocity: '5.03 km/s',
        density: '3.9335 g/cm³',
        albedo: '0.170'
      },
      weather: {
        today: 'Cold & Dusty',
        forecast: 'Clear skies with potential for continent-sized dust storms. Very thin atmosphere.',
        windSpeed: 'Up to 100 km/h (during storms)',
      }
    }
  },
  {
    id: 'syncprimitive',
    name: 'Sync Primitive',
    fullName: 'Recording Company',
    url: 'syncprimitive.com',
    category: 'Label',
    description: 'Independent electronic imprint. Sync licensing. Algorithmic composition. Sonic Arts.',
    color: '#64FFB4',
    orbit: 9.2,
    orbitSpeed: 90,
    rotationSpeed: 0.41,
    size: 280,
    frequency: 349,
    thumbnailUrl: '/assets/thumb-sp.png',
    status: 'live',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #6ee7b7 0%, #10b981 40%, #047857 100%)',
      rings: false,
      atmosphere: true,
      bands: true
    },
    astronomy: {
      realName: 'Jupiter',
      symbol: '♃',
      distanceFromSun: '778.5 million km',
      diameter: '139,820 km',
      orbitalPeriod: '11.9 Earth years',
      rotationPeriod: '9.9 hours (FASTEST rotation)',
      temperature: '-145°C',
      moons: 95,
      composition: 'Gas giant (hydrogen, helium)',
      facts: [
        'Largest planet in the solar system',
        'Great Red Spot: storm larger than Earth',
        'Protects inner planets from asteroids',
        'Has faint rings (discovered 1979)',
        'Fastest rotation creates visible bands',
        'More than 2× mass of all other planets combined'
      ],
      scientificData: {
        mass: '1.8982 × 10²⁷ kg',
        gravity: '24.79 m/s² (2.5× Earth)',
        escapeVelocity: '59.5 km/s',
        density: '1.326 g/cm³',
        albedo: '0.538'
      },
      weather: {
        today: 'Extremely Stormy',
        forecast: 'Massive, planet-sized hurricanes and lightning storms. The Great Red Spot continues its centuries-long rage.',
        windSpeed: 'Up to 620 km/h',
      }
    }
  },
  {
    id: 'alim',
    name: 'ALIM.my',
    fullName: 'Art & Law Initiative Malaysia',
    url: 'alim.my',
    category: 'Non-Profit',
    description: 'Cultural advocacy intersecting creative rights and legal frameworks.',
    color: '#64B4FF',
    orbit: 11.0,
    orbitSpeed: 105,
    rotationSpeed: 0.44,
    size: 232,
    frequency: 220,
    thumbnailUrl: '/assets/thumb-alim.png',
    status: 'live',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #93c5fd 0%, #3b82f6 40%, #1e40af 100%)',
      rings: true,
      atmosphere: true
    },
    astronomy: {
      realName: 'Saturn',
      symbol: '♄',
      distanceFromSun: '1.43 billion km',
      diameter: '116,460 km',
      orbitalPeriod: '29.5 Earth years',
      rotationPeriod: '10.7 hours',
      temperature: '-178°C',
      moons: 146,
      composition: 'Gas giant with spectacular rings',
      facts: [
        'Most beautiful and recognizable rings',
        'Could float in water (less dense)',
        'Hexagonal storm at north pole',
        'Second largest planet',
        'Rings made of ice and rock particles',
        'Titan (moon) has liquid methane lakes'
      ],
      scientificData: {
        mass: '5.6834 × 10²⁶ kg',
        gravity: '10.44 m/s² (1.07× Earth)',
        escapeVelocity: '35.5 km/s',
        density: '0.687 g/cm³ (lowest)',
        albedo: '0.499'
      },
       weather: {
        today: 'Violently Windy',
        forecast: 'Extremely high-speed winds and a massive hexagonal jet stream at the north pole. Cold and turbulent.',
        windSpeed: 'Up to 1,800 km/h',
      }
    }
  },
  {
    id: 'whitechick',
    name: 'Whitechick',
    fullName: 'Discography',
    url: 'whitechickmusic.raullee.com',
    category: 'Artist',
    description: 'Complete catalog under previous studio project. Indie dance / Leftfield Tech.',
    color: '#FF64B4',
    orbit: 12.8,
    orbitSpeed: 120,
    rotationSpeed: -0.72,
    size: 100,
    frequency: 440,
    thumbnailUrl: '/assets/thumb-wc.png',
    status: 'live',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #f9a8d4 0%, #ec4899 50%, #9f1239 100%)',
      rings: true,
      atmosphere: true,
      tilt: true
    },
    astronomy: {
      realName: 'Uranus',
      symbol: '♅',
      distanceFromSun: '2.87 billion km',
      diameter: '50,724 km',
      orbitalPeriod: '84 Earth years',
      rotationPeriod: '17.2 hours (sideways)',
      temperature: '-224°C (coldest atmosphere)',
      moons: 28,
      composition: 'Ice giant (water, methane, ammonia)',
      facts: [
        'Rotates on its side (98° tilt)',
        'Coldest planetary atmosphere',
        'Faint ring system (13 known rings)',
        'Blue-green color from methane',
        'Hit by massive object causing tilt',
        'Extreme seasons last 21 years each'
      ],
      scientificData: {
        mass: '8.6810 × 10²⁵ kg',
        gravity: '8.87 m/s² (0.9× Earth)',
        escapeVelocity: '21.3 km/s',
        density: '1.270 g/cm³',
        albedo: '0.488'
      },
      weather: {
        today: 'Frigid & Sideways',
        forecast: 'Extremely cold with bizarre seasons due to its axial tilt. One pole faces 21 years of continuous sunlight, then darkness.',
        windSpeed: 'Up to 900 km/h',
      }
    }
  },
  {
    id: 'crossing',
    name: 'The Crossing',
    fullName: 'Official Underground Showcase',
    url: 'thecrossingade.com',
    category: 'Event',
    description: "Sync Primitive's inaugural ADE party showcasing Malaysian artists / music alongside seasoned European underground contemporaries.",
    color: '#A464FF',
    orbit: 14.6, // Outer edge
    orbitSpeed: 135,
    rotationSpeed: 0.67,
    size: 97,
    frequency: 330,
    thumbnailUrl: '/assets/thumb-thecrossing.png',
    status: 'live',
    planet: {
      texture: 'radial-gradient(circle at 30% 30%, #c084fc 0%, #9333ea 50%, #581c87 100%)',
      rings: false,
      atmosphere: true
    },
    astronomy: {
      realName: 'Neptune',
      symbol: '♆',
      distanceFromSun: '4.5 billion km',
      diameter: '49,244 km',
      orbitalPeriod: '165 Earth years',
      rotationPeriod: '16 hours',
      temperature: '-214°C',
      moons: 16,
      composition: 'Ice giant with supersonic winds',
      facts: [
        'Farthest planet from the Sun',
        'Strongest winds in solar system (2,100 km/h)',
        'Deep blue color from methane',
        'Great Dark Spot storms',
        'Discovered by mathematics before observation',
        'Triton (moon) orbits backwards'
      ],
      scientificData: {
        mass: '1.02413 × 10²⁶ kg',
        gravity: '11.15 m/s² (1.14× Earth)',
        escapeVelocity: '23.5 km/s',
        density: '1.638 g/cm³',
        albedo: '0.442'
      },
      weather: {
        today: 'Supersonic Winds',
        forecast: 'The fastest winds in the Solar System whip around the planet, accompanied by massive, dark storms. Extremely cold.',
        windSpeed: 'Up to 2,100 km/h',
      }
    }
  }
];
