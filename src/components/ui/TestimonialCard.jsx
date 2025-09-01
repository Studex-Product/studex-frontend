import Avatar1 from '../../assets/images/Ellipse 2195.png'
import Avatar2 from '../../assets/images/Ellipse 2196.png'
import { useState } from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import TestimonialCardItem from './TestimonialCardItem'

const Testimonial = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const testimonials = [
        {
            avatar: Avatar1,
            name: "Emeka",
            institution: "Covenant University",
            testimonial: "I've bought clothes, sold gadgets and even met a cool roommate. It feels like a real student marketplace.",
            altText: "Emeka avatar"
        },
        {
            avatar: Avatar2,
            name: "Veronica",
            institution: "UI",
            testimonial: "I sold two old laptops in one week. No stress, and I met real buyers fast. StudEx is my go-to now",
            altText: "Veronica avatar"
        },
        {
            avatar: Avatar1,
            name: "James",
            institution: "UNILAG",
            testimonial: "Found my textbooks for half the price! The delivery was super fast and the books were in great condition.",
            altText: "James avatar"
        },
        {
            avatar: Avatar2,
            name: "Sarah",
            institution: "LASU",
            testimonial: "The roommate matching feature is amazing! Found someone who shares my study habits and lifestyle.",
            altText: "Sarah avatar"
        }
    ]

    const slides = [
        [testimonials[0], testimonials[1]],
        [testimonials[2], testimonials[3]]
    ]

    const nextSlide = () => {
        setCurrentSlide(prev => prev + 1)
    }
    
    const prevSlide = () => {
        setCurrentSlide(prev => prev - 1)
    }

    return (
      <div className="bg-white mt-8 md:mt-16 pb-12 md:pb-20">
        <div className="mx-auto space-y-4 w-full max-w-[900px] pb-6  md:pb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center pt-6 md:pt-8 pb-3 md:pb-4 px-4">
            What Students Say About
            <span className="text-chart-4"> StudEx</span>
          </h2>
          <p className="text-[#595959] text-center px-4 text-sm md:text-base">
            Their words, not ours. Hear how StudEx is helping students save
            money, declutter, and connect <br className="hidden sm:block" />
            with roommates.
          </p>
        </div>

        <div className="relative ">

          {/* Arrow buttons */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`absolute left-1 sm:left-2 md:left-14 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 md:p-3 transition-all duration-200 ${
              currentSlide === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-chart-4 hover:bg-purple-200 cursor-pointer"
            }`}>
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === 1}
            className={`absolute right-1 sm:right-2 md:right-14 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 md:p-3 transition-all duration-200 ${
              currentSlide === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-chart-4 hover:bg-purple-200 cursor-pointer"
            }`}>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-2 sm:mx-4 md:mx-8 lg:mx-16 pt-6 pb-6">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slide, slideIndex) => (
                <div key={slideIndex} className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 min-w-full px-1 sm:px-2 md:px-4">
                  {slide.map((testimonial, cardIndex) => (
                    <TestimonialCardItem
                      key={`${slideIndex}-${cardIndex}`}
                      avatar={testimonial.avatar}
                      name={testimonial.name}
                      institution={testimonial.institution}
                      testimonial={testimonial.testimonial}
                      altText={testimonial.altText}
                    />
                  ))}
                </div>
              ))}
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