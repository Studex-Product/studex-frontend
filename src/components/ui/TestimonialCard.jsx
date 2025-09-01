import Avatar1 from '../../assets/images/Ellipse 2195.png'
import Avatar2 from '../../assets/images/Ellipse 2196.png'
import { useState } from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'

const Testimonial = () => {

    const [currentSlide, setCurrentSlide] = useState(0)

    const nextSlide = () => {

        setCurrentSlide(prev => prev + 1)
    }
    const prevSlide = () => {
        setCurrentSlide(prev => prev - 1)
    }

    return (
      <div className="bg-white mt-8 md:mt-16 pb-12 md:pb-20">
        <div className="mx-auto w-full max-w-[900px] pb-6 md:pb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-center pt-6 md:pt-8 pb-3 md:pb-4 px-4">
            What Students Say About
            <span className="text-chart-4"> StudEx</span>
          </h2>
          <p className="text-[#595959] font-medium text-center px-4 text-sm md:text-base">
            Their words, not ours. Hear how StudEx is helping students save
            money, declutter, and connect <br className="hidden sm:block" />
            with roommates.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">

          {/* Arrow buttons */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 md:p-3 transition-all duration-200 ${
              currentSlide === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-chart-4 hover:bg-purple-200 cursor-pointer"
            }`}>
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === 1}
            className={`absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 md:p-3 transition-all duration-200 ${
              currentSlide === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-chart-4 hover:bg-purple-200 cursor-pointer"
            }`}>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-2 sm:mx-4 md:mx-8 lg:mx-16 pt-6">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>

              {/* Slide 1 */}
              <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 min-w-full px-1 sm:px-2 md:px-4">

                {/* Card 1 */}
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl w-full p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={Avatar1}
                        alt="Emeka avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#363636] truncate">
                        Emeka,
                        <span className="text-xs sm:text-sm md:text-sm font-semibold text-[#363636] pl-1">
                          Covenant University
                        </span>
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#363636] leading-relaxed text-xs sm:text-sm md:text-base line-clamp-4 font-normal">
                    "I've bought clothes, sold gadgets and even met a cool
                    roommate. It feels like a real student marketplace."
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl w-full p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={Avatar2}
                        alt="Veronica avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#363636] truncate">
                        Veronica,
                        <span className="text-xs sm:text-sm md:text-sm font-semibold text-[#363636] pl-1">
                          UI
                        </span>
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#363636] leading-relaxed text-xs sm:text-sm md:text-base line-clamp-4 font-normal">
                    "I sold two old laptops in one week. No stress, and I met
                    real buyers fast. StudEx is my go-to now"
                  </p>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 min-w-full px-1 sm:px-2 md:px-4">

                {/* Card 3 */}
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl w-full p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={Avatar1}
                        alt="James avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#363636] truncate">
                        James,
                        <span className="text-xs sm:text-sm md:text-sm font-semibold text-[#363636] pl-1">
                          UNILAG
                        </span>
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#363636] leading-relaxed text-xs sm:text-sm md:text-base line-clamp-4 font-normal">
                    "Found my textbooks for half the price! The delivery was
                    super fast and the books were in great condition."
                  </p>
                </div>

                {/* Card 4 */}
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl w-full p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={Avatar2}
                        alt="Sarah avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#363636] truncate">
                        Sarah,
                        <span className="text-xs sm:text-sm md:text-sm font-semibold text-[#363636] pl-1">
                          LASU
                        </span>
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#363636] leading-relaxed text-xs sm:text-sm md:text-base line-clamp-4 font-normal">
                    "The roommate matching feature is amazing! Found someone who
                    shares my study habits and lifestyle."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile dots indicator */}
          <div className="flex justify-center mt-6 gap-2 md:hidden">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentSlide === 0 ? "bg-chart-4" : "bg-gray-300"
              }`}
            />
            <button
              onClick={() => setCurrentSlide(1)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentSlide === 1 ? "bg-chart-4" : "bg-gray-300"
              }`}
            />
          </div>
        </div>
      </div>
    );
}

export default Testimonial