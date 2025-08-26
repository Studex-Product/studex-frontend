import Avatar1 from '../../assets/images/Ellipse 2195.png'
import Avatar2 from '../../assets/images/Ellipse 2196.png'
import { useState } from 'react'
import Left from '../../assets/icons/keyboard_arrow_left_40dp_7B2CBF_FILL0_wght400_GRAD0_opsz40.svg'
import Right from '../../assets/icons/keyboard_arrow_right_40dp_7B2CBF_FILL0_wght400_GRAD0_opsz40.svg'

const Testimonial = () => {

    const [currentSlide, setCurrentSlide] = useState(0)

    const nextSlide = () => {

        setCurrentSlide(prev => prev + 1)
    }
    const prevSlide = () => {
        setCurrentSlide(prev => prev - 1)
    }

    return(
        <div className="bg-background mt-16">
            <div className="mx-auto w-full max-w-[900px] pb-12">
                <h2 className="text-3xl font-semibold text-center pt-8 pb-8">What Students Say About <span className="text-chart-4">StudEx</span> </h2>
                <p className="text-ring font-medium text-center">Their words, not ours. Hear how StudEx is helping students save money, declutter, and connect <br /> with roommates.</p>
            </div>

            <div className='relative'>

                 {/* Arrow buttons */}
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className='absolute left-[7%] top-[70%] transform -translate-y-1/2 z-10 bg-purple-200 rounded-full p-3 cursor-pointer'
                    >
                        <img src={Left} alt="Left arrow" />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === 1}
                        className='absolute right-[7%] transform -translate-y-1/2 z-10 bg-purple-200 rounded-full p-3 top-[70%] cursor-pointer'
                    >
                        <img src={Right} alt="Right arrow" />
                    </button>

                    {/* Cards */}
                <div className='overflow-hidden'>
                    <div className='px-12 pt-16 flex gap-6 transition-transform duration-500'
                         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >   
                        {/* Slide 1 */}
                        <div
                            className='flex gap-7 justify-center min-w-full' 
                        >
                        
                            {/* Card 1 */}
                            <div className="border-2 border-border rounded-lg max-w-3xl w-full py-4 px-8">
                                <div className="flex items-center gap-4 pb-6">
                                    <div>
                                        <img src={Avatar1} alt="avatar" />
                                    </div>
                                    <div>
                                        <h3 className=' text-3xl font-semibold text-[#363636]'>Emeka, <span className='text-lg'>Covenant University</span></h3>
                                    </div>
                                </div>
                                <p className='text-lg text-[#363636]'>“I've bought clothes, sold gadgets and even met a cool roommate. It feels like a real student marketplace.”</p>
                            </div>

                                {/* Card 2 */}
                            <div className="border-2 border-border rounded-lg max-w-3xl w-full py-4 px-8">
                                <div className="flex items-center gap-4 pb-6">
                                    <div>
                                        <img src={Avatar2} alt="avatar" />
                                    </div>
                                    <div>
                                        <h3 className=' text-3xl font-semibold text-[#363636]'>Veronica, <span className='text-lg'>UI</span></h3>
                                    </div>
                                </div>
                                <p className='text-lg text-[#363636]'>“I sold two old laptops in one week. No stress, and I met real buyers fast.  StudEx is my go-to now”</p>
                            </div>
                            
                        </div>

                        {/* Slide 2 */}
                        <div className='flex gap-7 min-w-full justify-center' >

                            {/* Card 3 */}
                            <div className="border-2 border-border rounded-lg max-w-3xl w-full py-4 px-8">
                                <div className="flex items-center gap-4 pb-6">
                                    <div>
                                        <img src={Avatar2} alt="avatar" />
                                    </div>
                                    <div>
                                        <h3 className=' text-3xl font-semibold text-[#363636]'>Veronica, <span className='text-lg'>UI</span></h3>
                                    </div>
                                </div>
                                <p className='text-lg text-[#363636]'>“I sold two old laptops in one week. No stress, and I met real buyers fast.  StudEx is my go-to now”</p>
                            </div>
                            {/* Card 4 */}
                            <div className="border-2 border-border rounded-lg max-w-3xl w-full py-4 px-8">
                                <div className="flex items-center gap-4 pb-6">
                                    <div>
                                        <img src={Avatar2} alt="avatar" />
                                    </div>
                                    <div>
                                        <h3 className=' text-3xl font-semibold text-[#363636]'>Veronica, <span className='text-lg'>UI</span></h3>
                                    </div>
                                </div>
                                <p className='text-lg text-[#363636]'>“I sold two old laptops in one week. No stress, and I met real buyers fast.  StudEx is my go-to now”</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Testimonial