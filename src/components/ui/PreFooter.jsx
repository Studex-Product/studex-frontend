import PreFooterImg from "../../assets/images/PreFooterImg.jpg";
import { Link } from "react-router-dom";
const PreFooter = () => {
  return (
    <section className="bg-[#9046CF] gap-10 md:gap-14 flex flex-col md:flex-row items-center justify-around px-4 md:px-12 py-10 md:py-16">
      <div className="rounded-lg w-full  bg-[#9046CF] shadow-lg ">
        <img src={PreFooterImg} alt="a student smiling at her phone" className="w-full h-full object-cover rounded-lg"/>
      </div>
      <div className="flex w-full flex-col md:px-4  gap-6 items-center max-w-xl text-white">
        <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          On Campus or Off, You’re Always In{" "}
        </h4>
        <p className="text-center">
          Whether you’re in class, at home, or on the go, StudEx stays with you.
          Buy, sell, and connect anytime, anywhere.
        </p>
        <Link to="/register" className="bg-white text-[#9046CF] text-center hover:bg-purple-100 w-full md:w-1/2 px-6 py-3 rounded-md  transition-colors duration-300">
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default PreFooter;
