const BookingCard = ({ booking, onApprove, onCancel, onChat, isOwner = false }) => {
  const roomName = booking.room_id?.type || 'Unknown';
  const hotelName = booking.hotel_id?.name || 'Unknown Hotel';
  const checkIn = new Date(booking.check_in).toLocaleDateString();
  const checkOut = new Date(booking.check_out).toLocaleDateString();

  const statusColor = {
    pending: 'bg-slate-800 text-slate-300',
    confirmed: 'bg-primary-teal text-slate-950',
    cancelled: 'bg-primary-coral text-slate-950',
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-4 text-sm text-slate-100 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.8)] transition hover:border-primary-teal/30">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-semibold text-white">{hotelName}</h4>
            <p className="text-xs text-slate-400">{roomName} Room</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${statusColor[booking.status?.toLowerCase()] || 'bg-slate-800 text-slate-300'}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-slate-400 text-xs">
          <div>
            <p>Check-in</p>
            <p className="text-slate-100">{checkIn}</p>
          </div>
          <div>
            <p>Check-out</p>
            <p className="text-slate-100">{checkOut}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-3 text-slate-300">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Total</p>
          <p className="mt-1 text-lg font-semibold text-white">${booking.total_price}</p>
        </div>

        {isOwner && booking.user_id && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-3 text-slate-300">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Guest</p>
            <p className="mt-1 text-slate-100">{booking.user_id?.name}</p>
            <p className="text-slate-400 text-xs">{booking.user_id?.email}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {onChat && (
            <button
              onClick={() => onChat(booking._id)}
              className="rounded-full bg-primary-teal px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:brightness-110"
            >
              Chat
            </button>
          )}
          {onApprove && booking.status === 'Pending' && (
            <button
              onClick={() => onApprove(booking._id)}
              className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
            >
              Approve
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(booking._id)}
              className="rounded-full bg-primary-coral px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:brightness-110"
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
