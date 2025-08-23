export default function FeatureCard({ icon, title, description, variant = "white" }) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col items-center text-center transform transition-transform duration-300 ease-out hover:-translate-y-1
        ${variant === "white" ? "bg-white text-gray-800 border shadow-sm hover:shadow-md" : ""}
        ${variant === "purple" ? "bg-purple-600 text-white border shadow-sm hover:bg-purple-700 hover:shadow-md" : ""}
        ${variant === "outline" ? "bg-transparent text-purple-600 border border-purple-500 shadow-sm hover:bg-purple-50 hover:shadow-md" : ""}
      `}
    >
      {icon && (
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 overflow-hidden
            ${variant === "purple" ? "bg-white/20" : "bg-purple-100"}`
          }
        >
          <img src={icon} alt={title} className="w-6 h-6 object-contain" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}
