import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Heart, Wifi, Waves, Coffee, Car, Dumbbell, Utensils, Snowflake, Tv, Shield } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const firstImage = hotel.images?.[0]
    ? hotel.images[0].startsWith('http')
      ? hotel.images[0]
      : `${API_BASE_URL}${hotel.images[0]}`
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  const detailUrl = `/hotel/${hotel._id}`;

  const amenityIcons = {
    wifi: Wifi,
    pool: Waves,
    breakfast: Coffee,
    parking: Car,
    gym: Dumbbell,
    restaurant: Utensils,
    ac: Snowflake,
    tv: Tv,
    security: Shield,
  };

  const displayAmenities = hotel.amenities?.slice(0, 4) || [];

  return (
    <article className="group flex h-[380px] w-full max-w-md flex-col border border-gray-200 overflow-hidden p-2 rounded-2xl bg-white shadow-lg transition-all duration-300  hover:border-indigo-300 hover:shadow-xl">
      {/* Image Section */}
      <Link to={detailUrl} className="block relative">
        <div className="relative h-40 overflow-hidden rounded-xl">
          <img
            src={firstImage}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-500 "
          />
          
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        
        
        <Link to={detailUrl}>
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {hotel.name}
          </h3>
        </Link>
        
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {hotel.description || 'Enjoy a clean, modern stay experience with premium amenities and easy access to the city.'}
        </p>

        {/* Amenities */}
        {displayAmenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {displayAmenities.map((amenity) => {
              const Icon = amenityIcons[amenity];
              return Icon ? (
                <div
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600"
                  title={amenity}
                >
                  <Icon className="w-3 h-3" />
                </div>
              ) : null;
            })}
            {hotel.amenities?.length > 4 && (
              <span className="text-xs text-gray-400">+{hotel.amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Location Row */}
        <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-600 pt-3">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{hotel.location || 'Location not specified'}</span>
        </div>
      </div>

      {/* Button Section (Bottom) */}
      <div className="px-4 pb-4">
        <Link
          to={detailUrl}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-indigo-700 shadow-md active:scale-95"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
};

export default HotelCard;