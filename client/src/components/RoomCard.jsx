const RoomCard = ({ room, onSelect }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const firstImage = room.images?.[0]
    ? `${API_BASE_URL}${room.images[0]}`
    : 'https://via.placeholder.com/250x180?text=Room';

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-100 transition hover:border-primary-teal/30 hover:shadow-[0_20px_80px_-55px_rgba(15,23,42,1)]">
      <div className="mb-4">
        {/* Main image */}
        <img
          src={firstImage}
          alt={room.type}
          className="h-28 w-full rounded-3xl object-cover"
        />
        
        {/* Additional images indicator */}
        {room.images && room.images.length > 1 && (
          <div className="flex gap-1 mt-2">
            {room.images.slice(1, 4).map((image, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}${image}`}
                alt={`${room.type} ${index + 2}`}
                className="h-8 w-8 rounded-lg object-cover border border-white/20"
              />
            ))}
            {room.images.length > 4 && (
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center text-xs text-white font-medium">
                +{room.images.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-white truncate">{room.type}</h4>
          <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${room.total_stock === 0 ? 'bg-slate-800 text-slate-400' : 'bg-primary-teal text-slate-950'}`}>
            {room.total_stock === 0 ? 'Unavailable' : 'Available'}
          </span>
        </div>
        <p className="text-xs text-slate-400">${room.price_per_night} / night</p>
        {onSelect && (
          <button
            onClick={() => onSelect(room)}
            disabled={room.total_stock === 0}
            className={`w-full rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] transition ${
              room.total_stock === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-primary-amber text-slate-950 hover:brightness-110'
            }`}
          >
            Select room
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
