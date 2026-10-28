'use client'

import { useSession } from 'next-auth/react'
import {
  Users,
  Video,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    name: 'Total Members',
    value: '1,234',
    change: '+12%',
    icon: Users,
    color: 'bg-blue-500',
    href: '/dashboard/community',
  },
  {
    name: 'Videos Published',
    value: '28',
    change: '+3',
    icon: Video,
    color: 'bg-purple-500',
    href: '/dashboard/videos',
  },
  {
    name: 'Active Products',
    value: '12',
    change: '+2',
    icon: Package,
    color: 'bg-green-500',
    href: '/dashboard/products',
  },
  {
    name: 'Total Revenue',
    value: '$45,678',
    change: '+23%',
    icon: ShoppingCart,
    color: 'bg-orange-500',
    href: '/dashboard/orders',
  },
]

const recentActivity = [
  { id: 1, type: 'order', user: 'Sarah J.', action: 'purchased', item: 'Manifestation Mastery Course', amount: '$197', time: '2 min ago' },
  { id: 2, type: 'signup', user: 'Mike R.', action: 'joined', item: 'Community', amount: '', time: '15 min ago' },
  { id: 3, type: 'order', user: 'Priya K.', action: 'purchased', item: 'Private Coaching Session', amount: '$97', time: '1 hour ago' },
  { id: 4, type: 'comment', user: 'Emma L.', action: 'commented on', item: '"Daily Manifestation Routine"', amount: '', time: '3 hours ago' },
  { id: 5, type: 'signup', user: 'James T.', action: 'subscribed to', item: 'Monthly Membership', amount: '$27/mo', time: '5 hours ago' },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your manifestation business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/products/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-900 dark:text-white">Add New Product</span>
              </Link>
              <Link
                href="/dashboard/videos/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Add YouTube Video</span>
              </Link>
              <Link
                href="/dashboard/content"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="w-5 h-5 text-gray-600 dark:text-gray-400">📝</span>
                <span className="font-medium text-gray-900 dark:text-white">Edit Site Content</span>
              </Link>
              <Link
                href="/dashboard/community"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Moderate Community</span>
              </Link>
              <Link
                href="/dashboard/coaching"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="w-5 h-5 text-gray-600 dark:text-gray-400">📅</span>
                <span className="font-medium text-gray-900 dark:text.white">Manage Coaching</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <Link href="/dashboard/orders" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue Overview (Last 30 Days)</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Revenue chart coming soon</p>
            <p className="text-sm mt-1">Integrate with Chart.js or Recharts</p>
          </div>
        </div>
      </div>
    </div>
  )
}