import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const firstImage = hotel.images?.[0]
    ? hotel.images[0].startsWith('http')
      ? hotel.images[0]
      : `${API_BASE_URL}${hotel.images[0]}`
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';

  const hasPrice = typeof hotel?.price_per_night === 'number';
  const detailUrl = `/hotel/${hotel._id}`;

  return (
    <article className="group flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl">
      <Link to={detailUrl} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={firstImage}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/640x480?text=Hotel';
            }}
          />
          {hasPrice ? (
            <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-gray-900 shadow-md backdrop-blur-sm">
              PKR {hotel.price_per_night.toLocaleString()} / night
            </div>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={detailUrl}>
          <h3 className="line-clamp-1 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{hotel.name}</h3>
        </Link>
        <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
          <span className="line-clamp-1">{hotel.location || 'Location not specified'}</span>
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
          {hotel.description || 'Comfortable rooms and a clean, modern stay experience.'}
        </p>
      </div>

      <div className="flex items-center gap-2 px-5 pb-5">
        <Link
          to={detailUrl}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-indigo-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
        >
          Rooms
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

export default HotelCard;