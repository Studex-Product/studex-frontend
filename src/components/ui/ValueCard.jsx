function ValueCard({ icon, title, description }) {
  return (
    <div className="flex flex-col justify-center items-center text-center p-6 ">
      
      <img src={icon} alt={title} className="w-12 h-12 mb-4" />

      <p className="font-semibold lg:text-[22px] text-[20px] text-gray-700">{title}</p>

      <p className="text-[14px] lg:text-[16px] text-gray-600 mt-2 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

export default ValueCard;
