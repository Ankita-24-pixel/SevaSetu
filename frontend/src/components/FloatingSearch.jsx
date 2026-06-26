// import { Search, MapPin, Crosshair, Building2, SlidersHorizontal } from 'lucide-react';

// export default function FloatingSearch() {
//   return (
//     <div className="max-w-5xl p-3 mx-auto bg-white border shadow-2xl rounded-3xl shadow-slate-200/50 border-slate-100 sm:p-4">
//       <form className="flex flex-col gap-2 lg:flex-row lg:gap-0 lg:divide-x divide-slate-100">
        
//         {/* Search Input */}
//         <div className="flex items-center flex-1 gap-3 px-4 py-3 transition-colors hover:bg-slate-50 rounded-2xl cursor-text">
//           <Search className="text-slate-400" size={22} />
//           <div className="flex-1">
//             <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-800">Looking for</label>
//             <input 
//               type="text" 
//               placeholder="Hospitals, Police, Banks..." 
//               className="w-full font-medium bg-transparent outline-none text-slate-900 placeholder-slate-400"
//             />
//           </div>
//         </div>

//         {/* Location / Radius */}
//         <div className="flex items-center justify-between flex-1 px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50 rounded-2xl group">
//           <div className="flex items-center gap-3">
//             <MapPin className="text-slate-400" size={22} />
//             <div>
//               <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-800">Where</label>
//               <select className="font-medium bg-transparent outline-none appearance-none cursor-pointer text-slate-900">
//                 <option>Current Location (5km)</option>
//                 <option>Current Location (10km)</option>
//                 <option>Custom City...</option>
//               </select>
//             </div>
//           </div>
//           <button type="button" className="p-2 text-blue-600 transition-colors rounded-full opacity-0 hover:bg-blue-50 group-hover:opacity-100" title="Detect Location">
//             <Crosshair size={18} />
//           </button>
//         </div>

//         {/* Type Filter */}
//         <div className="flex items-center flex-1 gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50 rounded-2xl">
//           <Building2 className="text-slate-400" size={22} />
//           <div>
//             <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-800">Sector</label>
//             <select className="font-medium bg-transparent outline-none appearance-none cursor-pointer text-slate-900">
//               <option>All Sectors</option>
//               <option>Government Only</option>
//               <option>Private Only</option>
//             </select>
//           </div>
//         </div>

//         {/* Search Button */}
//         <div className="px-2 py-2 lg:pl-4">
//           <button type="submit" className="w-full lg:w-auto h-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
//             <Search size={20} />
//             <span>Search</span>
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// }
import { useState } from 'react';
import { Search, MapPin, Crosshair, Building2 } from 'lucide-react';

export default function FloatingSearch({ onSearch }) {
  const [category, setCategory] = useState('');
  const [radius, setRadius] = useState('5');
  const [type, setType] = useState('');
  const [locationText, setLocationText] = useState('Current Location');
  const [coords, setCoords] = useState({ lat: null, lng: null });

  // 1. Get User Location using Browser API
  const handleDetectLocation = () => {
    setLocationText('Locating...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationText('Location Detected ✓');
        },
        (error) => {
          console.error("Error getting location", error);
          setLocationText('Location Access Denied');
        }
      );
    } else {
      setLocationText('Geolocation not supported');
    }
  };

  // 2. Prevent Refresh and Trigger Search
  const handleSubmit = (e) => {
    e.preventDefault(); // <--- THIS IS THE MAGIC LINE THAT STOPS THE REFRESH
    if (!coords.lat || !coords.lng) {
      alert("Please click the target icon to 'Detect My Location' before searching!");
      setLocationText('⚠️ Location Required');
      return; // Stops the function from sending a bad request
    }
    
    // Pass the collected data back up to the Home page to make the API call
    onSearch({
      category,
      radius,
      type,
      lat: coords.lat,
      lng: coords.lng
    });
  };

  return (
    <div className="max-w-5xl p-3 mx-auto bg-white border shadow-2xl rounded-3xl shadow-slate-200/50 border-slate-100 sm:p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 lg:flex-row lg:gap-0 lg:divide-x divide-slate-100">
        
        {/* Search Input */}
        <div className="flex items-center flex-1 gap-3 px-4 py-3 transition-colors hover:bg-slate-50 rounded-2xl cursor-text">
          <Search className="text-slate-400" size={22} />
          <div className="flex-1">
            <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-800">Looking for</label>
            <input 
              type="text" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Hospitals, Police, Banks..." 
              className="w-full font-medium bg-transparent outline-none text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Location / Radius */}
        <div className="flex items-center justify-between flex-1 px-4 py-3 transition-colors hover:bg-slate-50 rounded-2xl group">
          <div className="flex items-center gap-3">
            <MapPin className="text-slate-400" size={22} />
            <div>
              <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-800">{locationText}</label>
              <select 
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="font-medium bg-transparent outline-none appearance-none cursor-pointer text-slate-900"
              >
                <option value="2">Within 2km</option>
                <option value="5">Within 5km</option>
                <option value="10">Within 10km</option>
                <option value="25">Within 25km</option>
              </select>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleDetectLocation}
            className="p-2 text-blue-600 transition-colors rounded-full opacity-100 hover:bg-blue-50 lg:opacity-0 lg:group-hover:opacity-100" 
            title="Detect My Location"
          >
            <Crosshair size={18} />
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center flex-1 gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50 rounded-2xl">
          <Building2 className="text-slate-400" size={22} />
          <div>
            <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-800">Sector</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="font-medium bg-transparent outline-none appearance-none cursor-pointer text-slate-900"
            >
              <option value="">All Sectors</option>
              <option value="Government">Government Only</option>
              <option value="Private">Private Only</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-2 py-2 lg:pl-4">
          <button type="submit" className="w-full lg:w-auto h-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>

      </form>
    </div>
  );
}