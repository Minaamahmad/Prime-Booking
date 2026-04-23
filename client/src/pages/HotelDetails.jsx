import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Images, MapPin, User } from "lucide-react";
import { hotelService, roomService, bookingService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";
import Toast from "../components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isOwner } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    check_in: '',
    check_out: '',
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const hotelResponse = await hotelService.getHotelById(id);
        setHotel(hotelResponse.data);

        // Fetch available rooms for all users (guests and owners can view available rooms)
        try {
          console.log('Fetching rooms for hotel:', id);
          const roomsResponse = await roomService.getAvailableRoomsByHotel(id);
          console.log('Rooms fetched:', roomsResponse.data);
          setRooms(roomsResponse.data);
        } catch (err) {
          // If no rooms found, just set empty
          console.error('Error fetching rooms:', err);
          setRooms([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleRoomSelect = (room) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setSelectedRoom(room);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setBookingDates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async () => {
    if (!selectedRoom) {
      setError('Please select a room first');
      return;
    }
    if (!bookingDates.check_in || !bookingDates.check_out) {
      setError('Please select both check-in and check-out dates');
      return;
    }
    if (bookingSubmitting) return;

    try {
      setBookingSubmitting(true);
      setError('');
      console.log('Creating booking with data:', {
        room_id: selectedRoom._id,
        check_in: bookingDates.check_in,
        check_out: bookingDates.check_out,
      });
      
      const response = await bookingService.createBooking({
        room_id: selectedRoom._id,
        check_in: bookingDates.check_in,
        check_out: bookingDates.check_out,
      });

      console.log('Booking created successfully:', response.data);
      setSuccess('Booking created successfully! 🎉');
      setToast({ message: 'Booking created! Redirecting...', type: 'success' });
      setSelectedRoom(null);
      setBookingDates({ check_in: '', check_out: '' });
      
      // Navigate to bookings after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings', {
          state: { success: 'Booking created successfully!' }
        });
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const todayIso = useMemo(() => new Date().toISOString().split("T")[0], []);
  const nights = useMemo(() => {
    if (!bookingDates.check_in || !bookingDates.check_out) return 0;
    const diffMs = new Date(bookingDates.check_out) - new Date(bookingDates.check_in);
    const n = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [bookingDates.check_in, bookingDates.check_out]);

  const total = useMemo(() => {
    if (!selectedRoom || !nights) return 0;
    return nights * Number(selectedRoom.price_per_night || 0);
  }, [nights, selectedRoom]);

  if (loading) return <Loading message="Loading hotel details..." />;

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-primary-coral mb-4">Hotel not found</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-teal text-white px-6 py-2 rounded-lg hover:bg-primary-teal/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-neutral-950 w-full min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex mb-6 items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="transition-colors font-medium text-neutral-500 text-sm leading-5 flex items-center gap-2 hover:text-neutral-700"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        <ErrorAlert message={error} onClose={() => setError("")} />
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />

        <div className="mb-6">
          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="font-bold text-4xl leading-10 tracking-tight mb-2">
                {hotel.name}
              </h1>
              {hotel.location && (
                <div className="text-neutral-500 flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span className="font-medium text-sm leading-5">
                    {hotel.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 rounded-2xl mb-12 gap-2 h-[30rem] overflow-hidden">
          {hotel.images && hotel.images.length > 0 ? (
            <>
              <div className="col-span-2 row-span-2 relative">
                <img
                  alt={hotel.name}
                  className="object-cover w-full h-full"
                  src={`${API_BASE_URL}${hotel.images[0]}`}
                />
              </div>

              {hotel.images.slice(1, 4).map((image, idx) => (
                <div key={image || idx} className="col-span-1 relative">
                  <img
                    alt={`${hotel.name} ${idx + 2}`}
                    className="object-cover w-full h-full"
                    src={`${API_BASE_URL}${image}`}
                  />
                </div>
              ))}

              <div className="col-span-1 relative">
                {hotel.images.length > 4 ? (
                  <div className="cursor-default bg-neutral-100 flex justify-center items-center w-full h-full">
                    <div className="text-center">
                      <Images className="size-8 text-neutral-500 mx-auto mb-2" />
                      <span className="font-medium text-neutral-500 text-sm leading-5">
                        +{hotel.images.length - 4} more photos
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-100 flex justify-center items-center w-full h-full text-neutral-500 text-sm">
                    No more photos
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="col-span-4 bg-neutral-100 flex justify-center items-center rounded-2xl h-80 text-neutral-500">
              No images available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl leading-7">About this hotel</h2>
              {hotel.description ? (
                <p className="leading-relaxed text-neutral-500 text-sm">
                  {hotel.description}
                </p>
              ) : (
                <p className="leading-relaxed text-neutral-500 text-sm">
                  No description provided.
                </p>
              )}
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl leading-7">Available Rooms</h2>
                <span className="text-neutral-500 text-sm leading-5">
                  {rooms.length} room{rooms.length === 1 ? "" : "s"} available
                </span>
              </div>

              {rooms.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {rooms.map((room) => {
                    const firstImage = room.images?.[0]
                      ? `${API_BASE_URL}${room.images[0]}`
                      : "https://via.placeholder.com/160x120?text=Room";
                    const isSelected = selectedRoom?._id === room._id;
                    const isUnavailable = room.total_stock === 0;
                    return (
                      <Card
                        key={room._id}
                        role="button"
                        tabIndex={0}
                        className={[
                          "cursor-pointer p-4 gap-0 transition-colors",
                          isSelected ? "border-neutral-950 border-2" : "",
                          isUnavailable ? "opacity-60 cursor-not-allowed" : "",
                        ].join(" ")}
                        onClick={() => {
                          if (isUnavailable) return;
                          handleRoomSelect(room);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (isUnavailable) return;
                            handleRoomSelect(room);
                          }
                        }}
                      >
                        <CardContent className="p-0 gap-0">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 rounded-lg w-24 h-20 overflow-hidden bg-neutral-100">
                              <img
                                alt={room.type}
                                className="object-cover w-full h-full"
                                src={firstImage}
                              />
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-sm leading-5">
                                    {room.type}
                                  </h3>
                                  {isSelected && (
                                    <Badge className="bg-neutral-900 text-neutral-50 text-xs leading-4">
                                      Selected
                                    </Badge>
                                  )}
                                  {isUnavailable && (
                                    <Badge variant="secondary">Unavailable</Badge>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg leading-7">
                                    ${room.price_per_night}
                                  </span>
                                  <span className="text-neutral-500 text-xs leading-4">
                                    /night
                                  </span>
                                </div>
                              </div>
                              {room.images && room.images.length > 1 && (
                                <div className="flex mt-2 flex-wrap gap-1">
                                  {room.images.slice(1, 4).map((img, i) => (
                                    <span
                                      key={`${room._id}-img-${i}`}
                                      className="rounded-full bg-neutral-100 text-xs leading-4 px-2 py-0.5 text-neutral-700"
                                    >
                                      Photo {i + 2}
                                    </span>
                                  ))}
                                  {room.images.length > 4 && (
                                    <span className="rounded-full bg-neutral-100 text-xs leading-4 px-2 py-0.5 text-neutral-700">
                                      +{room.images.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <p>No rooms available for this hotel</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="p-6 gap-4">
                <CardHeader className="p-0 gap-2">
                  <div className="items-baseline flex justify-between">
                    <div>
                      <span className="font-bold text-2xl leading-8">
                        {selectedRoom ? `$${selectedRoom.price_per_night}` : "--"}
                      </span>
                      <span className="text-neutral-500 text-sm leading-5">
                        /night
                      </span>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-xs leading-4">
                    {selectedRoom ? `${selectedRoom.type} selected` : "Select a room to continue"}
                  </p>
                </CardHeader>

                <CardContent className="flex p-0 flex-col gap-4">
                  <div className="rounded-xl border-neutral-200 border border-solid overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-neutral-200">
                      <div className="p-3">
                        <label className="block font-semibold uppercase text-neutral-500 text-xs leading-4 tracking-wide mb-1">
                          Check-in
                        </label>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-neutral-500" />
                          <input
                            className="bg-transparent outline-none font-medium text-sm leading-5 w-full"
                            value={bookingDates.check_in}
                            onChange={handleDateChange}
                            name="check_in"
                            type="date"
                            min={todayIso}
                          />
                        </div>
                      </div>
                      <div className="p-3">
                        <label className="block font-semibold uppercase text-neutral-500 text-xs leading-4 tracking-wide mb-1">
                          Check-out
                        </label>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-neutral-500" />
                          <input
                            className="bg-transparent outline-none font-medium text-sm leading-5 w-full"
                            value={bookingDates.check_out}
                            onChange={handleDateChange}
                            name="check_out"
                            type="date"
                            min={bookingDates.check_in || todayIso}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <div className="text-sm leading-5 flex justify-between">
                      <span className="text-neutral-500">
                        {selectedRoom && nights
                          ? `$${selectedRoom.price_per_night} × ${nights} night${nights === 1 ? "" : "s"}`
                          : "Subtotal"}
                      </span>
                      <span className="font-medium">
                        {selectedRoom && nights ? `$${total}` : "--"}
                      </span>
                    </div>
                    <Separator />
                    <div className="font-bold text-sm leading-5 flex justify-between">
                      <span>Total</span>
                      <span>{selectedRoom && nights ? `$${total}` : "--"}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex p-0 flex-col gap-2">
                  <Button
                    className="bg-neutral-900 text-neutral-50 w-full"
                    onClick={handleBooking}
                    disabled={!selectedRoom || bookingSubmitting}
                  >
                    {bookingSubmitting ? "Reserving..." : "Reserve Now"}
                  </Button>
                </CardFooter>
              </Card>

              {hotel.owner_id && typeof hotel.owner_id === "object" && hotel.owner_id.name && (
                <Card className="mt-4 p-4 gap-3">
                  <CardContent className="flex p-0 flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-neutral-100 flex justify-center items-center w-10 h-10">
                        <User className="size-5 text-neutral-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-5">
                          Hosted by {hotel.owner_id.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
