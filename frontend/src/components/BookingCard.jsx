import '../styles/BookingCard.css';

const BookingCard = ({ booking, onApprove, onCancel, isOwner = false }) => {
  const roomName = booking.room_id?.type || 'Unknown';
  const hotelName = booking.hotel_id?.name || 'Unknown Hotel';
  const checkIn = new Date(booking.check_in).toLocaleDateString();
  const checkOut = new Date(booking.check_out).toLocaleDateString();
  const statusClass = `status-${booking.status.toLowerCase()}`;

  return (
    <div className="booking-card">
      <div className="booking-header">
        <div>
          <h4>{hotelName}</h4>
          <p className="room-type">{roomName} Room</p>
        </div>
        <span className={`status ${statusClass}`}>{booking.status}</span>
      </div>

      <div className="booking-dates">
        <div>
          <p className="date-label">Check-in</p>
          <p className="date">{checkIn}</p>
        </div>
        <div>
          <p className="date-label">Check-out</p>
          <p className="date">{checkOut}</p>
        </div>
      </div>

      <div className="booking-price">
        <p className="price-label">Total Price</p>
        <p className="price">${booking.total_price}</p>
      </div>

      {isOwner && booking.user_id && (
        <div className="guest-info">
          <p><strong>Guest:</strong> {booking.user_id?.name}</p>
          <p><strong>Email:</strong> {booking.user_id?.email}</p>
        </div>
      )}

      <div className="booking-actions">
        {onChat && (
          <button onClick={() => onChat(booking._id)} className="chat-btn">
            Chat
          </button>
        )}
        {onApprove && booking.status === 'Pending' && (
          <button onClick={() => onApprove(booking._id)} className="approve-btn">
            Approve
          </button>
        )}
        {onCancel && (
          <button onClick={() => onCancel(booking._id)} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
