import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Event } from '../types';
import { format } from 'date-fns';

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const [allEventsRes, myEventsRes] = await Promise.all([
        api.getEvents(),
        api.getMyEvents(),
      ]);

      if (allEventsRes.data) setEvents(allEventsRes.data);
      if (myEventsRes.data) setMyEvents(myEventsRes.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayEvents = activeTab === 'all' ? events : myEvents;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <Link to="/events/create" className="btn-primary">
          + Create Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'all'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'my'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Events ({myEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      {displayEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No events found</p>
          {activeTab === 'my' && (
            <Link to="/events/create" className="btn-primary">
              Create Your First Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event) => (
            <Link
              key={event.eventCode}
              to={`/events/${event.eventCode}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4 flex items-center justify-center text-white text-4xl">
                📅
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {event.description || 'No description'}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  {event.location || 'Location TBD'}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🗓️</span>
                  {format(new Date(event.eventDate), 'MMM d, yyyy h:mm a')}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  {event.currentParticipants || 0}
                  {event.maxParticipants && ` / ${event.maxParticipants}`} attending
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Code: <span className="font-mono font-semibold">{event.eventCode}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
