import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import type { Event, Connection } from '../types';

export function Home() {
  const { user } = useAuth();
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [eventsRes, connectionsRes, conversationsRes] = await Promise.all([
        api.getMyEvents(),
        api.getPendingRequests(),
        api.getConversations(),
      ]);

      if (eventsRes.data) setRecentEvents(eventsRes.data.slice(0, 3));
      if (connectionsRes.data) setPendingConnections(connectionsRes.data);
      if (conversationsRes.data) {
        const unread = conversationsRes.data.reduce(
          (sum, conv) => sum + (conv.unreadCount || 0),
          0
        );
        setUnreadMessages(unread);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening in your community</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Link to="/events" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Events</p>
              <p className="text-3xl font-bold text-gray-900">{recentEvents.length}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </Link>

        <Link to="/connections" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900">{pendingConnections.length}</p>
            </div>
            <div className="text-4xl">🤝</div>
          </div>
        </Link>

        <Link to="/messages" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900">{unreadMessages}</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </Link>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to="/events" className="text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">You're not part of any events yet</p>
            <Link to="/events" className="btn-primary">
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentEvents.map((event) => (
              <Link
                key={event.eventCode}
                to={`/events/${event.eventCode}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">{event.location || 'Location TBD'}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/events/create" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <div className="text-3xl mb-2">➕</div>
            <div className="font-semibold text-gray-900">Create Event</div>
            <div className="text-xs text-gray-600">Organize a new activity</div>
          </Link>

          <Link to="/events/join" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <div className="text-3xl mb-2">🔗</div>
            <div className="font-semibold text-gray-900">Join Event</div>
            <div className="text-xs text-gray-600">Use an event code</div>
          </Link>

          <Link to="/connections/add" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-semibold text-gray-900">Connect</div>
            <div className="text-xs text-gray-600">Add a new connection</div>
          </Link>

          <Link to="/profile" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-900">Settings</div>
            <div className="text-xs text-gray-600">Manage your profile</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
