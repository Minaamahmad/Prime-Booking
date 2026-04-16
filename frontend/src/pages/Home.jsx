import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService } from '../services/api';
import HotelCard from '../components/HotelCard';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import '../styles/Home.css';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hotelService.getAllHotels();
      setHotels(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) =>
    searchLocation === '' ||
    hotel.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
    hotel.name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Find Your Perfect Hotel</h1>
        <p>Discover amazing hotels at great prices</p>
      </section>

      <section className="search-section">
        <input
          type="text"
          placeholder="Search by location or hotel name..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="search-input"
        />
      </section>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <Loading message="Loading hotels..." />
      ) : (
        <section className="hotels-grid">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))
          ) : (
            <div className="no-results">
              <h3>No hotels found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
