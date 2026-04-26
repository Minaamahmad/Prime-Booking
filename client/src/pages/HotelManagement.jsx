import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Loading from '../components/Loading';
import { Bold, Italic, List, ListOrdered, Wifi, Coffee, Waves, ArrowLeft, Plus, X, Edit2, Trash2, Settings, Car, Dumbbell, Utensils, Snowflake, Tv, Shield } from "lucide-react";

const HotelManagement = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingHotel, setEditingHotel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    amenities: [],
  });
  const descriptionRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hotelService.getMyHotels();
      setHotels(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const applyToSelection = ({ prefix = "", suffix = "" }) => {
    const el = descriptionRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value ?? "";
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    setFormData((prev) => ({ ...prev, description: next }));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  };

  const insertAtCursor = (text) => {
    const el = descriptionRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value ?? "";
    const next = value.slice(0, start) + text + value.slice(end);
    setFormData((prev) => ({ ...prev, description: next }));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const makeBullets = () => {
    const el = descriptionRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value ?? "";
    const selected = value.slice(start, end);
    const lines = (selected || "").split("\n");
    const hasSelection = end > start;
    const bulletLines = (hasSelection ? lines : [""]).map((l) => (l.trim().length ? `- ${l.replace(/^-+\s*/, "")}` : "- "));
    const insertText = bulletLines.join("\n");
    const next = value.slice(0, start) + insertText + value.slice(end);
    setFormData((prev) => ({ ...prev, description: next }));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + insertText.length, start + insertText.length);
    });
  };

  const makeNumbered = () => {
    const el = descriptionRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value ?? "";
    const selected = value.slice(start, end);
    const lines = (selected || "").split("\n");
    const hasSelection = end > start;
    const numbered = (hasSelection ? lines : [""]).map((l, idx) => {
      const n = idx + 1;
      const clean = l.replace(/^\d+\.\s*/, "");
      return `${n}. ${clean || ""}`.trimEnd();
    });
    const insertText = numbered.join("\n");
    const next = value.slice(0, start) + insertText + value.slice(end);
    setFormData((prev) => ({ ...prev, description: next }));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + insertText.length, start + insertText.length);
    });
  };

  const handleFileChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      setError('Name and location are required');
      return;
    }

    try {
      let hotelId;
      if (editingHotel) {
        await hotelService.updateHotel(editingHotel._id, formData);
        hotelId = editingHotel._id;
        setSuccess('Hotel updated successfully');
      } else {
        const response = await hotelService.createHotel(formData);
        hotelId = response.data._id;
        setSuccess('Hotel created successfully');
      }

      if (selectedImages.length > 0) {
        await hotelService.uploadHotelImages(hotelId, selectedImages);
      }

      setFormData({ name: '', location: '', description: '', amenities: [] });
      setSelectedImages([]);
      setEditingHotel(null);
      setShowForm(false);
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hotel');
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description || '',
      amenities: hotel.amenities || [],
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      await hotelService.deleteHotel(hotelId);
      setSuccess('Hotel deleted successfully');
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete hotel');
    }
  };

  const handleCancel = () => {
    setEditingHotel(null);
    setFormData({ name: '', location: '', description: '', amenities: [] });
    setSelectedImages([]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-200">
          <div>
            <button
              onClick={() => navigate('/owner-dashboard')}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-indigo-600 mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
          </div>

          <button
            onClick={() => {
              if (showForm) handleCancel();
              setShowForm(!showForm);
            }}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${
              showForm
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Hotel
              </>
            )}
          </button>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />
        <SuccessAlert message={success} onClose={() => setSuccess('')} />

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-8 mb-12 border border-gray-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingHotel ? 'Edit Hotel' : 'New Hotel'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter hotel name"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => applyToSelection({ prefix: "**", suffix: "**" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyToSelection({ prefix: "*", suffix: "*" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={makeBullets}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={makeNumbered}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-px bg-gray-200" />
                  <button
                    type="button"
                    onClick={() => insertAtCursor(":wifi:")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    <Wifi className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor(":breakfast:")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor(":pool:")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    <Waves className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your hotel..."
                  rows="4"
                  ref={descriptionRef}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                />
                {selectedImages.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500 font-semibold">{selectedImages.length} file(s) selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'wifi', label: 'WiFi', icon: Wifi },
                    { id: 'pool', label: 'Pool', icon: Waves },
                    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
                    { id: 'parking', label: 'Parking', icon: Car },
                    { id: 'gym', label: 'Gym', icon: Dumbbell },
                    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
                    { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
                    { id: 'tv', label: 'TV', icon: Tv },
                    { id: 'security', label: '24/7 Security', icon: Shield },
                  ].map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <label
                        key={amenity.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.amenities.includes(amenity.id)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.id)}
                          onChange={() => handleAmenityToggle(amenity.id)}
                          className="sr-only"
                        />
                        <Icon className={`w-4 h-4 ${
                          formData.amenities.includes(amenity.id) ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.amenities.includes(amenity.id) ? 'text-indigo-900' : 'text-gray-700'
                        }`}>
                          {amenity.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Hotels Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loading message="Loading hotels..." />
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors"
              >
                {/* Image */}
                <div className="h-48 bg-gray-50 flex items-center justify-center">
                  {hotel.images && hotel.images.length > 0 ? (
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-gray-300">🏨</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {hotel.location}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-5 line-clamp-2 min-h-[2.5rem]">
                    {hotel.description || 'No description available'}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5 font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hotel._id)}
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors inline-flex items-center gap-1.5 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                    <button
                      onClick={() => navigate(`/rooms/${hotel._id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-200 mb-4">🏨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hotels yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first hotel</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Add Hotel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelManagement;