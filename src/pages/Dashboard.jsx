import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { 
  Package, 
  Users, 
  Calendar, 
  Plus,
  TrendingUp,
  Heart,
  Truck,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    donations: 0,
    requests: 0,
    drives: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch user-specific data based on role
      const [donationsRes, requestsRes, drivesRes] = await Promise.all([
        api.get('/donations/user/my-donations'),
        api.get('/requests/user/my-requests'),
        api.get('/drives')
      ]);

      setStats({
        donations: donationsRes.data.length,
        requests: requestsRes.data.length,
        drives: drivesRes.data.drives.length,
        recentActivity: [
          ...donationsRes.data.slice(0, 3).map(item => ({
            type: 'donation',
            title: item.title,
            status: item.status,
            date: item.createdAt
          })),
          ...requestsRes.data.slice(0, 3).map(item => ({
            type: 'request',
            title: item.title,
            status: item.status,
            date: item.createdAt
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificContent = () => {
    switch (user.role) {
      case 'donor':
        return {
          title: 'Donor Dashboard',
          description: 'Manage your donations and help those in need',
          primaryAction: {
            text: 'Create Donation',
            link: '/create-donation',
            icon: Plus
          },
          stats: [
            { label: 'My Donations', value: stats.donations, icon: Package, color: 'text-blue-600' },
            { label: 'Active Drives', value: stats.drives, icon: Calendar, color: 'text-green-600' },
            { label: 'Items Donated', value: stats.donations, icon: Heart, color: 'text-red-600' }
          ]
        };
      case 'recipient':
        return {
          title: 'Recipient Dashboard',
          description: 'Track your requests and find help',
          primaryAction: {
            text: 'Create Request',
            link: '/create-request',
            icon: Plus
          },
          stats: [
            { label: 'My Requests', value: stats.requests, icon: Users, color: 'text-blue-600' },
            { label: 'Available Drives', value: stats.drives, icon: Calendar, color: 'text-green-600' },
            { label: 'Items Received', value: 0, icon: Package, color: 'text-red-600' }
          ]
        };
      case 'logistics':
        return {
          title: 'Logistics Dashboard',
          description: 'Coordinate deliveries and manage inventory',
          primaryAction: {
            text: 'View Assignments',
            link: '/logistics',
            icon: Truck
          },
          stats: [
            { label: 'Active Deliveries', value: 0, icon: Truck, color: 'text-blue-600' },
            { label: 'Completed Deliveries', value: 0, icon: TrendingUp, color: 'text-green-600' },
            { label: 'Pending Items', value: 0, icon: AlertCircle, color: 'text-orange-600' }
          ]
        };
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Oversee platform operations and manage drives',
          primaryAction: {
            text: 'Create Drive',
            link: '/admin/create-drive',
            icon: Plus
          },
          stats: [
            { label: 'Total Donations', value: stats.donations, icon: Package, color: 'text-blue-600' },
            { label: 'Total Requests', value: stats.requests, icon: Users, color: 'text-green-600' },
            { label: 'Active Drives', value: stats.drives, icon: Calendar, color: 'text-red-600' }
          ]
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to your dashboard',
          primaryAction: null,
          stats: []
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{roleContent.title}</h1>
          <p className="mt-2 text-gray-600">{roleContent.description}</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              {roleContent.primaryAction && (
                <Link
                  to={roleContent.primaryAction.link}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <roleContent.primaryAction.icon className="h-5 w-5 mr-2" />
                  {roleContent.primaryAction.text}
                </Link>
              )}
              <Link
                to="/donations"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 mr-2" />
                Browse Donations
              </Link>
              <Link
                to="/requests"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 mr-2" />
                View Requests
              </Link>
              <Link
                to="/drives"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Join Drives
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roleContent.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'donation' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'donation' ? (
                        <Package className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Users className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {activity.type} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'available' || activity.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : activity.status === 'donated' || activity.status === 'fulfilled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Drives</h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium text-red-900">Hurricane Relief Drive</h3>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Urgent need for food, water, and clothing
                </p>
                <p className="text-xs text-red-600 mt-2">Ends in 2 days</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium text-orange-900">Winter Clothing Drive</h3>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Collecting warm clothing for families in need
                </p>
                <p className="text-xs text-orange-600 mt-2">Ends in 5 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
