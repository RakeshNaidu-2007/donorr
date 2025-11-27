import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Users, Search, Filter, MapPin, Calendar, AlertCircle, Clock } from 'lucide-react';

const Requests = () => {
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    urgency: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.urgency) params.append('urgency', filters.urgency);
      
      const response = await api.get(`/requests?${params.toString()}`);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Help Requests</h1>
          <p className="mt-2 text-gray-600">
            See what people in your community need and how you can help
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
                  placeholder="Search requests..."
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
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filters.urgency}
                onChange={(e) => setFilters({...filters, urgency: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Urgency</option>
                <option value="critical">Critical</option>
                <option value="emergency">Emergency</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Header with urgency indicator */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {request.title}
                    </h3>
                    {request.isEmergency && (
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {request.description}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="text-lg mr-2">{getCategoryIcon(request.category)}</div>
                      {request.quantity} {request.unit} needed
                    </div>
                    
                    {request.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {request.location.city}, {request.location.state}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {request.recipient?.name}
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>

                    {request.requiredBy && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        Needed by {new Date(request.requiredBy).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/requests/${request._id}`}
                      className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      View Details
                    </Link>
                    {isAuthenticated && request.status === 'pending' && (
                      <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        Help
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
