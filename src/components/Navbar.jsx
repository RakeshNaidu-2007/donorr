import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Plus,
  Home,
  Package,
  Users,
  Calendar,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Donations", path: "/donations", icon: Package },
    { name: "Requests", path: "/requests", icon: Users },
    { name: "Drives", path: "/drives", icon: Calendar },
  ];

  const userNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/profile", icon: Settings },
  ];

  if (user?.role === "donor")
    userNavItems.push({
      name: "Create Donation",
      path: "/create-donation",
      icon: Plus,
    });

  if (user?.role === "recipient")
    userNavItems.push({
      name: "Create Request",
      path: "/create-request",
      icon: Plus,
    });

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-gray-900">
                DonorHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile or Login/Register */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                    {userNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Link>
                      );
                    })}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 px-4 py-2 text-white rounded-md hover:bg-red-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 text-gray-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-red-600"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <hr className="my-2" />

            {isAuthenticated ? (
              <>
                {userNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-gray-700 hover:text-red-600"
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="py-2 w-full text-left text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 hover:text-red-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 bg-red-600 text-white rounded-md px-3"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
