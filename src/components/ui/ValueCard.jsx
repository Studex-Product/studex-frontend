function ValueCard({ icon, title, description }) {
  return (
    <div className="flex flex-col justify-center items-center text-center p-6 hover:shadow-md transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <img src={icon} alt={title} className="w-12 h-12 mb-4" />

      <p className="font-semibold text-lg text-gray-900">{title}</p>

      <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

export default ValueCard;
