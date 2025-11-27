import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Users, 
  Package, 
  Calendar, 
  ArrowRight,
  Shield,
  Truck,
  Hand
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Heart,
      title: 'Easy Donations',
      description: 'Donate essential items with just a few clicks and help those in need.',
      color: 'text-red-500'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with your community and make a real difference in people\'s lives.',
      color: 'text-blue-500'
    },
    {
      icon: Package,
      title: 'Organized Drives',
      description: 'Participate in organized donation drives for maximum impact.',
      color: 'text-green-500'
    },
    {
      icon: Calendar,
      title: 'Emergency Response',
      description: 'Quick response system for emergency situations and natural disasters.',
      color: 'text-orange-500'
    }
  ];

  const roles = [
    {
      icon: Hand,
      title: 'Donor',
      description: 'List items for donation, track donations, and participate in emergency drives.',
      color: 'bg-red-50 border-red-200 text-red-700'
    },
    {
      icon: Users,
      title: 'Recipient',
      description: 'Request necessary items, track delivery, and provide feedback on donations.',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      icon: Truck,
      title: 'Logistics Coordinator',
      description: 'Organize transportation, manage inventory, and ensure timely delivery.',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      icon: Shield,
      title: 'Admin',
      description: 'Oversee platform operations, manage donation drives, and ensure transparency.',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Donate with <span className="text-yellow-300">Heart</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect donors with those in need. Make a difference in your community through 
              organized donation drives and emergency response.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/donations"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Browse Donations
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to donate, request, and coordinate essential items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className={`inline-flex p-3 rounded-full bg-gray-100 mb-4`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role and start making a difference today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <div key={index} className={`p-6 rounded-lg border-2 ${role.color} hover:shadow-lg transition-shadow`}>
                  <div className="flex items-center mb-4">
                    <Icon className="h-8 w-8 mr-3" />
                    <h3 className="text-xl font-semibold">
                      {role.title}
                    </h3>
                  </div>
                  <p className="text-sm">
                    {role.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of people making a difference in their communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-lg opacity-90">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-lg opacity-90">Items Donated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Families Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Emergency Drives</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community today and start helping those in need
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
