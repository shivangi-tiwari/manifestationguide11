export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'admin' | 'user'
  created_at: string
}

export interface Video {
  id: string
  title: string
  description: string
  youtube_id: string
  thumbnail_url?: string
  order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price_inr: number
  price_usd: number
  type: 'course' | 'session' | 'digital' | 'subscription'
  image_url?: string
  stripe_price_id?: string
  razorpay_plan_id?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  amount: number
  currency: 'INR' | 'USD'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_gateway: 'razorpay' | 'stripe'
  payment_id?: string
  created_at: string
  updated_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  title: string
  content: string
  image_url?: string
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  user?: User
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: User
}

export interface CoachingSession {
  id: string
  user_id: string
  title: string
  description: string
  duration_minutes: number
  price_inr: number
  price_usd: number
  cal_event_type_id?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  session_id: string
  start_time: string
  end_time: string
  status: 'confirmed' | 'cancelled' | 'completed'
  cal_booking_id?: string
  created_at: string
  updated_at: string
}

export interface SiteContent {
  about: {
    title: string
    content: string
    image_url?: string
  }
  hero: {
    title: string
    subtitle: string
    cta_text: string
    cta_link: string
    background_image?: string
  }
  contact: {
    email: string
    phone?: string
    address?: string
    social_links: {
      instagram?: string
      youtube?: string
      twitter?: string
      linkedin?: string
    }
  }
}