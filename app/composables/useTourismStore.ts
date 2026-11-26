import {
  INITIAL_ADMIN_BUSINESSES,
  INITIAL_ADMIN_REPORTS,
  INITIAL_BUSINESS_BOOKINGS,
  INITIAL_BUSINESS_SERVICES,
  INITIAL_REVIEWS,
  INITIAL_SAVED_PLANS,
  RECOMMENDED_ATTRACTIONS,
} from '@/data/home'
import type {
  AdminBusinessRecord,
  AdminReportRecord,
  AttractionReview,
  BusinessBooking,
  BusinessService,
  DestinationAttraction,
  SavedTripPlan,
  UserRole,
} from '@/types/tourism'

export interface MockUser {
  name: string
  email: string
  role: UserRole
  avatarUrl: string
}

export function useTourismStore() {
  const attractions = useState<DestinationAttraction[]>(
    'smarttour-attractions',
    () => [...RECOMMENDED_ATTRACTIONS],
  )
  const favoriteIds = useState<string[]>('smarttour-favorites', () => [
    'angkor-wat',
    'koh-rong-samloem',
  ])
  const reviews = useState<AttractionReview[]>('smarttour-reviews', () => [
    ...INITIAL_REVIEWS,
  ])
  const savedPlans = useState<SavedTripPlan[]>('smarttour-saved-plans', () => [
    ...INITIAL_SAVED_PLANS,
  ])
  const currentUser = useState<MockUser | null>('smarttour-user', () => ({
    name: 'Sophea Kem',
    email: 'sophea@smarttour.kh',
    role: 'tourist',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
  }))

  // Business portal mock state
  const businessServices = useState<BusinessService[]>(
    'smarttour-biz-services',
    () => [...INITIAL_BUSINESS_SERVICES],
  )
  const businessBookings = useState<BusinessBooking[]>(
    'smarttour-biz-bookings',
    () => [...INITIAL_BUSINESS_BOOKINGS],
  )

  // Admin console mock state
  const adminBusinesses = useState<AdminBusinessRecord[]>(
    'smarttour-admin-businesses',
    () => [...INITIAL_ADMIN_BUSINESSES],
  )
  const adminReports = useState<AdminReportRecord[]>(
    'smarttour-admin-reports',
    () => [...INITIAL_ADMIN_REPORTS],
  )

  function isFavorite(id: string) {
    return favoriteIds.value.includes(id)
  }

  function toggleFavorite(id: string) {
    if (favoriteIds.value.includes(id)) {
      favoriteIds.value = favoriteIds.value.filter((item) => item !== id)
    } else {
      favoriteIds.value = [...favoriteIds.value, id]
    }
  }

  function getAttractionById(id: string) {
    return attractions.value.find((item) => item.id === id)
  }

  function getReviewsForAttraction(attractionId: string) {
    return reviews.value.filter((rev) => rev.attractionId === attractionId)
  }

  function addReview(payload: {
    attractionId: string
    rating: number
    comment: string
    photoUrl?: string
  }) {
    const newReview: AttractionReview = {
      id: `rev-${Date.now()}`,
      attractionId: payload.attractionId,
      author: currentUser.value?.name ?? 'Guest Traveler',
      avatarUrl:
        currentUser.value?.avatarUrl ??
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80',
      rating: payload.rating,
      date: 'Just now',
      comment: payload.comment,
      photoUrl: payload.photoUrl?.trim() || undefined,
      status: 'approved',
    }
    reviews.value = [newReview, ...reviews.value]
  }

  function saveTripPlan(plan: SavedTripPlan) {
    savedPlans.value = [plan, ...savedPlans.value]
  }

  function removeTripPlan(id: string) {
    savedPlans.value = savedPlans.value.filter((plan) => plan.id !== id)
  }

  function loginMock(name: string, email: string, role: UserRole) {
    currentUser.value = {
      name: name.trim() || 'SmartTour Traveler',
      email: email.trim() || 'traveler@smarttour.kh',
      role,
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
    }
  }

  function logoutMock() {
    currentUser.value = null
  }

  return {
    attractions,
    favoriteIds,
    reviews,
    savedPlans,
    currentUser,
    businessServices,
    businessBookings,
    adminBusinesses,
    adminReports,
    isFavorite,
    toggleFavorite,
    getAttractionById,
    getReviewsForAttraction,
    addReview,
    saveTripPlan,
    removeTripPlan,
    loginMock,
    logoutMock,
  }
}
