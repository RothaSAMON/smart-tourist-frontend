export type DestinationCategory = 'All' | 'Temple' | 'Island' | 'Nature' | 'Culture' | 'Nightlife'

export type VibeTag =
  | 'Family Friendly'
  | 'Adventure'
  | 'Culture'
  | 'Nature'
  | 'Nightlife'
  | 'Local Food'

export type UserRole = 'tourist' | 'business' | 'admin'

export type BusinessType =
  | 'Restaurant'
  | 'Hotel'
  | 'Coffee Shop'
  | 'Homestay'
  | 'Tour Guide'
  | 'Transportation'

export interface NearbyPlace {
  id: string
  name: string
  type: 'Restaurant' | 'Hotel'
  cuisineOrStyle: string
  priceRange: string
  rating: number
  distanceKm: number
  imageUrl: string
}

export interface AttractionReview {
  id: string
  attractionId: string
  author: string
  avatarUrl: string
  rating: number
  date: string
  comment: string
  photoUrl?: string
  status?: 'approved' | 'flagged'
}

export interface AttractionWeather {
  tempC: number
  condition: string
  humidity: number
  bestSeason: string
}

export interface DestinationAttraction {
  id: string
  name: string
  province: string
  location: string
  category: Exclude<DestinationCategory, 'All'>
  tags: VibeTag[]
  duration: string
  bestTime: string
  highlight: string
  entryFee: string
  ticketPriceUsd: number
  popularityScore: number
  distanceFromCenterKm: number
  rating: number
  reviewCount: number
  imageUrl: string
  gallery: string[]
  videoPreviewUrl: string
  description: string
  history: string
  openingHours: string
  coordinates: {
    lat: number
    lng: number
  }
  weather: AttractionWeather
  nearbyRestaurants: NearbyPlace[]
  nearbyHotels: NearbyPlace[]
  featured?: boolean
}

export interface SearchFilters {
  province: string
  attraction: string
}

export interface PlatformFeature {
  id: string
  title: string
  description: string
}

export interface AwardShowcaseItem {
  id: string
  attractionId: string
  name: string
  province: string
  location: string
  duration: string
  bestTime: string
  highlight: string
  entryFee: string
  rating: number
  thumbnailUrl: string
  heroImageUrl: string
}

export interface CustomerTestimonial {
  id: string
  name: string
  location: string
  rating: number
  quote: string
  avatarUrl: string
}

export interface ItineraryStop {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening'
  title: string
  type: 'Attraction' | 'Dining' | 'Experience'
  estimatedCostUsd: number
  notes: string
  attractionId?: string
}

export interface ItineraryDay {
  day: number
  theme: string
  weatherTip: string
  stops: ItineraryStop[]
}

export interface SavedTripPlan {
  id: string
  title: string
  prompt: string
  province: string
  daysCount: number
  budgetUsd: number
  estimatedTotalUsd: number
  season: string
  interests: VibeTag[]
  createdAt: string
  days: ItineraryDay[]
}

export interface BusinessService {
  id: string
  name: string
  category: BusinessType
  priceUsd: number
  unit: string
  available: boolean
}

export interface BusinessBooking {
  id: string
  guestName: string
  serviceName: string
  date: string
  guests: number
  totalUsd: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export interface AdminBusinessRecord {
  id: string
  name: string
  owner: string
  type: BusinessType
  province: string
  status: 'active' | 'pending' | 'suspended'
  rating: number
  monthlyViews: number
}

export interface AdminReportRecord {
  id: string
  targetType: 'Review' | 'Attraction' | 'Business'
  targetName: string
  reason: string
  reportedBy: string
  date: string
  status: 'open' | 'resolved'
}
