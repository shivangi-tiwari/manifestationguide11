import Link from 'next/link'
import { Play, ArrowRight, Mail, Phone, MapPin, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react'

export default function Home() {
  const siteContent = {
    hero: {
      title: 'Manifest Your Dream Reality',
      subtitle: 'Transform your life through proven manifestation techniques, personalized coaching, and a supportive community.',
      cta_text: 'Start Your Journey',
      cta_link: '#community',
    },
    about: {
      title: 'About [Coach Name]',
      content: 'With over 10 years of experience in manifestation coaching and spiritual guidance, I\'ve helped thousands of clients worldwide transform their reality using the power of the Law of Attraction, Neville Goddard\'s teachings, and modern mindset techniques.',
      image_url: '/about-image.jpg',
    },
    videos: [
      { id: 'dQw4w9WgXcQ', title: 'The Science of Manifestation', description: 'Understanding how manifestation actually works' },
      { id: 'dQw4w9WgXcQ', title: 'Daily Manifestation Routine', description: 'A 10-minute practice for powerful results' },
      { id: 'dQw4w9WgXcQ', title: 'Overcoming Limiting Beliefs', description: 'Identify and release blocks holding you back' },
      { id: 'dQw4w9WgXcQ', title: 'Visualization Techniques That Work', description: 'Advanced visualization for faster manifestation' },
    ],
    products: [
      { id: '1', name: 'Manifestation Mastery Course', description: 'Complete 8-week program to master manifestation', price_inr: 15000, price_usd: 197, type: 'course', image_url: '/course-1.jpg' },
      { id: '2', name: 'Private Coaching Session', description: '60-minute 1:1 manifestation coaching', price_inr: 8000, price_usd: 97, type: 'session', image_url: '/session-1.jpg' },
      { id: '3', name: 'Abundance Meditation Bundle', description: '7 guided meditations for wealth & success', price_inr: 3000, price_usd: 37, type: 'digital', image_url: '/meditation-1.jpg' },
      { id: '4', name: 'Monthly Membership', description: 'Weekly live calls, community, resources', price_inr: 2000, price_usd: 27, type: 'subscription', image_url: '/membership-1.jpg' },
    ],
    contact: {
      email: 'hello@manifestcoach.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, India | Available Worldwide Online',
      social_links: {
        instagram: 'https://instagram.com/manifestcoach',
        youtube: 'https://youtube.com/@manifestcoach',
        twitter: 'https://twitter.com/manifestcoach',
        linkedin: 'https://linkedin.com/in/manifestcoach',
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {siteContent.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {siteContent.hero.subtitle}
          </p>
          <Link
            href={siteContent.hero.cta_link}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {siteContent.hero.cta_text}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-purple-500" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-purple-600 dark:text-purple-400 font-medium text-sm uppercase tracking-wider">About</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
                {siteContent.about.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {siteContent.about.content}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-6xl font-bold">🌟</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-20 md:py-32 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 dark:text-purple-400 font-medium text-sm uppercase tracking-wider">Free Content</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              YouTube Videos & Teachings
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Subscribe to my channel for weekly manifestation tips, guided meditations, and success stories.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteContent.videos.map((video) => (
              <div key={video.id} className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
                    aria-label={`Watch ${video.title}`}
                  >
                    <Play className="w-12 h-12 text-white filter drop-shadow-lg" />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={siteContent.contact.social_links.youtube || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-full hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
            >
              <Youtube className="w-5 h-5" />
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Products/Payment Section */}
      <section id="products" className="py-20 md:py-32 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 dark:text-purple-400 font-medium text-sm uppercase tracking-wider">Offerings</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              Courses, Sessions & Memberships
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Choose the path that resonates with you. Pay in INR (Razorpay) or USD (Stripe).
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteContent.products.map((product) => (
              <div key={product.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{product.price_inr.toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">|</span>
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                      ${product.price_usd}
                    </span>
                  </div>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    Get Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 md:py-32 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 dark:text-purple-400 font-medium text-sm uppercase tracking-wider">Community</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              Join the Manifestation Community
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Share your journey, celebrate wins, ask questions, and grow together with like-minded souls.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 text-center">
            <div className="max-w-xl mx-auto">
              <div className="text-6xl mb-6">💫</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Connect?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Sign up to post your manifestation stories, respond to others, and be part of a supportive community that celebrates every win.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Join Free Community
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 dark:text-purple-400 font-medium text-sm uppercase tracking-wider">Contact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              Let's Connect
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Have questions? Want to work together? I\'d love to hear from you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                  <a href={`mailto:${siteContent.contact.email}`} className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {siteContent.contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Phone / WhatsApp</h4>
                  <a href={`https://wa.me/${siteContent.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {siteContent.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                  <p className="text-gray-600 dark:text-gray-300">{siteContent.contact.address}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Follow the Journey</h4>
              <div className="flex flex-wrap gap-4">
                {siteContent.contact.social_links.instagram && (
                  <a href={siteContent.contact.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {siteContent.contact.social_links.youtube && (
                  <a href={siteContent.contact.social_links.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <Youtube className="w-6 h-6" />
                  </a>
                )}
                {siteContent.contact.social_links.twitter && (
                  <a href={siteContent.contact.social_links.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {siteContent.contact.social_links.linkedin && (
                  <a href={siteContent.contact.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Manifest with [Coach Name]. All rights reserved.
          </p>
          <p className="text-xs mt-2 opacity-70">
            Made with love for your manifestation journey ✨
          </p>
        </div>
      </footer>
    </div>
  )
}