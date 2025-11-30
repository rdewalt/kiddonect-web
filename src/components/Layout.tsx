import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-3xl">👨‍👩‍👧‍👦</div>
              <span className="text-2xl font-bold text-primary-600">Kiddonect</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/events"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/events')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Events
              </Link>
              <Link
                to="/connections"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/connections')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Connections
              </Link>
              <Link
                to="/messages"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/messages')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Messages
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.firstName} {user?.lastName}
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            <Link
              to="/events"
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                isActive('/events') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl mb-1">📅</span>
              Events
            </Link>
            <Link
              to="/connections"
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                isActive('/connections') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl mb-1">🤝</span>
              Connections
            </Link>
            <Link
              to="/messages"
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                isActive('/messages') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl mb-1">💬</span>
              Messages
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                isActive('/profile') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl mb-1">👤</span>
              Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
