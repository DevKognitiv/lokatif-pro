export type Screen =
  | 'auth'
  | 'onboarding'
  | 'home'
  | 'property-detail'
  | 'map'
  | 'filters'
  | 'favorites'
  | 'compare'
  | 'messages'
  | 'chat'
  | 'notifications'
  | 'payment'
  | 'mobile-money'
  | 'documents'
  | 'schedule-visit'
  | 'landlord-dashboard'
  | 'landlord-tenants'
  | 'landlord-revenue'
  | 'post-listing'
  | 'edit-listing'
  | 'profile'
  | 'profile-edit'
  | 'profile-settings'
  | 'profile-verification'
  | 'saved-searches'
  | 'referral'
  | 'plans'
  | 'boost'
  | 'reviews'
  | 'admin';

export type UserRole = 'locataire' | 'propriétaire' | 'admin';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  rating: number;
  reviews: number;
  since: string;
  verified: boolean;
  phone?: string;
  email?: string;
  bio?: string;
  totalListings?: number;
  totalRented?: number;
  responseRate?: number;
  responseTime?: string;
  languages?: string[];
  badges?: Badge[];
  plan?: 'free' | 'pro' | 'premium';
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export type PropertyType = 'Appartement' | 'Villa' | 'Studio' | 'Maison' | 'Duplex' | 'Bureau' | 'Commerce';
export type PropertyStatus = 'libre' | 'occupé' | 'réservé' | 'en_vente';

export interface Property {
  id: string;
  title: string;
  price: number;
  priceUnit: 'FCFA/mois' | 'FCFA';
  location: string;
  neighborhood: string;
  city: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  images: string[];
  verified: boolean;
  popular: boolean;
  featured?: boolean;
  amenities: string[];
  description: string;
  landlord: User;
  views: number;
  requests: number;
  status: PropertyStatus;
  lat?: number;
  lng?: number;
  yearBuilt?: number;
  deposit?: number;
  availableFrom?: string;
  virtualTour?: boolean;
  rating?: number;
  reviewCount?: number;
  boostLevel?: 0 | 1 | 2 | 3;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  hasFile?: boolean;
  propertyId?: string;
  propertyTitle?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'file' | 'image' | 'system';
  fileName?: string;
  fileSize?: string;
  imageUrl?: string;
}

export type NotificationType = 'message' | 'listing' | 'visit' | 'payment' | 'price' | 'system' | 'review';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionScreen?: Screen;
  propertyId?: string;
}

export interface Document {
  id: string;
  name: string;
  date: string;
  action: 'download' | 'sign' | 'view';
  status?: 'signed' | 'pending' | 'expired';
  size?: string;
  type?: 'bail' | 'quittance' | 'etat_lieux' | 'autre';
}

export interface PaymentRecord {
  id: string;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'late' | 'failed';
  method?: 'wave' | 'orange_money' | 'mtn' | 'bank' | 'cash';
  receiptUrl?: string;
  paidAt?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterState;
  alertEnabled: boolean;
  createdAt: string;
  newResults?: number;
}

export interface FilterState {
  type: PropertyType | 'all';
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'any';
  bathrooms: number | 'any';
  minArea: number;
  maxArea: number;
  neighborhood: string;
  amenities: string[];
  status: PropertyStatus | 'all';
  verified: boolean;
  virtualTour: boolean;
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
}

export interface Review {
  id: string;
  author: User;
  rating: number;
  comment: string;
  date: string;
  propertyId?: string;
  type: 'landlord' | 'tenant' | 'property';
  response?: string;
}

export interface LandlordStats {
  totalProperties: number;
  occupiedProperties: number;
  monthlyRevenue: number;
  totalTenants: number;
  pendingRequests: number;
  averageRating: number;
  totalViews: number;
  conversionRate: number;
  revenueHistory: { month: string; revenue: number }[];
  occupancyHistory: { month: string; rate: number }[];
}

export interface Plan {
  id: 'free' | 'pro' | 'premium';
  name: string;
  price: number;
  features: string[];
  highlighted?: boolean;
  color: string;
}

export interface Neighborhood {
  name: string;
  count: number;
  color: string;
  icon: string;
  avgPrice?: number;
  trend?: 'up' | 'down' | 'stable';
}
