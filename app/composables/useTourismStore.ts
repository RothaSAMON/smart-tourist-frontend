import {
  INITIAL_ADMIN_BUSINESSES,
  INITIAL_ADMIN_REPORTS,
  INITIAL_BUSINESS_BOOKINGS,
  INITIAL_BUSINESS_SERVICES,
  INITIAL_REVIEWS,
  INITIAL_SAVED_PLANS,
  RECOMMENDED_ATTRACTIONS,
} from '@/data/home'
import type { AuthUser } from '@/types/auth'
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

export const DEFAULT_PROFILE_IMAGE = '/icons/profile.png'

export interface MockUser {
  id?: number
  name: string
  email: string
  phone?: string | null
  status?: string
  role: UserRole
  roles?: string[]
  avatarUrl: string
}

export function useTourismStore() {
  const attractions = useState<DestinationAttraction[]>(
    'rokmerl-attractions',
    () => [...RECOMMENDED_ATTRACTIONS],
  )
  const favoriteIds = useState<string[]>('rokmerl-favorites', () => [
    'angkor-wat',
    'koh-rong-samloem',
  ])
  const reviews = useState<AttractionReview[]>('rokmerl-reviews', () => [
    ...INITIAL_REVIEWS,
  ])
  const savedPlans = useState<SavedTripPlan[]>('rokmerl-saved-plans', () => [
    ...INITIAL_SAVED_PLANS,
  ])
  const userCookie = useCookie<AuthUser | null>('auth_user', {
    sameSite: 'lax',
    default: () => null,
  })
  const currentUser = useState<MockUser | null>('rokmerl-user', () =>
    userCookie.value ? mapAuthUserToStoreUser(userCookie.value) : null,
  )

  // Business portal mock state
  const businessServices = useState<BusinessService[]>(
    'rokmerl-biz-services',
    () => [...INITIAL_BUSINESS_SERVICES],
  )
  const businessBookings = useState<BusinessBooking[]>(
    'rokmerl-biz-bookings',
    () => [...INITIAL_BUSINESS_BOOKINGS],
  )

  // Admin console mock state
  const adminBusinesses = useState<AdminBusinessRecord[]>(
    'rokmerl-admin-businesses',
    () => [...INITIAL_ADMIN_BUSINESSES],
  )
  const adminReports = useState<AdminReportRecord[]>(
    'rokmerl-admin-reports',
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
      avatarUrl: currentUser.value?.avatarUrl || DEFAULT_PROFILE_IMAGE,
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

  function mapAuthUserToStoreUser(user: AuthUser): MockUser {
    const normalizedType = user.user_type?.toLowerCase()
    const normalizedRoles = (user.roles ?? []).map((r) => r.toLowerCase())
    let role: UserRole = 'tourist'
    if (normalizedType === 'admin' || normalizedRoles.includes('admin')) {
      role = 'admin'
    } else if (
      normalizedType === 'business' ||
      normalizedRoles.includes('business')
    ) {
      role = 'business'
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role,
      roles: user.roles,
      avatarUrl: user.avatarUrl || DEFAULT_PROFILE_IMAGE,
    }
  }

  function setAuthUser(user: AuthUser) {
    currentUser.value = mapAuthUserToStoreUser(user)
  }

  function loginMock(name: string, email: string, role: UserRole) {
    currentUser.value = {
      name: name.trim() || 'RokMerl Traveler',
      email: email.trim() || 'traveler@rokmerl.kh',
      role,
      avatarUrl: DEFAULT_PROFILE_IMAGE,
    }
  }

  function logoutMock() {
    currentUser.value = null
    useCookie<string | null>('access_token').value = null
    useCookie<string | null>('token_type').value = null
    useCookie<AuthUser | null>('auth_user').value = null
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
    setAuthUser,
    loginMock,
    logoutMock,
  }
}
