import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Package, Search, Filter, MapPin, Calendar, User } from 'lucide-react';

const Donations = () => {
  const { isAuthenticated } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDonations();
  }, [filters]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      
      const response = await api.get(`/donations?${params.toString()}`);
      setDonations(response.data.donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(donation =>
    donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'donated': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return '🍎';
      case 'clothing': return '👕';
      case 'medical': return '🏥';
      case 'shelter': return '🏠';
      case 'education': return '📚';
      default: return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Donations</h1>
          <p className="mt-2 text-gray-600">
            Browse items donated by our community members
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="clothing">Clothing</option>
                <option value="medical">Medical</option>
                <option value="shelter">Shelter</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="donated">Donated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Donations Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  {donation.images && donation.images.length > 0 ? (
                    <img
                      src={donation.images[0]}
                      alt={donation.title}
                      className="h-full w-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="text-4xl">{getCategoryIcon(donation.category)}</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {donation.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {donation.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-2" />
                      {donation.quantity} {donation.unit}
                    </div>
                    
                    {donation.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {donation.location.city}, {donation.location.state}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      {donation.donor?.name}
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/donations/${donation._id}`}
                      className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      View Details
                    </Link>
                    {isAuthenticated && donation.status === 'available' && (
                      <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDonations.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
