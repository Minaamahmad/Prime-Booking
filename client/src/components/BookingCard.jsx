const BookingCard = ({ booking, onApprove, onCancel, onChat, isOwner = false }) => {
  const hotel = booking?.hotel_id && typeof booking.hotel_id === 'object' ? booking.hotel_id : null;
  const room = booking?.room_id && typeof booking.room_id === 'object' ? booking.room_id : null;

  const roomName = room?.type || 'Room';
  const hotelName = hotel?.name || 'Hotel';
  const hotelLocation = hotel?.location || '';

  const checkInDate = booking?.check_in ? new Date(booking.check_in) : null;
  const checkOutDate = booking?.check_out ? new Date(booking.check_out) : null;

  const checkIn = checkInDate && !Number.isNaN(checkInDate.getTime()) ? checkInDate.toLocaleDateString() : '—';
  const checkOut = checkOutDate && !Number.isNaN(checkOutDate.getTime()) ? checkOutDate.toLocaleDateString() : '—';

  const nights =
    checkInDate &&
    checkOutDate &&
    !Number.isNaN(checkInDate.getTime()) &&
    !Number.isNaN(checkOutDate.getTime())
      ? Math.max(0, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)))
      : null;

  const pricePerNight = typeof room?.price_per_night === 'number' ? room.price_per_night : null;
  const totalPrice = typeof booking?.total_price === 'number' ? booking.total_price : null;

  const money = (value) =>
    typeof value === 'number'
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
      : '—';

  const statusColor = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700 shadow-lg transition hover:border-indigo-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900">{hotelName}</h4>
            <p className="text-xs text-gray-500">
              {roomName} Room
              {hotelLocation ? <span className="text-gray-400"> • {hotelLocation}</span> : null}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wider font-bold ${statusColor[booking.status?.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <p>Check-in</p>
            <p className="text-gray-900 font-semibold">{checkIn}</p>
          </div>
          <div>
            <p>Check-out</p>
            <p className="text-gray-900 font-semibold">{checkOut}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Per night</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{money(pricePerNight)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Total{typeof nights === 'number' ? ` • ${nights} night${nights === 1 ? '' : 's'}` : ''}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">{money(totalPrice)}</p>
          </div>
        </div>

        {isOwner && booking.user_id && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-600">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Guest</p>
            <p className="mt-1 text-gray-900 font-semibold">{booking.user_id?.name}</p>
            <p className="text-xs text-gray-500">{booking.user_id?.email}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {onChat && (
            <button
              onClick={() => onChat(booking._id)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-900 transition hover:bg-gray-100"
            >
              Chat
            </button>
          )}
          {onApprove && booking.status === 'Pending' && (
            <button
              onClick={() => onApprove(booking._id)}
              className="rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-indigo-700"
            >
              Approve
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(booking._id)}
              className="rounded-full bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
