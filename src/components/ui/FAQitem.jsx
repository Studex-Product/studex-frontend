import React from "react"
import Down from '@/assets/icons/chevron-down.svg'
import Up from '@/assets/icons/chevron-up.svg'
import { useState } from "react"

const FAQItem = ({ id, question, answer, isOpen, onToggle }) => {
    return (
        <div className={`pt-8 ${id === 'q6' ? '' : 'border-b-2 border-[#DADADA]'} pb-7.5`}>
            <div 
                className={`font-medium  text-[#101010] md:pb-2 flex items-center cursor-pointer transition-all duration-300 ease-in-out 
                    ${isOpen ? 'text-md' : 'text-lg'}
                `}
                onClick={() => onToggle(id)}
            >
                <h3>{question}</h3>
                <button 
                    className={`ml-auto bg-transparent border-none transition-all duration-300 ease-in-out cursor-pointer
                        ${isOpen ? 'rotate-180' : 'rotate-0'}
                    `} 
                >
                    <img src={isOpen ? Up : Down} alt="toggle" />
                </button>
            </div>
            
            <div 
                className={`text-base text-[#3A3A3A] overflow-hidden transition-all duration-500 ease-in-out 
                    ${isOpen ? 'max-h-96 opacity-100 pt-2' : 'max-h-0 opacity-0 pt-0'}
                `}
            >
                <p>{answer}</p>
            </div>
        </div>
    );
};

function FAQ() {
    const [isOpen, setIsOpen] = useState({})
    
    const toggleFaq = (itemId) => {
        setIsOpen(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const faqData = [
        {
            id: 'q1',
            question: 'Who can use StudEx?',
            answer: 'Any student from recognized Nigerian universities can fully use all the features StudEx offers. e.g listing items, finding roommates, and accessing student services.'
        },
        {
            id: 'q2',
            question: 'Is verification compulsory?',
            answer: 'Yes, verification is compulsory. Only verified students from recognized Nigerian universities can use fully StudEx. Verification keeps our community safe and ensures you are only dealing with genuine students'
        },
        {
            id: 'q3',
            question: 'How safe is buying and selling on StudEx?',
            answer: 'Buying and selling on StudEx is safe. We prioritize user safety through our verification process, in-app warnings, a reporting system, and a review system that promotes trust within our community.'
        },
        {
            id: 'q4',
            question: 'What kind of items can I sell on StudEx?',
            answer: 'You can sell a wide range of items on StudEx, including textbooks, electronics, furniture, clothing, and more. Just ensure that your items comply with our community guidelines and are appropriate for a student marketplace.'
        },
        {
            id: 'q5',
            question: 'Is it free to list an item?',
            answer: 'Yes, it is totally free to list an item on StudEx. However, only verified students can list items for sale.'
        },
        {
            id: 'q6',
            question: 'Can I sell to students from other universities?',
            answer: 'Yes, you can sell to students from other universities. But we recommend selling within your university for easier meetups and transactions.'
        }
    ];

    return(
        <div className="bg-[#F7EEFF] "> 
            <div className='px-4 py-12 md:pt-24 md:pb-24 md:px-12 w-full md:max-w-[80%] lg:max-w-[70%] mx-auto'>
                <h1 id ='faq' className='text-2xl md:text-3xl lg:text-4xl px-4 font-semibold text-[#363636] text-center'>Frequently Asked Questions</h1>
                <p className='text-[#3A3A3A] md:text-xl pt-7 text-center'>Find quick answers to how StudEx works, from listing your first item to connecting with a trusted roommate.</p>

                {faqData.map((faq) => (
                    <FAQItem
                        key={faq.id}
                        id={faq.id}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={isOpen[faq.id]}
                        onToggle={toggleFaq}
                    />
                ))}
            </div>
        </div>
    )
}

export default FAQ