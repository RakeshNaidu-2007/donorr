import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Calendar, Search, Filter, MapPin, Users, Clock, AlertCircle } from 'lucide-react';

const Drives = () => {
  const { isAuthenticated } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    isEmergency: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDrives();
  }, [filters]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.isEmergency) params.append('isEmergency', filters.isEmergency);
      
      const response = await api.get(`/drives?${params.toString()}`);
      setDrives(response.data.drives);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrives = drives.filter(drive =>
    drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drive.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
      case 'mixed': return '📦';
      default: return '🎯';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donation Drives</h1>
          <p className="mt-2 text-gray-600">
            Join organized donation drives and make a collective impact
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
                  placeholder="Search drives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

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
                <option value="mixed">Mixed</option>
              </select>

              <select
                value={filters.isEmergency}
                onChange={(e) => setFilters({...filters, isEmergency: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Types</option>
                <option value="true">Emergency</option>
                <option value="false">Regular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drives Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrives.map((drive) => {
              const daysRemaining = getDaysRemaining(drive.endDate);
              return (
                <div key={drive._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {drive.title}
                      </h3>
                      {drive.isEmergency && (
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(drive.status)}`}>
                        {drive.status}
                      </span>
                      {drive.isEmergency && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Emergency
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3">
                      {drive.description}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="text-lg mr-2">{getCategoryIcon(drive.category)}</div>
                        {drive.category} drive
                      </div>
                      
                      {drive.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          {drive.location.city}, {drive.location.state}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {drive.volunteers?.length || 0} volunteers
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(drive.startDate)} - {formatDate(drive.endDate)}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{drive.progress?.totalDonations || 0} donations</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((drive.progress?.totalDonations || 0) / (drive.targetRecipients || 1) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/drives/${drive._id}`}
                        className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        View Details
                      </Link>
                      {isAuthenticated && drive.status === 'active' && (
                        <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredDrives.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drives found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drives;
