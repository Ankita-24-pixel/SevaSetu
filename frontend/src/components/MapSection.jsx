import { Map, MapPin, Navigation } from 'lucide-react';

export default function MapSection() {
  return (
    <section className="py-20 px-6 container mx-auto">
      <div className="bg-slate-900 rounded-[2.5rem] p-2 sm:p-4 shadow-2xl relative overflow-hidden">
        {/* Real map background feel */}
        <div className="relative w-full h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden bg-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
            alt="Map View" 
            className="w-full h-full object-cover opacity-60"
          />
          
          {/* Overlay UI element to make it look like a real app feature */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8 lg:p-12">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Explore on the Map
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Visualize all nearby government and private services in real-time. See exact distances and get directions instantly.
              </p>
              <button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors shadow-lg">
                <Map size={20} />
                Open Interactive Map
              </button>
            </div>
          </div>

          {/* Fake Map Markers */}
          <div className="absolute top-1/3 left-1/4 bg-white text-blue-600 p-3 rounded-full shadow-xl shadow-blue-900/50 animate-bounce">
            <MapPin size={24} className="fill-blue-100" />
          </div>
          <div className="absolute top-1/2 right-1/3 bg-white text-red-500 p-3 rounded-full shadow-xl shadow-red-900/50 animate-pulse">
            <MapPin size={24} className="fill-red-100" />
          </div>
          
          {/* User Location Marker */}
          <div className="absolute bottom-1/3 left-1/2 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-blue-500/20 rounded-full animate-ping"></div>
            <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg relative z-10 border-2 border-white">
              <Navigation size={20} className="fill-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}