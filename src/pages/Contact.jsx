import Header from "@/components/common/Header";
import Footer from "@/components/ui/Footer";

const Contact = () => {
    return ( 
        <>
        <Header />
        <main className="flex flex-col justify-center items-center my-10 px-2  ">
        <h1 className=" text-purple-600 font-semibold text-[32px] lg:text-[40px] leading-[100%] tracking-[0] ">
Get in Touch        </h1>
        <p className=" text-gray-500 font-normal text-[14px] lg:text-[18px] leading-[27px] tracking-[0] mx-3 lg:mx-0 lg:w-3xl mt-3 text-center">
We’re here to help whether you have a question, feedback, or need support, we’ll listen and respond as quickly as we can.        </p>
        <form className="flex flex-col bg-white shadow-2xl  rounded gap-4 mt-6 w-full max-w-md px-4 py-4">
            <p>We’d love to hear from you. Please fill out this form.</p>
          <div className="flex md:flex-row flex-col gap-4 w-full">
            <div className="w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
             First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="eg.Fatima"
            />
            </div>
            <div className="w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
Last Name            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="eg.Yusuf"
              />
              </div>
          </div>
          <div className="">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="e.g fatimayusuf@unilag.edu.ng"            />            
          </div>          
          <div className="">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="phone"
              placeholder="+234 56789022"            />            
          </div>          
          <div className="">                                                                                    
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message    
            </label>            
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="message"
              placeholder="Enter a description...."
            ></textarea>            
          </div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </form>
      </main>
        <Footer/>
        </>
     );
}
 
export default Contact;
