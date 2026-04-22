import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const firstImage = hotel.images?.[0]
    ? `${API_BASE_URL}${hotel.images[0]}`
    : 'https://via.placeholder.com/300x200?text=Hotel';

  return (
    <Link
      to={`/hotel/${hotel._id}`}
      className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.9)] transition-all duration-300 hover:shadow-[0_25px_90px_-35px_rgba(15,23,42,0.95)] hover:border-primary-teal/30 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={firstImage}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-lg font-semibold text-white line-clamp-1">{hotel.name}</h3>
        <p className="mb-3 flex items-center gap-2 text-sm text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hotel.location}
        </p>
        <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">{hotel.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-amber">
            View Details
            <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;