const TestimonialCardItem = ({ avatar, name, institution, testimonial, altText }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl w-full p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
        <div className="flex-shrink-0 ">
          <img
            src={avatar}
            alt={altText}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-22 md:h-22 rounded-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-md md:text-2xl font-semibold text-[#363636] truncate">
            {name},
            <span className="text-xs sm:text-sm md:text-xl font-medium pl-1">
              {institution}
            </span>
          </h3>
        </div>
      </div>
      <p className="text-[#363636] leading-relaxed text-xs sm:text-sm md:text-xl line-clamp-4 ">
        "{testimonial}"
      </p>
    </div>
  )
}

export default TestimonialCardItem