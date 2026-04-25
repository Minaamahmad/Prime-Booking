import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService } from '../services/api';
import HotelCard from '../components/HotelCard';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import { Search, MapPin, Wifi, Car, Coffee, Star } from 'lucide-react';

const Home = () => {
  const BLOCKED_HOTEL_NAMES = new Set(['sunset paradise resort']);
  const BLOCKED_HOTEL_LOCATIONS = new Set(['malibu, california']);

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hotelService.getAllHotels();
      const sanitizedHotels = (Array.isArray(response.data) ? response.data : []).filter((hotel) => {
        const name = (hotel?.name || '').trim().toLowerCase();
        const location = (hotel?.location || '').trim().toLowerCase();
        return !BLOCKED_HOTEL_NAMES.has(name) && !BLOCKED_HOTEL_LOCATIONS.has(location);
      });
      setHotels(sanitizedHotels);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredHotels = hotels.filter((hotel) => {
    if (!normalizedQuery) return true;
    const name = (hotel?.name || '').toLowerCase();
    const location = (hotel?.location || '').toLowerCase();
    return name.includes(normalizedQuery) || location.includes(normalizedQuery);
  });

  const featuredHotels = filteredHotels.slice(0, 3);
  const remainingHotels = filteredHotels.slice(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">Find your perfect stay</h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              Discover clean, comfortable hotels with modern amenities and reliable service.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex w-full items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
              <MapPin className="h-5 w-5 shrink-0 text-indigo-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hotel name or city (e.g., Islamabad)"
                className="w-full border-0 bg-transparent px-1 py-2 text-base text-gray-900 outline-none placeholder:text-gray-400"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <ErrorAlert message={error} onClose={() => setError('')} />
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-gray-200 bg-white p-6 sm:grid-cols-4 sm:p-8">
          {[
            { icon: Star, title: 'Premium Quality', desc: 'Verified properties' },
            { icon: Wifi, title: 'Modern Amenities', desc: 'Comfort-first stays' },
            { icon: Coffee, title: 'Great Service', desc: 'Friendly support' },
            { icon: Car, title: 'Easy Access', desc: 'Convenient locations' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <item.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      {!searchQuery && featuredHotels.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Featured Properties
              </h2>
              <p className="mt-3 text-base text-gray-600 sm:text-lg">
                Handpicked accommodations for exceptional stays
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <HotelCard hotel={featuredHotels[0]} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                {featuredHotels[1] && <HotelCard hotel={featuredHotels[1]} />}
                {featuredHotels[2] && <HotelCard hotel={featuredHotels[2]} />}
              </div>
            </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="h-px bg-gray-200" />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {searchQuery ? `Properties (${filteredHotels.length})` : 'All Properties'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
              {searchQuery
                ? `Found ${filteredHotels.length} properties for "${searchQuery}"`
                : 'Browse our complete collection of premium accommodations'
              }
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loading message="Loading properties..." />
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(searchQuery ? filteredHotels : remainingHotels).map((hotel) => (
                <div key={hotel._id} className="h-full">
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white py-16 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery ? 'No properties found' : 'No properties available'}
              </h3>
              <p className="mx-auto mb-8 max-w-md text-base text-gray-600">
                {searchQuery
                  ? 'Try exploring different cities or browse all available properties.'
                  : 'Check back soon for new properties.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Explore All Properties
                </button>
              )}
            </div>
          )}
      </section>

      {!searchQuery && hotels.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-8">
          <div className="rounded-3xl bg-indigo-600 px-6 py-16 text-center text-white sm:px-10">
            <h2 className="text-4xl font-bold mb-4">
              Start Your Journey
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base text-indigo-100 sm:text-lg">
              Join travelers who already found reliable stays with Prime Booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/my-bookings"
                className="rounded-full bg-white px-8 py-3 text-sm font-bold text-indigo-600 transition hover:bg-gray-100"
              >
                My Bookings
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="rounded-full border border-indigo-400 bg-indigo-700 px-8 py-3 text-sm font-bold text-white transition hover:bg-indigo-800"
              >
                Discover More
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
