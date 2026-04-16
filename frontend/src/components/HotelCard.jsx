import { Link } from 'react-router-dom';
import '../styles/HotelCard.css';

const HotelCard = ({ hotel }) => {
  const firstImage = hotel.images?.[0] || 'https://via.placeholder.com/300x200?text=Hotel';

  return (
    <div className="hotel-card">
      <div className="hotel-image">
        <img src={firstImage} alt={hotel.name} />
      </div>
      <div className="hotel-content">
        <h3>{hotel.name}</h3>
        <p className="location">📍 {hotel.location}</p>
        <p className="description">{hotel.description}</p>
        <Link to={`/hotel/${hotel._id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
