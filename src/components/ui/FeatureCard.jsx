export default function FeatureCard({ icon, title, description }) {
  return (
    <div
      className="bg-white text-gray-800 border shadow-sm hover:shadow-md rounded-2xl p-6 flex flex-col items-center text-center transform transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      {icon && (
        <div className="w-14 h-14 flex items-center justify-center rounded-full mb-4 overflow-hidden bg-purple-100">
          <img src={icon} alt={title} className="w-10 h-10 object-contain" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}
