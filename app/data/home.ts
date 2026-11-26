import type {
  AdminBusinessRecord,
  AdminReportRecord,
  AttractionReview,
  AwardShowcaseItem,
  BusinessBooking,
  BusinessService,
  BusinessType,
  CustomerTestimonial,
  DestinationAttraction,
  DestinationCategory,
  PlatformFeature,
  SavedTripPlan,
  VibeTag,
} from '@/types/tourism'

export const DESTINATION_CATEGORIES: DestinationCategory[] = [
  'All',
  'Temple',
  'Island',
  'Nature',
  'Culture',
  'Nightlife',
]

export const VIBE_TAGS: VibeTag[] = [
  'Family Friendly',
  'Adventure',
  'Culture',
  'Nature',
  'Nightlife',
  'Local Food',
]

export const BUSINESS_TYPES: BusinessType[] = [
  'Restaurant',
  'Hotel',
  'Coffee Shop',
  'Homestay',
  'Tour Guide',
  'Transportation',
]

export const CAMBODIA_PROVINCES = [
  'Siem Reap',
  'Phnom Penh',
  'Preah Sihanouk',
  'Kampot',
  'Kep',
  'Battambang',
]

export const HERO_AVATARS = [
  {
    name: 'Sophea Kem',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
  },
  {
    name: 'Dara Chan',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80',
  },
  {
    name: 'Elena Vance',
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&q=80',
  },
  {
    name: 'Sokha Mean',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80',
  },
]

export const HERO_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=2000&q=85'

