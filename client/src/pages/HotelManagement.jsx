import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Loading from '../components/Loading';
import { Bold, Italic, List, ListOrdered, Wifi, Coffee, Waves } from "lucide-react";

const HotelManagement = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const[loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const[success, setSuccess] = useState('');
  const [editingHotel, setEditingHotel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
  });
  const descriptionRef = useRef(null);
  const[selectedImages, setSelectedImages] = useState([]);

  // Base URL for images if they are stored as relative paths on your backend
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchHotels();
  },[]);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const cursorStart = start + prefix.length;
      const cursorEnd = end + prefix.length;
      el.setSelectionRange(cursorStart, cursorEnd);
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
      const newPos = start + insertText.length;
      el.setSelectionRange(newPos, newPos);
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
      const newPos = start + insertText.length;
      el.setSelectionRange(newPos, newPos);
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
        setSuccess('Hotel updated successfully!');
      } else {
        const response = await hotelService.createHotel(formData);
        hotelId = response.data._id;
        setSuccess('Hotel created successfully!');
      }

      // Upload images if selected
      if (selectedImages.length > 0) {
        await hotelService.uploadHotelImages(hotelId, selectedImages);
        setSuccess('Hotel and images uploaded successfully!');
      }

      setFormData({ name: '', location: '', description: '' });
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
    });
    setShowForm(true);
    // Scroll to top smoothly so user sees the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    try {
      await hotelService.deleteHotel(hotelId);
      setSuccess('Hotel deleted successfully!');
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete hotel');
    }
  };

  const handleCancel = () => {
    setEditingHotel(null);
    setFormData({ name: '', location: '', description: '' });
    setSelectedImages([]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-gray-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Global Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <button 
              onClick={() => navigate('/owner-dashboard')} 
              className="text-sm text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-2 transition-colors font-medium"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
          </div>
          
          <button
            className={`px-6 py-3 font-semibold rounded-full shadow-sm transition-all flex items-center gap-2 ${
              showForm 
                ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' 
                : 'bg-[#0B0F19] text-white hover:bg-black'
            }`}
            onClick={() => {
              handleCancel();
              setShowForm(!showForm);
            }}
          >
            {showForm ? '✕ Cancel' : '+ Add New Hotel'}
          </button>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />
        <SuccessAlert message={success} onClose={() => setSuccess('')} />

        {/* Dynamic Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm mb-10 transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingHotel ? 'Edit Hotel Details' : 'Create New Hotel'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Fill in the information below to manage your property.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. The Grand Plaza"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#0B0F19] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. New York, NY"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#0B0F19] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => applyToSelection({ prefix: "**", suffix: "**" })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => applyToSelection({ prefix: "*", suffix: "*" })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={makeBullets}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    title="Bullet list"
                  >
                    <List className="w-4 h-4" />
                    Bullets
                  </button>
                  <button
                    type="button"
                    onClick={makeNumbered}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    title="Numbered list"
                  >
                    <ListOrdered className="w-4 h-4" />
                    Numbered
                  </button>

                  <div className="h-6 w-px bg-gray-200 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertAtCursor(":wifi:")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    title="Insert WiFi icon"
                  >
                    <Wifi className="w-4 h-4 text-blue-600" />
                    WiFi
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor(":breakfast:")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    title="Insert Breakfast icon"
                  >
                    <Coffee className="w-4 h-4 text-amber-600" />
                    Breakfast
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor(":pool:")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    title="Insert Pool icon"
                  >
                    <Waves className="w-4 h-4 text-cyan-600" />
                    Pool
                  </button>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property, amenities, and unique features..."
                  rows="4"
                  ref={descriptionRef}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#0B0F19] focus:border-transparent outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Use bullets with <span className="font-semibold">-</span> and insert icons with
                  <span className="font-mono"> :wifi: :breakfast: :pool:</span>
                </p>
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Hotel Images
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all cursor-pointer"
                  />
                  {selectedImages.length > 0 && (
                    <span className="shrink-0 px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                      ✓ {selectedImages.length} selected
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-8 mt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-2.5 bg-[#0B0F19] text-white font-semibold rounded-full hover:bg-black transition-colors shadow-sm"
                >
                  {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Hotels Grid Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading message="Loading hotels..." />
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              
              /* Redesigned Card Matching Reference Image */
              <div 
                key={hotel._id} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Image Top Half */}
                <div className="h-64 relative w-full bg-gray-100">
                  {hotel.images && hotel.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      {/* Main image */}
                      <img 
                        src={hotel.images[0].startsWith('http') ? hotel.images[0] : `${API_BASE_URL}${hotel.images[0]}`} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Image gallery overlay for multiple images */}
                      {hotel.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 flex gap-1">
                          {hotel.images.slice(1, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                              alt={`${hotel.name} ${index + 2}`}
                              className="w-10 h-10 object-cover rounded border-2 border-white shadow-sm"
                            />
                          ))}
                          {hotel.images.length > 4 && (
                            <div className="w-10 h-10 bg-black/70 rounded flex items-center justify-center text-white text-xs font-medium">
                              +{hotel.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <span className="text-5xl mb-2 block">🏨</span>
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}
                </div>

                {/* Content Bottom Half */}
                <div className="p-6 flex flex-col flex-1">
                  
                  {/* Title & Location Row */}
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">
                      {hotel.name}
                    </h3>
                    {/* The Location takes the place of the Price in the reference */}
                    <span className="text-sm font-bold text-gray-900 shrink-0">
                      {hotel.location}
                    </span>
                  </div>

                  {/* Description Paragraph */}
                  <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {hotel.description || 'A beautiful futuristic and sculptural masterpiece blending elegant functionality.'}
                  </p>

                  {/* Footer Actions */}
                  <div className="flex justify-between items-center mt-auto">
                    
                    {/* Secondary Actions (Edit/Delete) */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hotel._id)}
                        className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {/* Primary Action Button (Matches the black "Buy" pill) */}
                    <button
                      onClick={() => navigate(`/rooms/${hotel._id}`)}
                      className="bg-[#0B0F19] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black transition-transform active:scale-95"
                    >
                      Manage
                    </button>

                  </div>
                </div>
              </div>
              /* End Card */

            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200 mt-8">
            <span className="text-5xl mb-4 block text-gray-300">🏢</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't created any properties yet. Add your first hotel to start managing rooms and bookings.
            </p>
            <button
              className="px-8 py-3 bg-[#0B0F19] text-white font-semibold rounded-full shadow-sm hover:bg-black transition-all"
              onClick={() => {
                handleCancel();
                setShowForm(true);
              }}
            >
              + Create First Hotel
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default HotelManagement;