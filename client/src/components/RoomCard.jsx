const RoomCard = ({ room, onSelect }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const firstImage = room.images?.[0]
    ? `${API_BASE_URL}${room.images[0]}`
    : 'https://via.placeholder.com/250x180?text=Room';

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700 transition hover:border-indigo-300 hover:shadow-lg">
      <div className="mb-4">
        {/* Main image */}
        <img
          src={firstImage}
          alt={room.type}
          className="h-48 w-full rounded-xl object-cover"
        />

        {/* Additional images indicator */}
        {room.images && room.images.length > 1 && (
          <div className="flex gap-2 mt-3">
            {room.images.slice(1, 4).map((image, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}${image}`}
                alt={`${room.type} ${index + 2}`}
                className="h-10 w-10 rounded-lg object-cover border border-white/20"
              />
            ))}
            {room.images.length > 4 && (
              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-xs text-white font-bold">
                +{room.images.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-1 flex-col space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="truncate font-bold text-gray-900">{room.type}</h4>
          <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wider font-bold ${room.total_stock === 0 ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-700'}`}>
            {room.total_stock === 0 ? 'Unavailable' : 'Available'}
          </span>
        </div>
        <p className="text-xs text-gray-600 font-semibold">PKR {Number(room.price_per_night || 0).toLocaleString()} / night</p>
        {onSelect && (
          <button
            onClick={() => onSelect(room)}
            disabled={room.total_stock === 0}
            className={`mt-auto w-full rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider transition ${room.total_stock === 0
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
