import '../styles/RoomCard.css';

const RoomCard = ({ room, onSelect }) => {
  const firstImage = room.images?.[0] || 'https://via.placeholder.com/250x180?text=Room';

  return (
    <div className="room-card">
      <div className="room-image">
        <img src={firstImage} alt={room.type} />
        {room.total_stock === 0 && <div className="unavailable-badge">Unavailable</div>}
      </div>
      <div className="room-content">
        <h4>{room.type} Room</h4>
        <p className="price">
          ${room.price_per_night} <span>per night</span>
        </p>
        <p className="stock">
          Available: <strong>{room.total_stock}</strong>
        </p>
        {onSelect && (
          <button
            onClick={() => onSelect(room)}
            className="select-btn"
            disabled={room.total_stock === 0}
          >
            {room.total_stock === 0 ? 'Not Available' : 'Select Room'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
