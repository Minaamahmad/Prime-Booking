import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Loading from '../components/Loading';

const RoomManagement = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Single',
    price_per_night: '',
    total_stock: '',
  });
  const [selectedImages, setSelectedImages] = useState([]);

  // Base URL for images
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await roomService.getRoomsByHotel(hotelId);
      setRooms(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  },[hotelId]);

  useEffect(() => {
    fetchRooms();
  }, [hotelId, fetchRooms]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.price_per_night || !formData.total_stock) {
      setError('Please fill in all required fields');
      return;
    }

    // Prepare data with proper types
    const roomData = {
      ...formData,
      price_per_night: parseFloat(formData.price_per_night),
      total_stock: parseInt(formData.total_stock),
    };

    try {
      let roomId;
      if (editingRoom) {
        await roomService.updateRoom(hotelId, editingRoom._id, roomData);
        roomId = editingRoom._id;
        setSuccess('Room updated successfully!');
      } else {
        const response = await roomService.createRoom(hotelId, roomData);
        roomId = response.data._id;
        setSuccess('Room created successfully!');
      }

      // Upload images if selected
      if (selectedImages.length > 0) {
        await roomService.uploadRoomImages(hotelId, roomId, selectedImages);
        setSuccess('Room and images uploaded successfully!');
      }

      setFormData({ type: 'Single', price_per_night: '', total_stock: '' });
      setSelectedImages([]);
      setEditingRoom(null);
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      type: room.type,
      price_per_night: room.price_per_night,
      total_stock: room.total_stock,
    });
    setShowForm(true);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await roomService.deleteRoom(hotelId, roomId);
      setSuccess('Room deleted successfully!');
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleCancel = () => {
    setEditingRoom(null);
    setFormData({ type: 'Single', price_per_night: '', total_stock: '' });
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
              onClick={() => navigate('/hotels')} 
              className="text-sm text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-2 transition-colors font-medium"
            >
              ← Back to Hotels
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
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
            {showForm ? '✕ Cancel' : '+ Add New Room'}
          </button>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />
        <SuccessAlert message={success} onClose={() => setSuccess('')} />

        {/* Dynamic Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm mb-10 transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingRoom ? 'Edit Room Details' : 'Create New Room'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Configure the pricing and availability for this room type.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Room Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Room Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#0B0F19] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price_per_night" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Price per Night ($) *
                  </label>
                  <input
                    type="number"
                    id="price_per_night"
                    name="price_per_night"
                    value={formData.price_per_night}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#0B0F19] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="total_stock" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Total Rooms Available *
                  </label>
                  <input
                    type="number"
                    id="total_stock"
                    name="total_stock"
                    value={formData.total_stock}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="e.g. 10"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#0B0F19] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-1.5 mt-2">
                  Room Images
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

              {/* Actions */}
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
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rooms Grid Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading message="Loading rooms..." />
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map((room) => (
              
              /* Redesigned Room Card */
              <div 
                key={room._id} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Image Top Half */}
                <div className="h-56 relative w-full bg-gray-100 group">
                  {room.images && room.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      {/* Main image */}
                      <img 
                        src={room.images[0]} 
                        alt={`${room.type} Room`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/300';
                          e.target.onerror = null;
                        }}
                      />
                      
                      {/* Image gallery overlay for multiple images */}
                      {room.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          {room.images.slice(1, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${room.type} Room ${index + 2}`}
                              className="w-8 h-8 object-cover rounded border-2 border-white shadow-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ))}
                          {room.images.length > 4 && (
                            <div className="w-8 h-8 bg-black/70 rounded flex items-center justify-center text-white text-xs font-medium">
                              +{room.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <span className="text-5xl mb-2 block">🛏️</span>
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}

                  {/* Floating Room Type Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                    {room.type} Room
                  </div>

                  {/* Floating Image Count Badge */}
                  {room.images && room.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      📷 {room.images.length}
                    </div>
                  )}
                </div>

                {/* Content Bottom Half */}
                <div className="p-6 flex flex-col flex-1">
                  
                  {/* Price & Stock Row */}
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Price</p>
                      <h3 className="text-2xl font-bold text-gray-900 leading-none">
                        ${room.price_per_night} <span className="text-sm font-medium text-gray-400">/ night</span>
                      </h3>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        room.total_stock > 3 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {room.total_stock} Available
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-50">
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                    
                    {/* Primary Action Button */}
                    <button
                      onClick={() => handleEdit(room)}
                      className="bg-[#0B0F19] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <span>✏️</span> Edit
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
            <span className="text-6xl mb-4 block text-gray-300">🛏️</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No rooms available</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't added any rooms to this property yet. Create your first room to start accepting bookings.
            </p>
            <button
              className="px-8 py-3 bg-[#0B0F19] text-white font-semibold rounded-full shadow-sm hover:bg-black transition-all"
              onClick={() => {
                handleCancel();
                setShowForm(true);
              }}
            >
              + Create First Room
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default RoomManagement;