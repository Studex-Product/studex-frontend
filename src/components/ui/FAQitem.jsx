import React from "react"
import Down from '../../assets/icons/chevron-down.png'
import Up from '../../assets/icons/Icon.png'
import { useState } from "react"

function FAQ() {

    const [isOpen, setIsOpen] = useState(false)
    // const toggleFaq = () => {setIsOpen(!isOpen)}
    const toggleFaq = (itemId) => {
        setIsOpen(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    return(
        <div className="bg-[#F7EEFF] min-h-screen"> 
            <div className=' pt-24 pb-24 px-12 w-full max-w-[900px] mx-auto'>
                <h1 className='text-4xl font-semibold text-[#363636] text-center'>Frequently Asked Questions</h1>
                <p className='text-[#3A3A3A] text-xl font-medium pt-7 text-center'>Find quick answers to how StudEx works, from listing your first item to connecting with a trusted roommate.</p>

                        {/* Question / Answer 1 */}
                <div className="pt-8 border-b-2 border-[#DADADA] pb-7.5 ">

                    {/* Question */}
                    <div 
                    className={`font-medium text-[#101010] pb-2 flex items-center cursor-pointer transition-all duration-300 ease-in-out 
                        ${isOpen.q1
                        ? 'text-lg' 
                        : 'text-xl'
                        }
                        `}
                        onClick={() => toggleFaq('q1')}
                        >

                        <h3>Who can use StudEx?</h3>
                        <button 
                        className={`ml-auto bg-transparent border-none transition-all duration-300 ease-in-out cursor-pointer
                            ${isOpen.q1 
                            ? 'rotate-180' 
                            : 'rotate-0'
                            }
                            `} 
                        >
                           <img src={isOpen.q1 ? Up : Down} alt="toggle" />
                        </button>
                    </div>

                        {/* Answer */}
                    <div 
                    className={`text-base font- text-[#3A3A3A] overflow-hidden transition-all duration-500 ease-in-out 
                        ${isOpen.q1
                        ? 'max-h-96 opacity-100 pt-2' 
                        : 'max-h-0 opacity-0 pt-0'
                        }
                        `}
                    >
                        <p>Only verified students from recognized Nigerian universities can use StudEx. Verification keeps our community safe and ensures you are only dealing with genuine students</p>
                    </div>
                </div>

                        {/* Question / Answer 2 */}
                <div className="pt-8 border-b-2 border-[#DADADA] pb-7.5 ">

                    {/* Question */}
                    <div 
                    className={`font-medium text-[#101010] pb-2 flex items-center cursor-pointer transition-all duration-300 ease-in-out 
                        ${isOpen.q2
                        ? 'text-lg' 
                        : 'text-xl'
                        }
                        `}
                        onClick={() => toggleFaq('q2')}
                        >

                        <h3>Is verification compulsory</h3>
                        <button 
                        className={`ml-auto bg-transparent border-none transition-all duration-300 ease-in-out cursor-pointer
                            ${isOpen.q2 
                            ? 'rotate-180' 
                            : 'rotate-0'
                            }
                            `} 
                        >
                           <img src={isOpen.q2 ? Up : Down} alt="toggle" />
                        </button>
                    </div>

                        {/* Answer */}
                    <div 
                    className={`text-base font- text-[#3A3A3A] overflow-hidden transition-all duration-500 ease-in-out 
                        ${isOpen.q2
                        ? 'max-h-96 opacity-100 pt-2' 
                        : 'max-h-0 opacity-0 pt-0'
                        }
                        `}
                    >
                        <p>Only verified students from recognized Nigerian universities can use StudEx. Verification keeps our community safe and ensures you are only dealing with genuine students</p>
                    </div>
                </div>

                        {/* Question / Answer 3 */}
                 <div className="pt-8 border-b-2 border-[#DADADA] pb-7.5 ">

                    {/* Question */}
                    <div 
                    className={`font-medium text-[#101010] pb-2 flex items-center cursor-pointer transition-all duration-300 ease-in-out 
                        ${isOpen.q3
                        ? 'text-lg' 
                        : 'text-xl'
                        }
                        `}
                        onClick={() => toggleFaq('q3')}
                        >

                        <h3>How safe is buying and selling on StudEx?</h3>
                        <button 
                        className={`ml-auto bg-transparent border-none transition-all duration-300 ease-in-out cursor-pointer
                            ${isOpen.q3 
                            ? 'rotate-180' 
                            : 'rotate-0'
                            }
                            `} 
                        >
                           <img src={isOpen.q3 ? Up : Down} alt="toggle" />
                        </button>
                    </div>

                        {/* Answer */}
                    <div 
                    className={`text-base font- text-[#3A3A3A] overflow-hidden transition-all duration-500 ease-in-out 
                        ${isOpen.q3
                        ? 'max-h-96 opacity-100 pt-2' 
                        : 'max-h-0 opacity-0 pt-0'
                        }
                        `}
                    >
                        <p>Only verified students from recognized Nigerian universities can use StudEx. Verification keeps our community safe and ensures you are only dealing with genuine students</p>
                    </div>
                </div>

                        {/* Question / Answer 4 */}
                <div className="pt-8 border-b-2 border-[#DADADA] pb-7.5 ">

                    {/* Question */}
                    <div 
                    className={`font-medium text-[#101010] pb-2 flex items-center cursor-pointer transition-all duration-300 ease-in-out 
                        ${isOpen.q4
                        ? 'text-lg' 
                        : 'text-xl'
                        }
                        `}
                        onClick={() => toggleFaq('q4')}
                        >

                        <h3>What kind of items can I sell on StudEx?</h3>
                        <button 
                        className={`ml-auto bg-transparent border-none transition-all duration-300 ease-in-out cursor-pointer
                            ${isOpen.q4 
                            ? 'rotate-180' 
                            : 'rotate-0'
                            }
                            `} 
                        >
                           <img src={isOpen.q4 ? Up : Down} alt="toggle" />
                        </button>
                    </div>

                        {/* Answer */}
                    <div 
                    className={`text-base font- text-[#3A3A3A] overflow-hidden transition-all duration-500 ease-in-out 
                        ${isOpen.q4
                        ? 'max-h-96 opacity-100 pt-2' 
                        : 'max-h-0 opacity-0 pt-0'
                        }
                        `}
                    >
                        <p>Only verified students from recognized Nigerian universities can use StudEx. Verification keeps our community safe and ensures you are only dealing with genuine students</p>
                    </div>
                </div> 

                      {/* Question / Answer 5 */}
                <div className="pt-8 border-b-2 border-[#DADADA] pb-7.5 ">

                    {/* Question */}
                    <div 
                    className={`font-medium text-[#101010] pb-2 flex items-center cursor-pointer transition-all duration-300 ease-in-out 
                        ${isOpen.q5
                        ? 'text-lg' 
                        : 'text-xl'
                        }
                        `}
                        onClick={() => toggleFaq('q5')}
                        >

                        <h3>Is it free to list an item?</h3>
                        <button 
                        className={`ml-auto bg-transparent border-none transition-all duration-300 ease-in-out cursor-pointer
                            ${isOpen.q5 
                            ? 'rotate-180' 
                            : 'rotate-0'
                            }
                            `} 
                        >
                           <img src={isOpen.q5 ? Up : Down} alt="toggle" />
                        </button>
                    </div>

                        {/* Answer */}
                    <div 
                    className={`text-base font- text-[#3A3A3A] overflow-hidden transition-all duration-500 ease-in-out 
                        ${isOpen.q5
                        ? 'max-h-96 opacity-100 pt-2' 
                        : 'max-h-0 opacity-0 pt-0'
                        }
                        `}
                    >
                        <p>Only verified students from recognized Nigerian universities can use StudEx. Verification keeps our community safe and ensures you are only dealing with genuine students</p>
                    </div>
                </div>

                        {/* Question / Answer 6 */}
                <div className="pt-8  pb-7.5 ">

                    {/* Question */}
                    <div 
                    className={`font-medium text-[#101010] pb-2 flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out 
                        ${isOpen.q6
                        ? 'text-lg' 
                        : 'text-xl'
                        }
                        `}
                        onClick={() => toggleFaq('q6')}
                        >

                        <h3>Can I sell to students from other universities?</h3>
                        <button 
                        className={`ml-auto bg-transparent border-none transition-all duration-300 ease-in-out cursor-pointer
                            ${isOpen.q6 
                            ? 'rotate-180' 
                            : 'rotate-0'
                            }
                            `} 
                        >
                           <img src={isOpen.q6 ? Up : Down} alt="toggle" />
                        </button>
                    </div>

                        {/* Answer */}
                    <div 
                    className={`text-base font- text-[#3A3A3A] overflow-hidden transition-all duration-500 ease-in-out 
                        ${isOpen.q6
                        ? 'max-h-96 opacity-100 pt-2' 
                        : 'max-h-0 opacity-0 pt-0'
                        }
                        `}
                    >
                        <p>Only verified students from recognized Nigerian universities can use StudEx. Verification keeps our community safe and ensures you are only dealing with genuine students</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FAQ