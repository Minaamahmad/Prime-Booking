import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService } from '../services/api';
import HotelCard from '../components/HotelCard';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
    <div className="div">

       <div className="  fixed top-14 left-0 right-0 h-90 wd-20 bg-red-600  ">
 
       <section className="w-full h-[400px] bg-slate-900 overflow-hidden">
        {filteredHotels.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 8000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {filteredHotels.slice(0, 5).map((hotel) => (
              <SwiperSlide key={hotel._id}>
                <div className="relative h-full w-full">
                  <img 
                    src={hotel.images?.[0] || 'https://via.placeholder.com/800x400?text=Hotel'} 
                    alt={hotel.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x400?text=Hotel';
                    }}
                  />
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-12 left-10 text-white">
                    <h2 className="text-4xl font-bold">{hotel.name}</h2>
                    <p className="text-lg text-slate-300">{hotel.location}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500">
            Loading Highlights...
          </div>
        )}
       </section>

       <div className="w-full px-4 mt-10 mb-8"> 
  <div className="max-w-4xl mx-auto">
    <label htmlFor="hotel-search" className="sr-only">Search hotels</label>
    <div className="relative group">
      <input
        id="hotel-search"
        type="text"
        placeholder="Search location or hotel"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
       
        
        className="w-full  border border-white/10 bg-slate-900/90 backdrop-blur-md px-8 py-5 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary-teal focus:ring-4 focus:ring-primary-teal/10 transition-all shadow-2xl"
      />
      
     
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-teal transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </div>
</div>
       </div>
      
      

       

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <Loading message="Loading hotels..." />
          ) : filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
          ) : (
            <div className="col-span-full rounded-[2rem] border border-white/10 bg-slate-950/70 p-10 text-center text-slate-300">
              <p className="text-lg font-medium text-slate-100">No hotels found</p>
              <p className="mt-2 text-sm text-slate-400">Try a different search phrase.</p>
            </div>
          )}
        </section>

        <ErrorAlert message={error} onClose={() => setError('')} />
      </div>
  );
};

export default Home;
