import { Link } from 'react-router-dom';
import '../styles/HotelCard.css';
import { MapPin } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const firstImage = hotel.images?.[0] 
    ? `${API_BASE_URL}${hotel.images[0]}` 
    : 'https://via.placeholder.com/300x200?text=Hotel';

  return (
    <div className="hotel-card">
      <div className="hotel-image">
        <img src={firstImage} alt={hotel.name} />
      </div>
      <div className="hotel-content">
        <h3>{hotel.name}</h3>
        <p className="location" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
  <MapPin size={18} color="#000000" /> {hotel.location}</p>
        <p className="description">{hotel.description}</p>
        <Link to={`/hotel/${hotel._id}`} className="view-btn">
          View Rooms
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
