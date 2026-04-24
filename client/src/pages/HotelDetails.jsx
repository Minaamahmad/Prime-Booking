import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Images, MapPin, User, Star, Wifi, Coffee, Waves, Award } from "lucide-react";
import { hotelService, roomService, bookingService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";
import Toast from "../components/Toast";
import FormattedDescription from "../components/FormattedDescription";
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

        try {
          console.log('Fetching rooms for hotel:', id);
          const roomsResponse = await roomService.getAvailableRoomsByHotel(id);
          console.log('Rooms fetched:', roomsResponse.data);
          setRooms(roomsResponse.data);
        } catch (err) {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center py-12 px-4">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Hotel not found</h2>
          <p className="text-slate-600 mb-8">The hotel you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Hotels
          </button>
        </div>

        {/* Alerts */}
        <ErrorAlert message={error} onClose={() => setError("")} />
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />

        {/* Hotel Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                {hotel.name}
              </h1>
              {hotel.location && (
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-lg">{hotel.location}</span>
                </div>
              )}
             
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 rounded-3xl mb-12 gap-3 h-[32rem] overflow-hidden shadow-2xl">
          {hotel.images && hotel.images.length > 0 ? (
            <>
              <div className="col-span-2 row-span-2 relative group overflow-hidden">
                <img
                  alt={hotel.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  src={hotel.images[0]?.startsWith('http') ? hotel.images[0] : `${API_BASE_URL}${hotel.images[0]}`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Hotel';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {hotel.images.slice(1, 4).map((image, idx) => (
                <div key={image || idx} className="col-span-1 relative group overflow-hidden">
                  <img
                    alt={`${hotel.name} ${idx + 2}`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}

              <div className="col-span-1 relative">
                {hotel.images.length > 4 ? (
                  <div className="cursor-pointer bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 flex justify-center items-center w-full h-full transition-all duration-300 group">
                    <div className="text-center">
                      <Images className="w-10 h-10 text-slate-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-semibold text-slate-700 text-lg">
                        +{hotel.images.length - 4}
                      </span>
                      <p className="text-slate-600 text-sm">more photos</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-center w-full h-full">
                    <span className="text-slate-500">No more photos</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="col-span-4 bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-center rounded-3xl h-80">
              <div className="text-center">
                <Images className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">No images available</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* About Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  About this hotel
                </h2>
                {hotel.description ? (
                  <FormattedDescription text={hotel.description} />
                ) : (
                  <p className="text-slate-500 leading-relaxed">
                    No description provided.
                  </p>
                )}

                <Separator className="my-6" />

               
              </CardContent>
            </Card>

            {/* Available Rooms */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Available Rooms</h2>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1 text-sm">
                    {rooms.length} room{rooms.length === 1 ? "" : "s"}
                  </Badge>
                </div>

                {rooms.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {rooms.map((room) => {
                      const firstImage = room.images?.[0]
                        ? room.images[0].startsWith('http') 
                          ? room.images[0] 
                          : `${API_BASE_URL}${room.images[0]}`
                        : "https://via.placeholder.com/200x160?text=Room";
                      const isSelected = selectedRoom?._id === room._id;
                      const isUnavailable = room.total_stock === 0;
                      return (
                        <Card
                          key={room._id}
                          role="button"
                          tabIndex={0}
                          className={[
                            "cursor-pointer p-5 transition-all duration-300 hover:shadow-md border-2",
                            isSelected ? "border-blue-600 bg-blue-50/50 shadow-lg" : "border-slate-200 hover:border-slate-300",
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
                          <CardContent className="p-0">
                            <div className="flex items-start gap-5">
                              <div className="flex-shrink-0 rounded-xl w-32 h-24 overflow-hidden bg-slate-100 shadow-md">
                                <img
                                  alt={room.type}
                                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                                  src={firstImage}
                                />
                              </div>
                              <div className="flex flex-col flex-1 gap-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-lg text-slate-900">
                                      {room.type}
                                    </h3>
                                    {isSelected && (
                                      <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                                        ✓ Selected
                                      </Badge>
                                    )}
                                    {isUnavailable && (
                                      <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                                        Unavailable
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-baseline gap-1">
                                      <span className="font-bold text-2xl text-slate-900">
                                        ${room.price_per_night}
                                      </span>
                                      <span className="text-slate-500 text-sm">
                                        /night
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {room.images && room.images.length > 1 && (
                                  <div className="flex mt-2 flex-wrap gap-2">
                                    {room.images.slice(1, 4).map((img, i) => (
                                      <span
                                        key={`${room._id}-img-${i}`}
                                        className="rounded-full bg-slate-100 text-xs px-3 py-1 text-slate-600 font-medium hover:bg-slate-200 transition-colors"
                                      >
                                        Photo {i + 2}
                                      </span>
                                    ))}
                                    {room.images.length > 4 && (
                                      <span className="rounded-full bg-slate-100 text-xs px-3 py-1 text-slate-600 font-medium">
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
                  <div className="text-center py-12 bg-slate-50 rounded-2xl">
                    <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-600 font-medium">No rooms available for this hotel</p>
                    <p className="text-slate-500 text-sm mt-1">Check back later for availability</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Booking Card */}
              <Card className="border-0 shadow-xl bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {selectedRoom ? `$${selectedRoom.price_per_night}` : "--"}
                    </span>
                    <span className="text-blue-100 text-lg">/night</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-2">
                    {selectedRoom ? `${selectedRoom.type} selected` : "Select a room to continue"}
                  </p>
                </div>

                <CardContent className="p-6 space-y-5">
                  {/* Date Selection */}
                  <div className="rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-blue-300 transition-colors duration-300">
                    <div className="grid grid-cols-1 divide-y divide-slate-200">
                      <div className="p-4 hover:bg-slate-50 transition-colors">
                        <label className="block font-semibold uppercase text-slate-600 text-xs tracking-wide mb-2">
                          Check-in
                        </label>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <input
                            className="bg-transparent outline-none font-medium text-slate-900 w-full"
                            value={bookingDates.check_in}
                            onChange={handleDateChange}
                            name="check_in"
                            type="date"
                            min={todayIso}
                          />
                        </div>
                      </div>
                      <div className="p-4 hover:bg-slate-50 transition-colors">
                        <label className="block font-semibold uppercase text-slate-600 text-xs tracking-wide mb-2">
                          Check-out
                        </label>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <input
                            className="bg-transparent outline-none font-medium text-slate-900 w-full"
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

                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-600">
                      <span>
                        {selectedRoom && nights
                          ? `$${selectedRoom.price_per_night} × ${nights} night${nights === 1 ? "" : "s"}`
                          : "Subtotal"}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {selectedRoom && nights ? `$${total}` : "--"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="font-bold text-slate-900">
                        {selectedRoom && nights ? `$${total}` : "--"}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
                    onClick={handleBooking}
                    disabled={!selectedRoom || bookingSubmitting}
                  >
                    {bookingSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Reserving...
                      </span>
                    ) : (
                      "Reserve Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Host Card */}
              {hotel.owner_id && typeof hotel.owner_id === "object" && hotel.owner_id.name && (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex justify-center items-center w-14 h-14 flex-shrink-0">
                        <User className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-base mb-1">
                          Hosted by {hotel.owner_id.name}
                        </p>
                        <p className="text-slate-600 text-sm">Superhost · 5 years hosting</p>
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