export const RECOMMENDED_ATTRACTIONS: DestinationAttraction[] = [
  {
    id: 'angkor-wat',
    name: 'Angkor Wat',
    province: 'Siem Reap',
    location: 'Siem Reap, Cambodia',
    category: 'Temple',
    tags: ['Culture', 'Family Friendly', 'Adventure'],
    duration: 'Half Day',
    bestTime: 'Sunrise',
    highlight: 'UNESCO Heritage',
    entryFee: '$37/pass',
    ticketPriceUsd: 37,
    popularityScore: 99,
    distanceFromCenterKm: 6.5,
    rating: 4.9,
    reviewCount: 4820,
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'The largest religious monument in the world and the iconic symbol of Cambodia. Surrounded by a vast moat, Angkor Wat showcases classical Khmer architecture, intricate bas-relief galleries, and unforgettable lotus-bud towers reflected at sunrise.',
    history:
      'Built in the early 12th century by King Suryavarman II as a Hindu temple dedicated to Vishnu, Angkor Wat gradually transformed into a Buddhist temple toward the end of the 12th century and remains an active spiritual sanctuary today.',
    openingHours: '05:00 AM – 05:30 PM (Daily)',
    coordinates: { lat: 13.4125, lng: 103.867 },
    weather: {
      tempC: 31,
      condition: 'Partly Sunny',
      humidity: 64,
      bestSeason: 'Nov – Feb (Cool & Dry)',
    },
    nearbyRestaurants: [
      {
        id: 'nr-1',
        name: 'Cuisine Wat Damnak',
        type: 'Restaurant',
        cuisineOrStyle: 'Fine Khmer Dining',
        priceRange: '$25 – $45',
        rating: 4.9,
        distanceKm: 5.8,
        imageUrl:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'nr-2',
        name: 'Chanrey Tree Khmer Kitchen',
        type: 'Restaurant',
        cuisineOrStyle: 'Authentic Amok & Grill',
        priceRange: '$10 – $22',
        rating: 4.7,
        distanceKm: 5.4,
        imageUrl:
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-1',
        name: 'Phum Baitang Resort',
        type: 'Hotel',
        cuisineOrStyle: 'Luxury Villa Resort',
        priceRange: '$180/night',
        rating: 4.9,
        distanceKm: 7.2,
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'nh-2',
        name: 'Viroth’s Boutique Hotel',
        type: 'Hotel',
        cuisineOrStyle: 'Modern Tropical Boutique',
        priceRange: '$95/night',
        rating: 4.8,
        distanceKm: 6.0,
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80',
      },
    ],
    featured: true,
  },
  {
    id: 'koh-rong-samloem',
    name: 'Koh Rong Samloem',
    province: 'Preah Sihanouk',
    location: 'Preah Sihanouk, Cambodia',
    category: 'Island',
    tags: ['Nature', 'Family Friendly', 'Adventure'],
    duration: 'Full Day',
    bestTime: 'Nov – Apr',
    highlight: 'Turquoise Bay',
    entryFee: '$25/ferry',
    ticketPriceUsd: 25,
    popularityScore: 95,
    distanceFromCenterKm: 24.0,
    rating: 4.8,
    reviewCount: 2140,
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'A tranquil island paradise off the southern coast of Cambodia famed for powdery white sand at Saracen Bay, glowing bioluminescent plankton at night, and clear coral reefs ideal for snorkeling.',
    history:
      'Once a quiet fishing outpost with a French colonial lighthouse perched on its southern headland, Koh Rong Samloem has evolved into an eco-conscious island retreat preserving dense jungle interiors.',
    openingHours: 'Open 24 Hours (Speed ferries 08:00 AM – 04:00 PM)',
    coordinates: { lat: 10.5947, lng: 103.3075 },
    weather: {
      tempC: 29,
      condition: 'Sunny & Breezy',
      humidity: 72,
      bestSeason: 'Nov – Apr (Calm Sea)',
    },
    nearbyRestaurants: [
      {
        id: 'nr-3',
        name: 'Saracen Bay Seafood Grill',
        type: 'Restaurant',
        cuisineOrStyle: 'Fresh Kampot Pepper Crab',
        priceRange: '$12 – $24',
        rating: 4.7,
        distanceKm: 0.4,
        imageUrl:
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-3',
        name: 'Sol Beach Eco Bungalows',
        type: 'Hotel',
        cuisineOrStyle: 'Beachfront Eco Resort',
        priceRange: '$85/night',
        rating: 4.8,
        distanceKm: 0.3,
        imageUrl:
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'royal-palace-phnom-penh',
    name: 'Royal Palace & Silver Pagoda',
    province: 'Phnom Penh',
    location: 'Phnom Penh, Cambodia',
    category: 'Culture',
    tags: ['Culture', 'Family Friendly'],
    duration: '2–3 Hours',
    bestTime: 'Morning',
    highlight: 'Khmer Architecture',
    entryFee: '$10/entry',
    ticketPriceUsd: 10,
    popularityScore: 93,
    distanceFromCenterKm: 1.5,
    rating: 4.7,
    reviewCount: 3190,
    imageUrl:
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'Set along the Tonle Sap riverfront, this gleaming complex of golden spires, manicured gardens, and the Silver Pagoda (floored with over 5,000 silver tiles) is the official residence of the King of Cambodia.',
    history:
      'Constructed in 1866 under King Norodom after the royal capital relocated from Oudong to Phnom Penh, the palace blends classic Khmer roofs with ceremonial pavilions.',
    openingHours: '08:00 AM – 11:00 AM, 02:00 PM – 05:00 PM',
    coordinates: { lat: 11.5639, lng: 104.9313 },
    weather: {
      tempC: 32,
      condition: 'Warm & Clear',
      humidity: 66,
      bestSeason: 'Nov – Feb',
    },
    nearbyRestaurants: [
      {
        id: 'nr-4',
        name: 'Malis Restaurant Phnom Penh',
        type: 'Restaurant',
        cuisineOrStyle: 'Living Cambodian Cuisine',
        priceRange: '$18 – $35',
        rating: 4.8,
        distanceKm: 0.9,
        imageUrl:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-4',
        name: 'Palace Gate Hotel & Residence',
        type: 'Hotel',
        cuisineOrStyle: 'Heritage Boutique Hotel',
        priceRange: '$110/night',
        rating: 4.8,
        distanceKm: 0.4,
        imageUrl:
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'bokor-national-park',
    name: 'Bokor National Park',
    province: 'Kampot',
    location: 'Kampot, Cambodia',
    category: 'Nature',
    tags: ['Nature', 'Adventure', 'Family Friendly'],
    duration: 'Full Day',
    bestTime: 'Morning',
    highlight: 'Cloud Forest',
    entryFee: 'Free Entry',
    ticketPriceUsd: 0,
    popularityScore: 89,
    distanceFromCenterKm: 32.0,
    rating: 4.8,
    reviewCount: 1680,
    imageUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'Rising over 1,000 meters above the Gulf of Thailand, Preah Monivong Bokor National Park offers cool misty ridges, Popokvil Waterfall, dramatic cliffside temples, and panoramic coastal views.',
    history:
      'Established as a cool-weather mountain hill station in the 1920s, Bokor blends atmospheric historic landmarks with protected Elephant Mountain rainforest.',
    openingHours: '06:00 AM – 06:00 PM (Daily)',
    coordinates: { lat: 10.6333, lng: 104.0167 },
    weather: {
      tempC: 23,
      condition: 'Cool & Misty',
      humidity: 80,
      bestSeason: 'Oct – Mar',
    },
    nearbyRestaurants: [
      {
        id: 'nr-5',
        name: 'Kampot Riverfront Pepper House',
        type: 'Restaurant',
        cuisineOrStyle: 'Kampot Pepper Specialties',
        priceRange: '$8 – $18',
        rating: 4.7,
        distanceKm: 18.0,
        imageUrl:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-5',
        name: 'Amber Kampot Riverside',
        type: 'Hotel',
        cuisineOrStyle: 'Riverside Pool Villas',
        priceRange: '$130/night',
        rating: 4.8,
        distanceKm: 16.5,
        imageUrl:
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'phnom-kulen-waterfall',
    name: 'Phnom Kulen Waterfall',
    province: 'Siem Reap',
    location: 'Siem Reap, Cambodia',
    category: 'Nature',
    tags: ['Nature', 'Adventure', 'Family Friendly', 'Culture'],
    duration: 'Full Day',
    bestTime: 'Dry Season',
    highlight: 'Sacred Mountain',
    entryFee: '$20/entry',
    ticketPriceUsd: 20,
    popularityScore: 91,
    distanceFromCenterKm: 48.0,
    rating: 4.7,
    reviewCount: 1940,
    imageUrl:
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'Cambodia’s most sacred mountain plateau featuring a two-tiered emerald waterfall for swimming, the River of a Thousand Lingas carved into the riverbed, and a hilltop reclining Buddha.',
    history:
      'In 802 CE, King Jayavarman II proclaimed the birth of the Khmer Empire atop Phnom Kulen, whose sandstone quarries later supplied the stone to build Angkor Wat.',
    openingHours: '07:00 AM – 04:00 PM (Uphill traffic before 11:30 AM)',
    coordinates: { lat: 13.5667, lng: 104.1167 },
    weather: {
      tempC: 27,
      condition: 'Forest Breeze',
      humidity: 74,
      bestSeason: 'Nov – Mar',
    },
    nearbyRestaurants: [
      {
        id: 'nr-6',
        name: 'Kulen Bamboo Hammock Kitchen',
        type: 'Restaurant',
        cuisineOrStyle: 'Grilled Chicken & Papaya Salad',
        priceRange: '$5 – $12',
        rating: 4.6,
        distanceKm: 0.6,
        imageUrl:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-6',
        name: 'Banteay Srei Eco Lodge',
        type: 'Hotel',
        cuisineOrStyle: 'Countryside Homestay',
        priceRange: '$45/night',
        rating: 4.7,
        distanceKm: 18.0,
        imageUrl:
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'phnom-sampeau',
    name: 'Phnom Sampeau & Bat Cave',
    province: 'Battambang',
    location: 'Battambang, Cambodia',
    category: 'Culture',
    tags: ['Culture', 'Adventure', 'Nature'],
    duration: '3–4 Hours',
    bestTime: 'Sunset',
    highlight: 'Hilltop Pagoda',
    entryFee: '$3/entry',
    ticketPriceUsd: 3,
    popularityScore: 86,
    distanceFromCenterKm: 12.0,
    rating: 4.6,
    reviewCount: 1250,
    imageUrl:
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'A dramatic limestone mountain rising above Battambang’s rice fields, crowned with gleaming pagodas and famous for the nightly spectacle of millions of bats streaming out at dusk.',
    history:
      'Steeped in Khmer folklore about Princess Rumsay Sok and modern Cambodian remembrance, Phnom Sampeau is both a spiritual hilltop and a striking natural wonder.',
    openingHours: '06:00 AM – 07:00 PM (Bat exodus ~5:45 PM)',
    coordinates: { lat: 13.0217, lng: 103.0992 },
    weather: {
      tempC: 30,
      condition: 'Golden Dusk',
      humidity: 62,
      bestSeason: 'Nov – Feb',
    },
    nearbyRestaurants: [
      {
        id: 'nr-7',
        name: 'Jaan Bai Social Kitchen',
        type: 'Restaurant',
        cuisineOrStyle: 'Modern Battambang Flavors',
        priceRange: '$8 – $16',
        rating: 4.8,
        distanceKm: 11.5,
        imageUrl:
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-7',
        name: 'Maisons Wat Kor',
        type: 'Hotel',
        cuisineOrStyle: 'Traditional Wooden Stilt Resort',
        priceRange: '$75/night',
        rating: 4.8,
        distanceKm: 9.8,
        imageUrl:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'pub-street-siem-reap',
    name: 'Pub Street & Angkor Night Market',
    province: 'Siem Reap',
    location: 'Siem Reap, Cambodia',
    category: 'Nightlife',
    tags: ['Nightlife', 'Local Food', 'Culture'],
    duration: '2–4 Hours',
    bestTime: 'Evening',
    highlight: 'Street Food & Music',
    entryFee: 'Free Entry',
    ticketPriceUsd: 0,
    popularityScore: 90,
    distanceFromCenterKm: 0.5,
    rating: 4.6,
    reviewCount: 2890,
    imageUrl:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'Siem Reap’s vibrant pedestrian quarter glowing with lanterns, Khmer street food stalls, artisan craft markets, rooftop cocktail bars, and live acoustic performances.',
    history:
      'Centered around Old Market (Psar Chas), this lively district grew alongside Angkor tourism into Cambodia’s most famous evening dining and cultural hub.',
    openingHours: '05:00 PM – 02:00 AM (Daily)',
    coordinates: { lat: 13.3548, lng: 103.8548 },
    weather: {
      tempC: 27,
      condition: 'Warm Evening',
      humidity: 68,
      bestSeason: 'Year-round',
    },
    nearbyRestaurants: [
      {
        id: 'nr-8',
        name: 'Khmer Grill Street Kitchen',
        type: 'Restaurant',
        cuisineOrStyle: 'Lok Lak & Num Banh Chok',
        priceRange: '$4 – $10',
        rating: 4.7,
        distanceKm: 0.1,
        imageUrl:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-8',
        name: 'Lub d Siem Reap Boutique',
        type: 'Hotel',
        cuisineOrStyle: 'Social Boutique Stay',
        priceRange: '$38/night',
        rating: 4.7,
        distanceKm: 0.4,
        imageUrl:
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'kep-crab-market-beach',
    name: 'Kep Crab Market & National Park',
    province: 'Kep',
    location: 'Kep, Cambodia',
    category: 'Island',
    tags: ['Local Food', 'Nature', 'Family Friendly'],
    duration: 'Half Day',
    bestTime: 'Late Afternoon',
    highlight: 'Coastal Seafood',
    entryFee: 'Free Entry',
    ticketPriceUsd: 0,
    popularityScore: 87,
    distanceFromCenterKm: 2.0,
    rating: 4.7,
    reviewCount: 1420,
    imageUrl:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    ],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      'Famous across Southeast Asia for freshly steamed blue swimmer crab cooked with green Kampot peppercorns right by the sea, paired with breezy jungle hiking loops in Kep National Park.',
    history:
      'Once Cambodia’s glamorous 1950s seaside resort town, Kep retains a peaceful coastal charm loved by food travelers and families.',
    openingHours: '07:00 AM – 09:00 PM (Daily)',
    coordinates: { lat: 10.4833, lng: 104.2944 },
    weather: {
      tempC: 29,
      condition: 'Sea Breeze',
      humidity: 71,
      bestSeason: 'Nov – Apr',
    },
    nearbyRestaurants: [
      {
        id: 'nr-9',
        name: 'Kimly Seafood Pavilion',
        type: 'Restaurant',
        cuisineOrStyle: 'Kampot Pepper Crab',
        priceRange: '$10 – $20',
        rating: 4.8,
        distanceKm: 0.2,
        imageUrl:
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
      },
    ],
    nearbyHotels: [
      {
        id: 'nh-9',
        name: 'Knai Bang Chatt Resort',
        type: 'Hotel',
        cuisineOrStyle: 'Seaside Heritage Villas',
        priceRange: '$145/night',
        rating: 4.9,
        distanceKm: 1.1,
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
]

export const INITIAL_REVIEWS: AttractionReview[] = [
  {
    id: 'rev-1',
    attractionId: 'angkor-wat',
    author: 'Sophea Kem',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
    rating: 5,
    date: '2 days ago',
    comment:
      'Arrived at 5:15 AM for sunrise over the reflection pond. The SmartTour crowd tip saved us so much time!',
    photoUrl:
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
  },
  {
    id: 'rev-2',
    attractionId: 'angkor-wat',
    author: 'Daniel Brooks',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80',
    rating: 5,
    date: '1 week ago',
    comment:
      'Hiring a local licensed guide made the bas-relief stories come alive. Easily the highlight of our Cambodia trip.',
    status: 'approved',
  },
  {
    id: 'rev-3',
    attractionId: 'koh-rong-samloem',
    author: 'Amina Patel',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=80',
    rating: 5,
    date: '5 days ago',
    comment:
      'Crystal-clear water and zero traffic noise. Sunset on Lazy Beach was unforgettable.',
    status: 'approved',
  },
]

export const INITIAL_SAVED_PLANS: SavedTripPlan[] = [
  {
    id: 'plan-siem-reap-3d',
    title: '3-Day Siem Reap Nature & Local Food Escape',
    prompt:
      'I have 3 days in Siem Reap with a budget of $250. I like nature and local food.',
    province: 'Siem Reap',
    daysCount: 3,
    budgetUsd: 250,
    estimatedTotalUsd: 228,
    season: 'Dry / Cool (Nov – Feb)',
    interests: ['Nature', 'Local Food', 'Culture'],
    createdAt: 'Saved today',
    days: [
      {
        day: 1,
        theme: 'Sunrise Heritage & Authentic Khmer Flavors',
        weatherTip: '31°C · Partly Sunny — start at 5:00 AM for cool morning light',
        stops: [
          {
            timeOfDay: 'Morning',
            title: 'Angkor Wat Sunrise & Inner Galleries',
            type: 'Attraction',
            estimatedCostUsd: 37,
            notes: '1-day Angkor Pass + tuk-tuk from town ($15 split/solo).',
            attractionId: 'angkor-wat',
          },
          {
            timeOfDay: 'Afternoon',
            title: 'Khmer Amok Lunch at Chanrey Tree & Lotus Farm Walk',
            type: 'Dining',
            estimatedCostUsd: 18,
            notes: 'Try traditional Fish Amok and fresh lotus tea.',
          },
          {
            timeOfDay: 'Evening',
            title: 'Pub Street & Angkor Night Market Food Crawl',
            type: 'Experience',
            estimatedCostUsd: 16,
            notes: 'Sample grilled skewers, Num Banh Chok, and mango sticky rice.',
            attractionId: 'pub-street-siem-reap',
          },
        ],
      },
      {
        day: 2,
        theme: 'Sacred Mountain & Jungle Waterfall',
        weatherTip: '27°C · Forest Breeze — bring swimwear and light hiking sandals',
        stops: [
          {
            timeOfDay: 'Morning',
            title: 'Phnom Kulen Waterfall & River of a Thousand Lingas',
            type: 'Attraction',
            estimatedCostUsd: 45,
            notes: '$20 park entry + shared minivan ($25). Depart by 7:30 AM.',
            attractionId: 'phnom-kulen-waterfall',
          },
          {
            timeOfDay: 'Afternoon',
            title: 'Hammock Lunch at Kulen Bamboo Kitchen',
            type: 'Dining',
            estimatedCostUsd: 12,
            notes: 'Charcoal-grilled mountain chicken with green papaya salad.',
          },
          {
            timeOfDay: 'Evening',
            title: 'Phare, The Cambodian Circus & Riverside Dinner',
            type: 'Experience',
            estimatedCostUsd: 28,
            notes: 'World-class Khmer acrobatics supporting local youth.',
          },
        ],
      },
      {
        day: 3,
        theme: 'Countryside Cycling & Coffee Roasters',
        weatherTip: '30°C · Clear Skies — ideal for morning cycling',
        stops: [
          {
            timeOfDay: 'Morning',
            title: 'Rice Paddy Cycling Tour & Local Morning Market',
            type: 'Experience',
            estimatedCostUsd: 22,
            notes: 'Explore quiet village trails and taste freshly steamed palm cakes.',
          },
          {
            timeOfDay: 'Afternoon',
            title: 'Specialty Cambodian Coffee & Artisan Souvenirs',
            type: 'Dining',
            estimatedCostUsd: 15,
            notes: 'Relax at a shaded garden cafe in Wat Bo neighborhood.',
          },
          {
            timeOfDay: 'Evening',
            title: 'Farewell Khmer Tasting Menu',
            type: 'Dining',
            estimatedCostUsd: 35,
            notes: 'Celebrate your trip with seasonal Siem Reap dishes.',
          },
        ],
      },
    ],
  },
]

export const INITIAL_BUSINESS_SERVICES: BusinessService[] = [
  {
    id: 'srv-1',
    name: 'Angkor Sunrise Private Tuk-Tuk & Guide',
    category: 'Tour Guide',
    priceUsd: 45,
    unit: 'per group',
    available: true,
  },
  {
    id: 'srv-2',
    name: 'Traditional Khmer Amok Tasting Dinner',
    category: 'Restaurant',
    priceUsd: 24,
    unit: 'per guest',
    available: true,
  },
  {
    id: 'srv-3',
    name: 'Garden Pool Villa (Breakfast Included)',
    category: 'Homestay',
    priceUsd: 68,
    unit: 'per night',
    available: true,
  },
  {
    id: 'srv-4',
    name: 'Airport to Siem Reap Private SUV Transfer',
    category: 'Transportation',
    priceUsd: 35,
    unit: 'per trip',
    available: true,
  },
]

export const INITIAL_BUSINESS_BOOKINGS: BusinessBooking[] = [
  {
    id: 'bk-101',
    guestName: 'Elena Vance',
    serviceName: 'Angkor Sunrise Private Tuk-Tuk & Guide',
    date: '2026-12-02',
    guests: 2,
    totalUsd: 45,
    status: 'pending',
  },
  {
    id: 'bk-102',
    guestName: 'Marcus Chen',
    serviceName: 'Garden Pool Villa (Breakfast Included)',
    date: '2026-12-04',
    guests: 3,
    totalUsd: 204,
    status: 'confirmed',
  },
  {
    id: 'bk-103',
    guestName: 'Sophea Kem',
    serviceName: 'Traditional Khmer Amok Tasting Dinner',
    date: '2026-12-05',
    guests: 4,
    totalUsd: 96,
    status: 'pending',
  },
  {
    id: 'bk-104',
    guestName: 'Lucas Meyer',
    serviceName: 'Airport to Siem Reap Private SUV Transfer',
    date: '2026-11-28',
    guests: 2,
    totalUsd: 35,
    status: 'completed',
  },
]

export const INITIAL_ADMIN_BUSINESSES: AdminBusinessRecord[] = [
  {
    id: 'ab-1',
    name: 'Chanrey Tree Khmer Kitchen',
    owner: 'Vanna Sok',
    type: 'Restaurant',
    province: 'Siem Reap',
    status: 'active',
    rating: 4.8,
    monthlyViews: 4280,
  },
  {
    id: 'ab-2',
    name: 'Sol Beach Eco Bungalows',
    owner: 'Rithy Pich',
    type: 'Hotel',
    province: 'Preah Sihanouk',
    status: 'active',
    rating: 4.8,
    monthlyViews: 3150,
  },
  {
    id: 'ab-3',
    name: 'Kampot Pepper Roastery Cafe',
    owner: 'Nary Chhim',
    type: 'Coffee Shop',
    province: 'Kampot',
    status: 'pending',
    rating: 4.9,
    monthlyViews: 920,
  },
  {
    id: 'ab-4',
    name: 'Angkor Heritage Licensed Guides',
    owner: 'Bora Chea',
    type: 'Tour Guide',
    province: 'Siem Reap',
    status: 'pending',
    rating: 4.9,
    monthlyViews: 1540,
  },
]

export const INITIAL_ADMIN_REPORTS: AdminReportRecord[] = [
  {
    id: 'rep-1',
    targetType: 'Review',
    targetName: 'Angkor Wat — Spam promotional link',
    reason: 'Off-topic advertisement',
    reportedBy: 'Dara Chan',
    date: '2026-11-25',
    status: 'open',
  },
  {
    id: 'rep-2',
    targetType: 'Attraction',
    targetName: 'Phnom Kulen Waterfall — Ticket update',
    reason: 'Opening hour adjustment request',
    reportedBy: 'Local Guide Team',
    date: '2026-11-24',
    status: 'open',
  },
  {
    id: 'rep-3',
    targetType: 'Business',
    targetName: 'Kep Express Van Service',
    reason: 'Outdated contact number',
    reportedBy: 'Amina Patel',
    date: '2026-11-20',
    status: 'resolved',
  },
]

export const UNIQUE_FEATURES: PlatformFeature[] = [
  {
    id: 'smart-local-picks',
    title: 'Smart AI Itinerary Builder',
    description:
      'Tell us your budget, days, and travel style — our AI generates a personalized day-by-day Cambodia trip plan in seconds.',
  },
  {
    id: 'transparent-travel-info',
    title: 'Interactive Map & Local Insights',
    description:
      'Explore attractions with live weather, history, ticket prices, opening hours, and nearby restaurants and hotels.',
  },
  {
    id: 'seasonal-guidance',
    title: 'Best-Time Travel Guidance',
    description:
      'Plan around sunrise crowds at Angkor Wat, calm island ferries in Koh Rong, and cool misty mornings on Bokor Mountain.',
  },
  {
    id: 'multi-province-planning',
    title: 'Verified Local Businesses',
    description:
      'Connect directly with Cambodian restaurants, boutique homestays, coffee shops, tour guides, and trusted transport.',
  },
]

export const FEATURE_COLLAGE_IMAGES = {
  mainCity:
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=80',
  insetTower:
    'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=700&q=80',
}

export const AWARD_SHOWCASE_ITEMS: AwardShowcaseItem[] = [
  {
    id: 'angkor-wat-spotlight',
    attractionId: 'angkor-wat',
    name: 'Angkor Wat',
    province: 'Siem Reap',
    location: 'Siem Reap, Cambodia',
    duration: 'Half Day',
    bestTime: 'Sunrise',
    highlight: 'UNESCO Heritage',
    entryFee: '$37/pass',
    rating: 4.9,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=400&q=80',
    heroImageUrl:
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'koh-rong-spotlight',
    attractionId: 'koh-rong-samloem',
    name: 'Koh Rong Samloem',
    province: 'Preah Sihanouk',
    location: 'Preah Sihanouk, Cambodia',
    duration: 'Full Day',
    bestTime: 'Nov – Apr',
    highlight: 'White Sand Beach',
    entryFee: '$25/ferry',
    rating: 4.8,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    heroImageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'royal-palace-spotlight',
    attractionId: 'royal-palace-phnom-penh',
    name: 'Royal Palace',
    province: 'Phnom Penh',
    location: 'Phnom Penh, Cambodia',
    duration: '2–3 Hours',
    bestTime: 'Morning',
    highlight: 'Royal Heritage',
    entryFee: '$10/entry',
    rating: 4.7,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80',
    heroImageUrl:
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'bokor-mountain-spotlight',
    attractionId: 'bokor-national-park',
    name: 'Bokor Hill Station',
    province: 'Kampot',
    location: 'Kampot, Cambodia',
    duration: 'Full Day',
    bestTime: 'Morning',
    highlight: 'Mountain Views',
    entryFee: 'Free Entry',
    rating: 4.8,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
    heroImageUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'phnom-sampeau-spotlight',
    attractionId: 'phnom-sampeau',
    name: 'Phnom Sampeau',
    province: 'Battambang',
    location: 'Battambang, Cambodia',
    duration: '3–4 Hours',
    bestTime: 'Sunset',
    highlight: 'Bat Cave & Pagoda',
    entryFee: '$3/entry',
    rating: 4.6,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=400&q=80',
    heroImageUrl:
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1800&q=85',
  },
]

export const CUSTOMER_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 't-1',
    name: 'Sophea Kem',
    location: 'Phnom Penh, Cambodia',
    rating: 5,
    quote:
      'SmartTour helped our family plan a weekend in Kampot and Bokor National Park. Every spot recommended was breathtaking and easy to reach.',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 't-2',
    name: 'Daniel Brooks',
    location: 'United Kingdom',
    rating: 5,
    quote:
      'I typed "3 days in Siem Reap with $250 for nature and local food" and got an unforgettable sunrise + Kulen waterfall itinerary in seconds.',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 't-3',
    name: 'Dara Chan',
    location: 'Siem Reap, Cambodia',
    rating: 5,
    quote:
      'Had an amazing experience discovering Cambodia with SmartTour! From Angkor Wat to Koh Rong Samloem, every recommendation was spot on. Highly recommend!',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 't-4',
    name: 'Amina Patel',
    location: 'Singapore',
    rating: 5,
    quote:
      'Filtering by province and seeing nearby Khmer restaurants right on the attraction page made planning our 5-day route effortless.',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 't-5',
    name: 'Sokha Mean',
    location: 'Battambang, Cambodia',
    rating: 5,
    quote:
      'Love seeing Cambodian destinations showcased so clearly with best visiting times, weather tips, and entry details all in one place.',
    avatarUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80',
  },
]
