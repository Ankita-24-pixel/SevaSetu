export default function StatsSection() {
  const stats = [
    { number: "10,000+", label: "Verified Services" },
    { number: "500+", label: "Cities Covered" },
    { number: "50,000+", label: "Active Users" },
    { number: "100%", label: "Free to Use" }
  ];

  return (
    <section className="py-12 border-y border-slate-200 bg-white relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-4">
              <h3 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                {stat.number}
              </h3>
              <p className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}