export default function SearchBar() {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 -mt-8 relative z-10 mx-auto max-w-5xl">
      <form className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search for services (e.g., City Hospital)" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        
        <select className="px-4 py-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition">
          <option value="">All Categories</option>
          <option value="hospital">Hospital</option>
          <option value="police">Police Station</option>
          <option value="bank">Bank</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="school">School</option>
          <option value="gov">Gov Office</option>
        </select>

        <select className="px-4 py-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition">
          <option value="">Any Type</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
        </select>

        <select className="px-4 py-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition">
          <option value="1">Within 1km</option>
          <option value="5" selected>Within 5km</option>
          <option value="10">Within 10km</option>
        </select>

        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200 shadow-sm"
        >
          Search
        </button>
      </form>
    </div>
  );
}